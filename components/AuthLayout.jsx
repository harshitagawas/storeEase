"use client";

import { useTheme } from "next-themes";

export default function AuthLayout({ title, children }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Navbar with branding only */}
      <nav
        className="w-full backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: "var(--background)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Branding */}
          <h1
            className="text-xl font-semibold tracking-wide"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--foreground)",
            }}
          >
            StoreEase
          </h1>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--foreground)",
              border: `1px solid var(--border-color)`,
            }}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {/* Auth Form Container */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div
          className="w-full max-w-md rounded-2xl p-8 shadow-lg border transition-colors duration-300"
          style={{
            backgroundColor: "var(--card-background)",
            borderColor: "var(--card-border)",
            color: "var(--foreground)",
          }}
        >
          <h2
            className="text-2xl font-semibold mb-6 text-center"
            style={{
              fontFamily: "var(--font-headline)",
              color: "var(--foreground)",
            }}
          >
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}
