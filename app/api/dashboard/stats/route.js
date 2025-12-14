export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for the current user
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all user files
    const files = await prisma.file.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Calculate KPIs
    const totalFiles = files.length;
    const totalStorageBytes = files.reduce((sum, file) => sum + file.size, 0);
    const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);

    // File type categorization
    const fileTypes = {
      documents: 0,
      images: 0,
      videos: 0,
      other: 0,
    };

    files.forEach((file) => {
      const type = file.type.toLowerCase();
      if (type.startsWith("image/")) {
        fileTypes.images++;
      } else if (type.startsWith("video/")) {
        fileTypes.videos++;
      } else if (
        type.includes("pdf") ||
        type.includes("document") ||
        type.includes("text") ||
        type.includes("word") ||
        type.includes("excel") ||
        type.includes("spreadsheet")
      ) {
        fileTypes.documents++;
      } else {
        fileTypes.other++;
      }
    });

    // Last upload time
    const lastUpload = files.length > 0 ? files[0].createdAt : null;

    // Storage limit (default free tier: 100MB)
    const storageLimitMB = 100;
    const storageUsedMB = parseFloat(totalStorageMB);
    const storagePercentage = (storageUsedMB / storageLimitMB) * 100;

    // File type distribution for charts
    const fileTypeDistribution = Object.entries(fileTypes).map(
      ([type, count]) => ({
        type,
        count,
      })
    );

    // Largest files (top 5)
    const largestFiles = files
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        createdAt: file.createdAt,
      }));

    // Recent files (last 10)
    const recentFiles = files.slice(0, 10).map((file) => ({
      id: file.id,
      name: file.name,
      type: file.type,
      createdAt: file.createdAt,
    }));

    return NextResponse.json({
      kpis: {
        totalFiles,
        totalStorageMB: parseFloat(totalStorageMB),
        fileTypes,
        lastUpload,
      },
      storage: {
        usedMB: storageUsedMB,
        limitMB: storageLimitMB,
        percentage: Math.min(storagePercentage, 100),
      },
      analytics: {
        fileTypeDistribution,
        largestFiles,
        recentFiles,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
