"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Folder } from "lucide-react";
import { useDialog } from "@/components/ui/Dialog";

/**
 * FolderCard Component
 * Displays a folder with navigation and deletion capability
 */
export default function FolderCard({ folder, viewMode = "grid", onDelete }) {
  const router = useRouter();
  const { showDialog } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = (e) => {
    // Don't navigate if clicking delete button
    if (e.target.closest("button")) {
      return;
    }
    router.push(`/dashboard/files?folder=${folder.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const fileCount = folder._count?.files || 0;
    const subfolderCount = folder._count?.children || 0;
    const hasContent = fileCount > 0 || subfolderCount > 0;

    if (hasContent) {
      // Show confirmation with cascade option
      showDialog({
        type: "confirm",
        title: "Delete Folder",
        message: `"${folder.name}" contains ${fileCount} file(s) and ${subfolderCount} subfolder(s). This action will permanently delete the folder and all its contents. This cannot be undone.`,
        confirmText: "Delete Everything",
        cancelText: "Cancel",
        onConfirm: async () => {
          await performDelete(true);
        },
      });
    } else {
      // Empty folder - simple confirmation
      showDialog({
        type: "confirm",
        title: "Delete Folder",
        message: `Are you sure you want to delete "${folder.name}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          await performDelete(false);
        },
      });
    }
  };

  const performDelete = async (cascade) => {
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/folders/delete?id=${folder.id}&cascade=${cascade}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete folder");
      }

      // Call parent's onDelete callback to refresh the list
      if (onDelete) {
        onDelete(folder.id);
      }
    } catch (error) {
      console.error("Delete error:", error);
      showDialog({
        type: "error",
        title: "Delete Failed",
        message: error.message || "Failed to delete folder. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
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
        className="flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors duration-200 group"
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
          <Folder
            size={24}
            style={{
              color: "var(--blue-sky)",
            }}
          />
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
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 p-2 rounded transition-all duration-200"
          style={{
            color: "var(--orange-bright)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Delete folder"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={handleClick}
      className="p-4 rounded-lg border cursor-pointer transition-colors duration-200 relative group"
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
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all duration-200"
        style={{
          color: "var(--orange-bright)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        title="Delete folder"
      >
        <Trash2 size={16} />
      </button>
      <div className="flex flex-col items-center text-center">
        <Folder
          size={40}
          style={{
            color: "var(--blue-sky)",
          }}
          className="mb-2"
        />
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


