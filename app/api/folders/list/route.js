import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";

/**
 * GET /api/folders/list
 * Fetches all folders for the authenticated user
 * Optional query param: parentId to filter by parent folder
 */
export async function GET(req) {
  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Get optional parentId and folderId from query params
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");
    const folderId = searchParams.get("folderId"); // For getting breadcrumb of a specific folder

    // Step 3: Build folder hierarchy for breadcrumb navigation
    const buildBreadcrumb = async (targetFolderId) => {
      const breadcrumb = [];
      let currentId = targetFolderId;

      while (currentId) {
        const folder = await prisma.folder.findUnique({
          where: { id: currentId },
          select: { id: true, name: true, parentId: true, userId: true },
        });

        if (!folder || folder.userId !== userId) break;

        breadcrumb.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      }

      return breadcrumb;
    };

    // Step 4: If folderId is provided, return breadcrumb for that folder
    if (folderId && folderId !== "null") {
      const breadcrumb = await buildBreadcrumb(folderId);
      return NextResponse.json({
        success: true,
        breadcrumb,
        folders: [], // No folders needed when just getting breadcrumb
      });
    }

    // Step 5: Fetch folders (children of parentId)
    const where = {
      userId,
      ...(parentId === null || parentId === "null"
        ? { parentId: null }
        : parentId
        ? { parentId }
        : {}),
    };

    const folders = await prisma.folder.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Step 6: If parentId is provided, get breadcrumb path for the parent
    let breadcrumb = [];
    if (parentId && parentId !== "null") {
      breadcrumb = await buildBreadcrumb(parentId);
    }

    return NextResponse.json({
      success: true,
      folders,
      breadcrumb,
    });
  } catch (error) {
    console.error("Folder list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}
