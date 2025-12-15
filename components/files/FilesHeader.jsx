"use client";

import { useRouter } from "next/navigation";
import { FolderPlus, Upload, Grid3x3, List } from "lucide-react";

/**
 * FilesHeader Component
 * Displays breadcrumb, actions (New Folder, Upload Files), and view toggle
 */
export default function FilesHeader({
  breadcrumb = [],
  currentFolderId = null,
  onCreateFolder,
  viewMode = "grid",
  onViewModeChange,
}) {
  const router = useRouter();

  const handleUploadClick = () => {
    // Redirect to upload page with folder context
    if (currentFolderId) {
      router.push(`/dashboard/upload?folder=${currentFolderId}`);
    } else {
      router.push("/dashboard/upload");
    }
  };

  const getBreadcrumbText = () => {
    if (breadcrumb.length === 0) {
      return "Home";
    }
    return breadcrumb.map((f) => f.name).join(" / ");
  };

  return (
    <div
      className="p-6 rounded-lg border mb-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-background)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Breadcrumb */}
      <div className="mb-4">
        <nav
          className="text-sm"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          {getBreadcrumbText()}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateFolder}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--foreground)",
              border: `1px solid var(--border-color)`,
              fontFamily: "var(--font-sora)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-secondary)";
            }}
          >
            <FolderPlus size={18} />
            New Folder
          </button>
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            style={{
              backgroundColor: "var(--blue-sky)",
              color: "white",
              fontFamily: "var(--font-sora)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <Upload size={18} />
            Upload Files
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
              viewMode === "grid" ? "opacity-100" : "opacity-50"
            }`}
            style={{
              backgroundColor:
                viewMode === "grid"
                  ? "var(--sidenav-active)"
                  : "var(--background-secondary)",
              color: "var(--foreground)",
              fontFamily: "var(--font-sora)",
            }}
            onMouseEnter={(e) => {
              if (viewMode !== "grid") {
                e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== "grid") {
                e.currentTarget.style.backgroundColor =
                  "var(--background-secondary)";
              }
            }}
          >
            <Grid3x3 size={16} />
            Grid
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
              viewMode === "list" ? "opacity-100" : "opacity-50"
            }`}
            style={{
              backgroundColor:
                viewMode === "list"
                  ? "var(--sidenav-active)"
                  : "var(--background-secondary)",
              color: "var(--foreground)",
              fontFamily: "var(--font-sora)",
            }}
            onMouseEnter={(e) => {
              if (viewMode !== "list") {
                e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== "list") {
                e.currentTarget.style.backgroundColor =
                  "var(--background-secondary)";
              }
            }}
          >
            <List size={16} />
            List
          </button>
        </div>
      </div>
    </div>
  );
}

