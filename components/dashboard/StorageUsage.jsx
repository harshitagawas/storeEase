/**
 * StorageUsage Component
 * Visualizes storage consumption with progress bar
 */
export default function StorageUsage({ usedMB, limitMB, percentage }) {
  const formatBytes = (mb) => {
    if (mb < 1) {
      return `${(mb * 1024).toFixed(0)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const getStorageColor = () => {
    if (percentage >= 90) return "var(--orange-bright)";
    if (percentage >= 70) return "var(--blue-sky)";
    return "var(--blue-sky)";
  };

  return (
    <div
      className="p-6 rounded-lg border transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-background)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Storage Usage
        </h3>
        <span
          className="text-sm font-medium"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          {formatBytes(usedMB)} / {formatBytes(limitMB)}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="relative w-full h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--background-secondary)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: getStorageColor(),
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <span
          className="text-xs"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          {percentage.toFixed(1)}% used
        </span>
        {percentage >= 80 && (
          <span
            className="text-xs font-medium"
            style={{
              color: "var(--orange-bright)",
              fontFamily: "var(--font-sora)",
            }}
          >
            Consider upgrading
          </span>
        )}
      </div>
    </div>
  );
}
