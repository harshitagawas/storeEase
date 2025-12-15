import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";

/**
 * GET /api/user/current
 * Returns current user's email and verification status
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
