import { FileText, Image, Receipt, Zap } from "lucide-react";

/**
 * AISuggestions Component
 * Displays AI-powered insights and suggestions
 * Uses structured mock data that can be replaced with real AI responses
 */
export default function AISuggestions({ fileCount, fileTypes }) {
  // Mock AI insights (structured for real AI service integration)
  const generateMockInsights = () => {
    const insights = [];

    // Only show insights if there are files
    if (fileCount === 0) {
      return insights;
    }

    // Documents suitable for summarization
    if (fileTypes?.documents > 0) {
      insights.push({
        id: "1",
        type: "summarization",
        title: `${Math.min(
          fileTypes.documents,
          3
        )} documents suitable for summarization`,
        description: "AI can generate concise summaries for your documents",
        action: "View documents",
        icon: FileText,
        priority: "medium",
      });
    }

    // Images missing descriptions
    if (fileTypes?.images > 0) {
      insights.push({
        id: "2",
        type: "description",
        title: `${Math.min(fileTypes.images, 2)} images missing descriptions`,
        description: "Add AI-generated descriptions to improve searchability",
        action: "Add descriptions",
        icon: Image,
        priority: "low",
      });
    }

    // Invoices detected
    if (fileTypes?.documents > 0) {
      insights.push({
        id: "3",
        type: "invoice",
        title: "Invoices detected in recent uploads",
        description: "AI can extract key information from invoice documents",
        action: "Extract data",
        icon: Receipt,
        priority: "high",
      });
    }

    // Storage optimization
    if (fileCount > 10) {
      insights.push({
        id: "4",
        type: "optimization",
        title: "Storage optimization available",
        description: "AI can identify duplicate or unused files",
        action: "Optimize storage",
        icon: Zap,
        priority: "low",
      });
    }

    return insights;
  };

  const insights = generateMockInsights();

  const getPriorityColor = (priority) => {
    const colors = {
      high: "var(--orange-bright)",
      medium: "var(--blue-sky)",
      low: "var(--foreground-secondary)",
    };
    return colors[priority] || "var(--foreground-secondary)";
  };

  if (insights.length === 0) {
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
          AI Insights
        </h3>
        <p
          className="text-sm text-center py-8"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Upload files to get AI-powered insights
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
      <div className="flex items-center gap-2 mb-4">
        <h3
          className="text-lg font-semibold"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          AI Insights
        </h3>
        <span
          className="text-xs px-2 py-1 rounded"
          style={{
            backgroundColor: "var(--sidenav-active)",
            color: "var(--sidenav-text)",
            fontFamily: "var(--font-sora)",
          }}
        >
          {insights.length} suggestions
        </span>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-lg border transition-all duration-200 hover:scale-[1.01]"
            style={{
              backgroundColor: "var(--background-secondary)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="shrink-0"
                style={{ color: getPriorityColor(insight.priority) }}
              >
                <insight.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className="text-sm font-semibold"
                    style={{
                      color: "var(--foreground)",
                      fontFamily: "var(--font-sora)",
                    }}
                  >
                    {insight.title}
                  </h4>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: getPriorityColor(insight.priority),
                    }}
                  />
                </div>
                <p
                  className="text-xs mb-2"
                  style={{
                    color: "var(--foreground-secondary)",
                    fontFamily: "var(--font-sora)",
                  }}
                >
                  {insight.description}
                </p>
                <button
                  className="text-xs font-medium transition-opacity hover:opacity-80"
                  style={{
                    color: "var(--blue-sky)",
                    fontFamily: "var(--font-sora)",
                  }}
                >
                  {insight.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
