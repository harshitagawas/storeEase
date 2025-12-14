"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

/**
 * Minimal Dashboard Header Component
 *
 * Features:
 * - Dynamic page title based on current route
 * - Light/Dark theme toggle
 * - Optional user avatar placeholder
 * - Clean, enterprise-style design
 * - Uses SideNav color scheme for consistency
 * - Scrolls naturally with content (not fixed)
 */
export default function DashboardHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Map routes to page titles
  const getPageTitle = () => {
    const routeMap = {
      "/dashboard": "Dashboard",
      "/dashboard/files": "Files",
      "/dashboard/upload": "Upload",
      "/dashboard/ai": "AI Insights",
      "/dashboard/settings": "Settings",
    };

    // Check exact match first
    if (routeMap[pathname]) {
      return routeMap[pathname];
    }

    // Check for nested routes
    for (const [route, title] of Object.entries(routeMap)) {
      if (pathname.startsWith(route) && route !== "/dashboard") {
        return title;
      }
    }

    // Default fallback
    return "Dashboard";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Determine icon based on current theme (default to dark if undefined)
  const isDark = theme === "dark" || theme === undefined;

  return (
    <header
      className="h-14 flex items-center justify-between px-6 mb-6 border-b transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--sidenav-border)",
      }}
    >
      {/* Left Section - Page Title */}
      <div className="flex items-center">
        <h1
          className="text-lg font-semibold"
          style={{
            fontFamily: "var(--font-sora)",
            color: "var(--foreground)",
          }}
        >
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "var(--background-secondary)",
            color: "var(--foreground)",
            border: `1px solid var(--border-color)`,
          }}
          aria-label="Toggle theme"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--background-secondary)";
          }}
        >
          {isDark ? (
            <span className="text-base">☀️</span>
          ) : (
            <span className="text-base">🌙</span>
          )}
        </button>

        {/* User Avatar Placeholder */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium"
          style={{
            backgroundColor: "var(--sidenav-active)",
            color: "var(--sidenav-text)",
            fontFamily: "var(--font-sora)",
          }}
        >
          U
        </div>
      </div>
    </header>
  );
}
