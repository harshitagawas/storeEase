"use client";

import { useRouter } from "next/navigation";

/**
 * FolderCard Component
 * Displays a folder with navigation capability
 */
export default function FolderCard({ folder, viewMode = "grid" }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/files?folder=${folder.id}`);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={handleClick}
        className="flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors duration-200"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--card-background)";
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="text-2xl"
            style={{
              color: "var(--blue-sky)",
            }}
          >
            📁
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold truncate"
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-sora)",
              }}
              title={folder.name}
            >
              {folder.name}
            </h3>
            <p
              className="text-sm mt-1"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              {folder._count?.files || 0} files, {folder._count?.children || 0}{" "}
              folders
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={handleClick}
      className="p-4 rounded-lg border cursor-pointer transition-colors duration-200"
      style={{
        backgroundColor: "var(--card-background)",
        borderColor: "var(--card-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--card-background)";
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="text-4xl mb-2"
          style={{
            color: "var(--blue-sky)",
          }}
        >
          📁
        </div>
        <h3
          className="text-sm font-semibold truncate w-full"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
          title={folder.name}
        >
          {folder.name}
        </h3>
        <p
          className="text-xs mt-1"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          {folder._count?.files || 0} files
        </p>
      </div>
    </div>
  );
}


