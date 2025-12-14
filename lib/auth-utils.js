import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
