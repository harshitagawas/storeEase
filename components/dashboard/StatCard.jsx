/**
 * StatCard Component
 * Displays a single KPI metric in a clean card format
 */
export default function StatCard({ title, value, subtitle, icon }) {
  return (
    <div
      className="p-6 rounded-lg border transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-background)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-medium mb-1"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            {title}
          </p>
          <h3
            className="text-2xl font-semibold mb-1"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-sora)",
            }}
          >
            {value}
          </h3>
          {subtitle && (
            <p
              className="text-xs"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="text-2xl opacity-60"
            style={{ color: "var(--foreground-secondary)" }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
