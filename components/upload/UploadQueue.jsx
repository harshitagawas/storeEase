"use client";

/**
 * UploadQueue Component
 * Displays real-time upload status for files
 */
export default function UploadQueue({ uploads = [] }) {
  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "uploading":
        return "var(--blue-sky)";
      case "success":
        return "#10b981"; // green
      case "failed":
        return "var(--orange-bright)";
      default:
        return "var(--foreground-secondary)";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "success":
        return "Success";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  if (uploads.length === 0) {
    return (
      <div
        className="p-6 rounded-lg border transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
      >
        <h3
          className="text-lg font-semibold mb-4"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Upload Queue
        </h3>
        <p
          className="text-sm text-center py-8"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          No files in queue
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg border transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-background)",
        borderColor: "var(--card-border)",
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{
          color: "var(--foreground)",
          fontFamily: "var(--font-sora)",
        }}
      >
        Upload Queue
      </h3>

      <div className="space-y-3">
        {uploads.map((upload, index) => (
          <div
            key={upload.id || index}
            className="flex items-center justify-between p-3 rounded-lg"
            style={{
              backgroundColor: "var(--background-secondary)",
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
                title={upload.name}
              >
                {upload.name}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span
                  className="text-xs"
                  style={{
                    color: "var(--foreground-secondary)",
                    fontFamily: "var(--font-sora)",
                  }}
                >
                  {formatBytes(upload.size)}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: getStatusColor(upload.status),
                    fontFamily: "var(--font-sora)",
                  }}
                >
                  {getStatusText(upload.status)}
                </span>
              </div>
            </div>
            {upload.status === "uploading" && (
              <div className="ml-3">
                <div
                  className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: "var(--blue-sky)",
                    borderTopColor: "transparent",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
