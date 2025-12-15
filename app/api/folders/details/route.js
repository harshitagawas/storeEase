import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";

/**
 * GET /api/folders/details
 * Fetches folder details including children folders and files
 * Query params:
 * - id: Folder ID
 */
export async function GET(req) {
  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Get folder ID from query params
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("id");

    if (!folderId) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }

    // Step 3: Fetch folder and verify ownership
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId, // Ensure folder belongs to the user
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
    });

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found or access denied" },
        { status: 404 }
      );
    }

    // Step 4: Fetch child folders
    const childFolders = await prisma.folder.findMany({
      where: {
        userId,
        parentId: folderId,
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

    // Step 5: Fetch files in this folder
    const files = await prisma.file.findMany({
      where: {
        ownerId: userId,
        folderId: folderId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Step 6: Build breadcrumb
    const breadcrumb = [];
    let currentId = folder.parentId;

    while (currentId) {
      const parentFolder = await prisma.folder.findUnique({
        where: { id: currentId },
        select: { id: true, name: true, parentId: true, userId: true },
      });

      if (!parentFolder || parentFolder.userId !== userId) break;

      breadcrumb.unshift({ id: parentFolder.id, name: parentFolder.name });
      currentId = parentFolder.parentId;
    }

    // Add current folder to breadcrumb
    breadcrumb.push({ id: folder.id, name: folder.name });

    return NextResponse.json({
      success: true,
      folder: {
        ...folder,
        breadcrumb,
        children: childFolders,
        files,
      },
    });
  } catch (error) {
    console.error("Folder details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch folder details" },
      { status: 500 }
    );
  }
}



