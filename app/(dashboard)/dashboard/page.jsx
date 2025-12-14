import StatCard from "@/components/dashboard/StatCard";
import StorageUsage from "@/components/dashboard/StorageUsage";
import RecentActivity from "@/components/dashboard/RecentActivity";
import FileInsights from "@/components/dashboard/FileInsights";
import AISuggestions from "@/components/dashboard/AISuggestions";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";

/**
 * Dashboard Page
 * Fetches real data from the database and displays comprehensive analytics
 */
async function getDashboardData() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Fetch all user files
    const files = await prisma.file.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });

    // Calculate KPIs
    const totalFiles = files.length;
    const totalStorageBytes = files.reduce((sum, file) => sum + file.size, 0);
    const totalStorageMB = totalStorageBytes / (1024 * 1024);

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
    const storageUsedMB = totalStorageMB;
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

    return {
      kpis: {
        totalFiles,
        totalStorageMB,
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
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    // Return empty/default data on error
    return {
      kpis: {
        totalFiles: 0,
        totalStorageMB: 0,
        fileTypes: { documents: 0, images: 0, videos: 0, other: 0 },
        lastUpload: null,
      },
      storage: {
        usedMB: 0,
        limitMB: 100,
        percentage: 0,
      },
      analytics: {
        fileTypeDistribution: [],
        largestFiles: [],
        recentFiles: [],
      },
    };
  }
}

function formatDate(dateString) {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const { kpis, storage, analytics } = data;

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Files"
          value={kpis.totalFiles}
          subtitle="Files stored"
          icon="📁"
        />
        <StatCard
          title="Storage Used"
          value={`${kpis.totalStorageMB.toFixed(2)} MB`}
          subtitle={`${storage.percentage.toFixed(1)}% of ${
            storage.limitMB
          } MB`}
          icon="💾"
        />
        <StatCard
          title="File Types"
          value={
            Object.values(kpis.fileTypes).reduce((a, b) => a + b, 0) > 0
              ? Object.entries(kpis.fileTypes)
                  .filter(([_, count]) => count > 0)
                  .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1))
                  .join(", ")
              : "None"
          }
          subtitle="Active categories"
          icon="📊"
        />
        <StatCard
          title="Last Upload"
          value={formatDate(kpis.lastUpload)}
          subtitle="Most recent activity"
          icon="⬆️"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Storage & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <StorageUsage
            usedMB={storage.usedMB}
            limitMB={storage.limitMB}
            percentage={storage.percentage}
          />
          <FileInsights
            fileTypeDistribution={analytics.fileTypeDistribution}
            largestFiles={analytics.largestFiles}
          />
        </div>

        {/* Right Column - Activity & AI */}
        <div className="space-y-6">
          <RecentActivity recentFiles={analytics.recentFiles} />
          <AISuggestions
            fileCount={kpis.totalFiles}
            fileTypes={kpis.fileTypes}
          />
        </div>
      </div>
    </div>
  );
}
