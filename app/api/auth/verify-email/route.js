export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      // Get base URL from request if APP_URL is not set
      const baseUrl =
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      return NextResponse.redirect(
        `${baseUrl}/login?verified=false&error=invalid_token`
      );
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      const baseUrl =
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      return NextResponse.redirect(
        `${baseUrl}/login?verified=false&error=invalid_token`
      );
    }

    if (user.isVerified) {
      const baseUrl =
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      return NextResponse.redirect(
        `${baseUrl}/login?verified=true&message=already_verified`
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    const baseUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  } catch (err) {
    console.error("Verify email error:", err);
    const baseUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    return NextResponse.redirect(
      `${baseUrl}/login?verified=false&error=server_error`
    );
  }
}
