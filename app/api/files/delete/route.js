import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";
import { extractPublicIdFromUrl } from "@/lib/storage";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * DELETE /api/files/delete
 * Deletes a file from both Cloudinary and database
 * Query params:
 * - id: File ID
 */
export async function DELETE(req) {
  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Get file ID from query params
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Step 3: Verify file ownership and fetch file data
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId, // Ensure file belongs to the user
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );
    }

    // Step 4: Get Cloudinary public_id
    // If file has cloudId field, use it; otherwise extract from URL
    const cloudId = file.cloudId || extractPublicIdFromUrl(file.url);

    if (!cloudId) {
      return NextResponse.json(
        { error: "Unable to determine Cloudinary file ID" },
        { status: 400 }
      );
    }

    // Step 5: Determine resource type with backward compatibility
    // For old files without resourceType, infer from MIME type
    const resourceType =
      file.resourceType ||
      (file.type?.startsWith("image/")
        ? "image"
        : file.type?.startsWith("video/")
        ? "video"
        : "raw");

    // Log values for debugging
    console.log("Deleting from Cloudinary:");
    console.log("  cloudId:", cloudId);
    console.log("  resourceType:", resourceType);

    // Step 6: Delete file from Cloudinary first (STEP 4: Direct Cloudinary call)
    try {
      const response = await cloudinary.uploader.destroy(cloudId, {
        resource_type: resourceType,
      });

      // STEP 5: Log Cloudinary delete response
      console.log("Cloudinary delete response:", response);

      // Check if deletion was successful
      if (response.result !== "ok") {
        console.error("Cloudinary deletion failed:", response);
        return NextResponse.json(
          {
            error: "Failed to delete file from storage",
            details:
              response.result === "not found"
                ? "File not found in Cloudinary (check cloudId)"
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
      // If Cloudinary deletion fails, do NOT delete from DB
      return NextResponse.json(
        { error: "Failed to delete file from storage" },
        { status: 500 }
      );
    }

    // Step 7: Delete file metadata from database (only after successful Cloudinary deletion)
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("File delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
