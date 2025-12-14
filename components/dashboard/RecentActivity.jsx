/**
 * RecentActivity Component
 * Displays a timeline-style feed of recent activities
 * Currently uses mock data, structured for real logs later
 */
export default function RecentActivity({ recentFiles }) {
  // Mock activity data (structured for real logs later)
  const mockActivities = [
    {
      id: "1",
      type: "upload",
      message: "File uploaded",
      file: recentFiles?.[0]?.name || "document.pdf",
      timestamp: recentFiles?.[0]?.createdAt || new Date(),
      icon: "⬆️",
    },
    {
      id: "2",
      type: "qr",
      message: "QR code generated",
      file: recentFiles?.[1]?.name || "image.jpg",
      timestamp: recentFiles?.[1]?.createdAt || new Date(Date.now() - 3600000),
      icon: "📱",
    },
    {
      id: "3",
      type: "ai",
      message: "AI summary requested",
      file: recentFiles?.[2]?.name || "report.pdf",
      timestamp: recentFiles?.[2]?.createdAt || new Date(Date.now() - 7200000),
      icon: "🤖",
    },
  ];

  // Merge real file data with mock activities
  const activities =
    recentFiles && recentFiles.length > 0
      ? recentFiles.slice(0, 5).map((file, index) => ({
          id: file.id,
          type: "upload",
          message: "File uploaded",
          file: file.name,
          timestamp: file.createdAt,
          icon: "⬆️",
        }))
      : mockActivities;

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
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
          Recent Activity
        </h3>
        <p
          className="text-sm text-center py-8"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          No recent activity
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
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{
                backgroundColor: "var(--sidenav-active)",
                color: "var(--sidenav-text)",
              }}
            >
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {activity.message}
              </p>
              <p
                className="text-xs truncate"
                style={{
                  color: "var(--foreground-secondary)",
                  fontFamily: "var(--font-sora)",
                }}
                title={activity.file}
              >
                {activity.file}
              </p>
              <p
                className="text-xs mt-1"
                style={{
                  color: "var(--foreground-secondary)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
