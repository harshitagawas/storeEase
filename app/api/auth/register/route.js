export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);
    const token = generateToken();

    // Create user first
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        verificationToken: token,
      },
    });

    // Send verification email (if this fails, user is still created but can request resend)
    try {
      await sendVerificationEmail(email, token);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the registration, but log the error
      // User can request a new verification email later
    }

    return NextResponse.json({
      message: "Verification email sent. Please check your inbox.",
      success: true,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
