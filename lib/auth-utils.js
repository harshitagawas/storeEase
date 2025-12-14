import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

/**
 * Get current user ID from JWT token in cookies
 * Returns null if token is invalid or missing
 */
export async function getCurrentUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

/**
 * Get current user data (email and verification status)
 * Returns null if token is invalid or missing
 */
export async function getCurrentUser() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}
