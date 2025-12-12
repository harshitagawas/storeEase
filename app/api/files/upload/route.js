import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/storage";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req) {
  try {
    const form = await req.formData();

    const file = form.get("file");
    const userId = form.get("userId");

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // SAFE temp path for Windows + Linux + Vercel:
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, file.name);

    fs.writeFileSync(tempPath, buffer);

    // Upload to Cloudinary
    const url = await uploadToCloudinary(tempPath);

    // Save in DB
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        url,
        type: file.type,
        size: file.size,
        ownerId: userId,
      },
    });

    return NextResponse.json({ success: true, file: fileRecord });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
