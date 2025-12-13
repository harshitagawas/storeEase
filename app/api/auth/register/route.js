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

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        verificationToken: token,
      },
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json({
      message: "Verification email sent",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
