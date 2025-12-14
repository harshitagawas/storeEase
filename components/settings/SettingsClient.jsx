"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Key,
  LogOut,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useDialog } from "@/components/ui/Dialog";

/**
 * Settings Client Component
 * Handles all client-side interactions for settings
 */
export default function SettingsClient({ user }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { showDialog } = useDialog();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChangePassword = () => {
    router.push("/forgot-password");
  };

  const handleLogout = () => {
    showDialog({
      type: "confirm",
      title: "Logout",
      message: "Are you sure you want to logout?",
      confirmText: "Logout",
      cancelText: "Cancel",
      onConfirm: () => {
        // Clear authentication tokens
        localStorage.removeItem("token");
        document.cookie = "auth-token=; path=/; max-age=0";

        // Redirect to login
        router.push("/login");
      },
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-headline)",
          }}
        >
          Settings
        </h1>
        <p
          className="text-sm"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Section */}
      <div
        className="p-6 rounded-lg border transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Account
        </h2>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="text-sm font-medium block mb-2"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <Mail
                size={18}
                style={{ color: "var(--foreground-secondary)" }}
              />
              <input
                type="email"
                value={user.email}
                readOnly
                className="flex-1 px-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  color: "var(--foreground)",
                  border: `1px solid var(--border-color)`,
                  fontFamily: "var(--font-sora)",
                }}
              />
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <label
              className="text-sm font-medium block mb-2"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              Verification Status
            </label>
            <div className="flex items-center gap-2">
              {user.isVerified ? (
                <>
                  <CheckCircle2 size={18} style={{ color: "#10b981" }} />
                  <span
                    className="text-sm"
                    style={{
                      color: "#10b981",
                      fontFamily: "var(--font-sora)",
                    }}
                  >
                    Verified
                  </span>
                </>
              ) : (
                <>
                  <XCircle
                    size={18}
                    style={{ color: "var(--orange-bright)" }}
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: "var(--orange-bright)",
                      fontFamily: "var(--font-sora)",
                    }}
                  >
                    Not Verified
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div
        className="p-6 rounded-lg border transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Security
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleChangePassword}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--foreground)",
              border: `1px solid var(--border-color)`,
              fontFamily: "var(--font-sora)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-secondary)";
            }}
          >
            <Key size={18} />
            Change Password
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div
        className="p-6 rounded-lg border transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Preferences
        </h2>
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label
                className="text-sm font-medium block mb-1"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                Theme
              </label>
              <p
                className="text-xs"
                style={{
                  color: "var(--foreground-secondary)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                Choose between light and dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
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
              {!mounted ? (
                <Moon size={20} />
              ) : theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div
        className="p-6 rounded-lg border transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Account Actions
        </h2>
        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "rgba(239, 68, 68, 0.9)",
            border: `1px solid rgba(239, 68, 68, 0.3)`,
            fontFamily: "var(--font-sora)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
