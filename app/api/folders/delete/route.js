import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth-utils";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("id");
    const cascade = searchParams.get("cascade") === "true";

    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ownership check
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId },
      include: { files: true, children: true },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    if (!cascade && (folder.files.length > 0 || folder.children.length > 0)) {
      return NextResponse.json(
        { error: "Folder is not empty" },
        { status: 400 }
      );
    }

    // cascade delete
    await prisma.folder.delete({
      where: { id: folderId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete folder error:", err);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    );
  }
}
