import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";

/**
 * POST /api/folders/create
 * Creates a new folder with optional parent folder
 *
 * Request Body:
 * {
 *   "name": "Semester 6",
 *   "parentId": "optional-folder-id"
 * }
 */
export async function POST(req) {
  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Parse and validate request body
    const body = await req.json();
    const { name, parentId } = body;

    // Validate folder name
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Folder name is required and must be non-empty" },
        { status: 400 }
      );
    }

    // Step 3: If parentId exists, verify folder ownership
    if (parentId) {
      const parentFolder = await prisma.folder.findFirst({
        where: {
          id: parentId,
          userId: userId, // Ensure folder belongs to the user
        },
      });

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found or access denied" },
          { status: 404 }
        );
      }
    }

    // Step 4: Create folder in database
    const folder = await prisma.folder.create({
      data: {
        name: name.trim(),
        userId,
        parentId: parentId || null,
      },
    });

    // Step 5: Return created folder
    return NextResponse.json(
      {
        success: true,
        folder: {
          id: folder.id,
          name: folder.name,
          parentId: folder.parentId,
          createdAt: folder.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Folder creation error:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
