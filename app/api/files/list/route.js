import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";

/**
 * GET /api/files/list
 * Fetches files for the authenticated user
 * Query params:
 * - folderId: Optional folder ID (null for root)
 */
export async function GET(req) {
  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Get folderId from query params
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    // Step 3: Build where clause
    const where = {
      ownerId: userId,
      ...(folderId === null || folderId === "null" || !folderId
        ? { folderId: null }
        : { folderId }),
    };

    // Step 4: Fetch files
    const files = await prisma.file.findMany({
      where,
      include: {
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Files list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
