/**
 * FileInsights Component
 * Displays file analytics: type distribution, largest files, etc.
 */
export default function FileInsights({ fileTypeDistribution, largestFiles }) {
  const getFileTypeLabel = (type) => {
    const labels = {
      documents: "Documents",
      images: "Images",
      videos: "Videos",
      other: "Other",
    };
    return labels[type] || type;
  };

  const getFileTypeColor = (type) => {
    const colors = {
      documents: "var(--blue-sky)",
      images: "var(--purple-deep)",
      videos: "var(--orange-bright)",
      other: "var(--foreground-secondary)",
    };
    return colors[type] || "var(--foreground-secondary)";
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalFiles =
    fileTypeDistribution?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="space-y-6">
      {/* File Type Distribution */}
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
          File Type Distribution
        </h3>
        {totalFiles === 0 ? (
          <p
            className="text-sm text-center py-8"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            No files uploaded yet
          </p>
        ) : (
          <div className="space-y-3">
            {fileTypeDistribution?.map((item) => {
              const percentage =
                totalFiles > 0 ? (item.count / totalFiles) * 100 : 0;
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: "var(--foreground)",
                        fontFamily: "var(--font-sora)",
                      }}
                    >
                      {getFileTypeLabel(item.type)}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        color: "var(--foreground-secondary)",
                        fontFamily: "var(--font-sora)",
                      }}
                    >
                      {item.count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div
                    className="relative w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--background-secondary)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getFileTypeColor(item.type),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Largest Files */}
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
          Largest Files
        </h3>
        {!largestFiles || largestFiles.length === 0 ? (
          <p
            className="text-sm text-center py-8"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            No files uploaded yet
          </p>
        ) : (
          <div className="space-y-3">
            {largestFiles.map((file, index) => (
              <div
                key={file.id || index}
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
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: "var(--foreground-secondary)",
                      fontFamily: "var(--font-sora)",
                    }}
                  >
                    {formatBytes(file.size)}
                  </p>
                </div>
                <div
                  className="ml-3 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: "var(--sidenav-active)",
                    color: "var(--sidenav-text)",
                    fontFamily: "var(--font-sora)",
                  }}
                >
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
