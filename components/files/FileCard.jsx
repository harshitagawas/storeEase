"use client";

import {
  Image,
  Video,
  FileText,
  File,
  FileSpreadsheet,
  Presentation,
  Download,
  Trash2,
} from "lucide-react";
import { useDialog } from "@/components/ui/Dialog";

/**
 * FileCard Component
 * Displays a file with download and delete options
 */
export default function FileCard({
  file,
  viewMode = "grid",
  onDelete,
  onClick,
}) {
  const { showDialog } = useDialog();

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (type) => {
    const iconProps = { size: viewMode === "grid" ? 40 : 24 };
    if (type?.startsWith("image/")) return <Image {...iconProps} />;
    if (type?.startsWith("video/")) return <Video {...iconProps} />;
    if (type?.includes("pdf")) return <FileText {...iconProps} />;
    if (type?.includes("word") || type?.includes("document"))
      return <FileText {...iconProps} />;
    if (type?.includes("excel") || type?.includes("spreadsheet"))
      return <FileSpreadsheet {...iconProps} />;
    if (type?.includes("powerpoint") || type?.includes("presentation"))
      return <Presentation {...iconProps} />;
    return <File {...iconProps} />;
  };

  const handleDownload = () => {
    window.open(file.url, "_blank");
  };

  const handleDelete = async () => {
    showDialog({
      type: "confirm",
      title: "Delete File",
      message: `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/files/delete?id=${file.id}`, {
            method: "DELETE",
          });

          const data = await res.json();

          if (!res.ok) {
            showDialog({
              type: "error",
              title: "Delete Failed",
              message: data.error || "Failed to delete file",
            });
            return;
          }

          onDelete?.(file.id);
        } catch (error) {
          console.error("Delete error:", error);
          showDialog({
            type: "error",
            title: "Delete Failed",
            message: "Failed to delete file. Please try again.",
          });
        }
      },
    });
  };

  if (viewMode === "list") {
    return (
      <div
        className="flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 cursor-pointer"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--background-secondary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--card-background)";
        }}
      >
        <div
          className="flex items-center gap-3 flex-1 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ color: "var(--blue-sky)" }}>
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold truncate"
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-sora)",
              }}
              title={file.name}
            >
              {file.name}
            </h3>
            <p
              className="text-sm mt-1"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              {formatBytes(file.size)} •{" "}
              {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDownload}
            className="px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--foreground)",
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
            <Download size={14} />
            Download
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded text-sm font-medium transition-colors duration-200 flex items-center gap-1"
            style={{
              backgroundColor: "var(--orange-bright)",
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
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="p-4 rounded-lg border transition-colors duration-200 cursor-pointer"
      style={{
        backgroundColor: "var(--card-background)",
        borderColor: "var(--card-border)",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--background-secondary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--card-background)";
      }}
    >
      <div className="flex flex-col">
        <div
          className="flex items-center justify-center mb-3"
          style={{ color: "var(--blue-sky)" }}
        >
          {getFileIcon(file.type)}
        </div>
        <h3
          className="text-sm font-semibold truncate text-center mb-2"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
          title={file.name}
        >
          {file.name}
        </h3>
        <p
          className="text-xs text-center mb-3"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          {formatBytes(file.size)}
        </p>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleDownload}
            className="flex-1 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--foreground)",
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
            <Download size={12} />
            Download
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
            style={{
              backgroundColor: "var(--orange-bright)",
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
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
