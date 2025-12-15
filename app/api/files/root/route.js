import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";

/**
 * GET /api/files/root
 * Fetches root-level folders and files for the authenticated user
 */
export async function GET(req) {
  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Fetch root-level folders
    const folders = await prisma.folder.findMany({
      where: {
        userId,
        parentId: null,
      },
      include: {
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Step 3: Fetch root-level files
    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
        folderId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      folders,
      files,
    });
  } catch (error) {
    console.error("Root files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch root files" },
      { status: 500 }
    );
  }
}



