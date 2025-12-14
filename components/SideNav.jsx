"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Professional Dark Side Navigation Component
 *
 * Features:
 * - Always dark background (independent of theme)
 * - Active route highlighting
 * - Smooth hover states
 * - Clean, enterprise design
 * - Logout functionality
 */
export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items for main section
  const mainNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "📊",
    },
    {
      name: "Files",
      href: "/dashboard/files",
      icon: "📁",
    },
    {
      name: "Upload",
      href: "/dashboard/upload",
      icon: "⬆️",
    },
    {
      name: "AI Insights",
      href: "/dashboard/ai",
      icon: "🤖",
    },
  ];

  // Handle logout
  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem("token");
    document.cookie = "auth-token=; path=/; max-age=0";

    // Redirect to login
    router.push("/login");
  };

  // Check if a route is active
  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="h-screen flex flex-col rounded-r-2xl"
      style={{
        backgroundColor: "var(--sidenav-bg)",
        color: "var(--sidenav-text)",
        width: "260px",
      }}
    >
      {/* Top Section - Branding */}
      <div
        className="px-6 py-6 border-b"
        style={{ borderColor: "var(--sidenav-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{
              backgroundColor: "var(--blue-sky)",
              color: "white",
            }}
          >
            📦
          </div>
          <h1
            className="text-xl font-semibold"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--sidenav-text)",
            }}
          >
            StoreEase
          </h1>
        </div>
        <p
          className="text-xs mt-1"
          style={{
            color: "rgba(226, 232, 240, 0.6)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Smart Digital Locker
        </p>
      </div>

      {/* Main Navigation Section */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                    active ? "font-medium" : ""
                  }`}
                  style={{
                    backgroundColor: active
                      ? "var(--sidenav-active)"
                      : "transparent",
                    color: "var(--sidenav-text)",
                    fontFamily: "var(--font-sora)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor =
                        "var(--sidenav-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                      style={{
                        backgroundColor: "var(--blue-sky)",
                      }}
                    />
                  )}
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section - Settings & Logout */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: "var(--sidenav-border)" }}
      >
        <ul className="space-y-1">
          {/* Settings */}
          <li>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                isActive("/dashboard/settings") ? "font-medium" : ""
              }`}
              style={{
                backgroundColor: isActive("/dashboard/settings")
                  ? "var(--sidenav-active)"
                  : "transparent",
                color: "var(--sidenav-text)",
                fontFamily: "var(--font-sora)",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/dashboard/settings")) {
                  e.currentTarget.style.backgroundColor =
                    "var(--sidenav-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/dashboard/settings")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {isActive("/dashboard/settings") && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                  style={{
                    backgroundColor: "var(--blue-sky)",
                  }}
                />
              )}
              <span className="text-lg">⚙️</span>
              <span className="text-sm">Settings</span>
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left"
              style={{
                color: "rgba(239, 68, 68, 0.9)", // subtle red for logout
                fontFamily: "var(--font-sora)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(239, 68, 68, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span className="text-lg">🚪</span>
              <span className="text-sm">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
