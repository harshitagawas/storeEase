export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { sendResetPasswordEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({ message: "If user exists, email sent" });
    }

    const token = generateToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendResetPasswordEmail(email, token);

    return NextResponse.json({ message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
