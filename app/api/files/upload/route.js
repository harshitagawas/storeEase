export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/storage";
import { getCurrentUserId } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

/**
 * POST /api/files/upload
 * Uploads a file to Cloudinary and stores metadata in database
 *
 * FormData:
 * - file: File object
 * - folderId: Optional folder ID (null for root)
 */
export async function POST(req) {
  let cloudinaryPublicId = null;

  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Parse form data
    const form = await req.formData();
    const file = form.get("file");
    const folderId = form.get("folderId");

    // Step 3: Validate file exists
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Step 4: Validate file size (100MB limit)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    // Step 5: Validate MIME type (images, videos, PDFs, docs)
    const allowedTypes = [
      // Images
      /^image\//,
      // Videos
      /^video\//,
      // PDFs
      /^application\/pdf$/,
      // Documents
      /^application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
      /^application\/(vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/,
      /^application\/(vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation)$/,
      /^text\//,
    ];

    const isAllowedType = allowedTypes.some((pattern) =>
      pattern.test(file.type)
    );

    if (!isAllowedType) {
      return NextResponse.json(
        {
          error:
            "File type not allowed. Only images, videos, PDFs, and documents are supported.",
        },
        { status: 400 }
      );
    }

    // Step 6: If folderId provided, validate folder ownership
    if (folderId && folderId !== "null" && folderId !== "") {
      const folder = await prisma.folder.findFirst({
        where: {
          id: folderId,
          userId: userId, // Ensure folder belongs to the user
        },
      });

      if (!folder) {
        return NextResponse.json(
          { error: "Folder not found or access denied" },
          { status: 404 }
        );
      }
    }

    // Step 7: Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 8: Upload to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(buffer, userId, file.type);
      cloudinaryPublicId = cloudinaryResult.public_id;

      // STEP 1: Log Cloudinary public_id for verification
      console.log("Cloudinary public_id:", cloudinaryResult.public_id);
      console.log("Cloudinary resource_type:", cloudinaryResult.resource_type);
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // Step 9: Store metadata in database
    let fileRecord;
    try {
      fileRecord = await prisma.file.create({
        data: {
          name: file.name,
          url: cloudinaryResult.secure_url,
          cloudId: cloudinaryResult.public_id,
          resourceType: cloudinaryResult.resource_type, // Store resource type for deletion
          type: file.type,
          size: cloudinaryResult.bytes || file.size, // Use Cloudinary bytes if available
          ownerId: userId,
          folderId:
            folderId && folderId !== "null" && folderId !== ""
              ? folderId
              : null,
        },
      });
    } catch (dbError) {
      console.error("Database write error:", dbError);
      // Optionally: Clean up Cloudinary file if DB write fails
      // For now, we'll leave it (orphaned files can be cleaned up later)
      return NextResponse.json(
        { error: "Failed to save file metadata" },
        { status: 500 }
      );
    }

    // Step 10: Return success response
    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        name: fileRecord.name,
        url: fileRecord.url,
        type: fileRecord.type,
        size: fileRecord.size,
        folderId: fileRecord.folderId,
        createdAt: fileRecord.createdAt,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
