"use client";

import { useEffect } from "react";

/**
 * Drawer Component
 *
 * A reusable right-side drawer component that slides in from the right.
 * Closes when clicking outside or pressing Escape.
 *
 * @param {boolean} isOpen - Whether the drawer is open
 * @param {function} onClose - Callback when drawer should close
 * @param {ReactNode} children - Content to display in the drawer
 * @param {string} title - Optional title for the drawer
 */
export default function Drawer({ isOpen, onClose, children, title }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl shadow-2xl transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          backgroundColor: "var(--card-background)",
          borderLeft: "1px solid var(--card-border)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Content */}
        <div className="flex flex-col h-full">
          {/* Header */}
          {title && (
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{
                borderColor: "var(--card-border)",
              }}
            >
              <h2
                className="text-xl font-semibold"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors duration-200 hover:opacity-70"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  color: "var(--foreground)",
                }}
                aria-label="Close drawer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="15" y1="5" x2="5" y2="15" />
                  <line x1="5" y1="5" x2="15" y2="15" />
                </svg>
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
