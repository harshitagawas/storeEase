"use client";

import { useState, useEffect } from "react";
import {
  Image,
  Video,
  FileText,
  File,
  FileSpreadsheet,
  Presentation,
} from "lucide-react";
import Drawer from "@/components/common/Drawer";

/**
 * FilePreviewDrawer Component
 *
 * Displays file preview with AI summary (for documents) in a right-side drawer.
 * Automatically fetches summary when drawer opens for supported file types.
 *
 * @param {boolean} isOpen - Whether the drawer is open
 * @param {function} onClose - Callback when drawer should close
 * @param {object} file - File object to preview
 */
export default function FilePreviewDrawer({ isOpen, onClose, file }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if file type supports summarization
  const isDocumentType = (mimeType) => {
    if (!mimeType) return false;
    return (
      mimeType.includes("pdf") ||
      mimeType.includes("text") ||
      mimeType.includes("wordprocessingml") ||
      mimeType.includes("msword") ||
      mimeType.includes("docx") ||
      mimeType.includes("doc")
    );
  };

  // Check if file type is an image
  const isImageType = (mimeType) => {
    if (!mimeType) return false;
    // Supported image types: JPG, PNG, JPEG, WEBP
    return (
      mimeType.startsWith("image/") &&
      (mimeType.includes("jpeg") ||
        mimeType.includes("jpg") ||
        mimeType.includes("png") ||
        mimeType.includes("webp"))
    );
  };

  // Fetch summary when drawer opens (for documents)
  useEffect(() => {
    if (!isOpen || !file) {
      setSummary(null);
      setError(null);
      return;
    }

    // Only fetch for document types
    if (!isDocumentType(file.type)) {
      return;
    }

    // Check if summary already exists in file metadata
    if (file.aiMetadata?.summary) {
      setSummary(file.aiMetadata.summary);
      return;
    }

    // Fetch summary from API
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileId: file.id }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to generate summary");
        }

        setSummary(data.summary);
      } catch (err) {
        console.error("Summary fetch error:", err);
        setError(err.message || "Failed to load summary");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [isOpen, file]);

  // Don't render content if no file, but keep drawer mounted for animations
  if (!file) {
    return (
      <Drawer isOpen={false} onClose={onClose}>
        <div />
      </Drawer>
    );
  }

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (type) => {
    const iconProps = { size: 48 };
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

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={file.name}>
      <div className="space-y-6">
        {/* File Info */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--background-secondary)",
            borderColor: "var(--card-border)",
          }}
        >
          <div className="flex items-center gap-4">
            <div style={{ color: "var(--blue-sky)" }}>
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1">
              <h3
                className="text-lg font-semibold mb-1"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {file.name}
              </h3>
              <div
                className="text-sm space-x-4"
                style={{
                  color: "var(--foreground-secondary)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview Section */}
        {isImageType(file.type) && (
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: "var(--card-background)",
              borderColor: "var(--card-border)",
            }}
          >
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-auto max-h-96 object-contain"
              style={{
                backgroundColor: "var(--background-secondary)",
              }}
            />
          </div>
        )}

        {/* AI Summary Section (for documents) */}
        {isDocumentType(file.type) && (
          <div
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: "var(--card-background)",
              borderColor: "var(--card-border)",
            }}
          >
            <h3
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-sora)",
              }}
            >
              🧠 AI Summary
            </h3>

            {isLoading && (
              <div className="space-y-3">
                <div
                  className="h-4 rounded animate-pulse"
                  style={{ backgroundColor: "var(--background-secondary)" }}
                />
                <div
                  className="h-4 rounded animate-pulse"
                  style={{ backgroundColor: "var(--background-secondary)" }}
                />
                <div
                  className="h-4 rounded animate-pulse w-3/4"
                  style={{ backgroundColor: "var(--background-secondary)" }}
                />
              </div>
            )}

            {error && (
              <p
                className="text-sm"
                style={{
                  color: "var(--orange-bright)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {error}
              </p>
            )}

            {summary && !isLoading && (
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  color: "var(--foreground-secondary)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {summary}
              </p>
            )}

            {!summary && !isLoading && !error && (
              <p
                className="text-sm"
                style={{
                  color: "var(--foreground-secondary)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                Click to generate summary...
              </p>
            )}
          </div>
        )}

        {/* File Actions */}
        <div className="flex gap-3">
          {isDocumentType(file.type) && (
            <button
              onClick={() => window.open(file.url, "_blank")}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
              View
            </button>
          )}
          <button
            onClick={() => window.open(file.url, "_blank")}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
            Download
          </button>
        </div>
      </div>
    </Drawer>
  );
}
