"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
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

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--foreground)",
              border: `1px solid var(--border-color)`,
            }}
          >
            {!mounted ? (
              <>
                <Moon size={16} />
                Dark
              </>
            ) : theme === "dark" ? (
              <>
                <Sun size={16} />
                Light
              </>
            ) : (
              <>
                <Moon size={16} />
                Dark
              </>
            )}
          </button>

          {/* Auth Buttons */}
          <Link
            href="/login"
            className="text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "var(--foreground)" }}
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "var(--blue-sky)",
              boxShadow: `0 4px 14px 0 rgba(124, 160, 254, 0.3)`,
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
