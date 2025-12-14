"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";

/**
 * Dialog Context for managing global dialog state
 */
const DialogContext = createContext(null);

/**
 * Dialog Provider Component
 * Wraps the app to provide dialog functionality
 */
export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const showDialog = useCallback((config) => {
    setDialog(config);
  }, []);

  const hideDialog = useCallback(() => {
    setDialog(null);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {dialog && <DialogComponent {...dialog} onClose={hideDialog} />}
    </DialogContext.Provider>
  );
}

/**
 * Hook to use dialog context
 */
export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within DialogProvider");
  }
  return context;
}

/**
 * Dialog Component
 * Renders the actual dialog UI
 */
function DialogComponent({
  type = "info", // 'info', 'error', 'confirm'
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  onClose,
}) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Handle Escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Get colors based on type
  const getTypeColors = () => {
    switch (type) {
      case "error":
        return {
          iconBg: "rgba(239, 68, 68, 0.1)",
          iconColor: "#ef4444",
          confirmBg: "#ef4444",
        };
      case "confirm":
        return {
          iconBg: "rgba(59, 130, 246, 0.1)",
          iconColor: "#3b82f6",
          confirmBg: "var(--blue-sky)",
        };
      default: // info
        return {
          iconBg: "rgba(59, 130, 246, 0.1)",
          iconColor: "#3b82f6",
          confirmBg: "var(--blue-sky)",
        };
    }
  };

  const colors = getTypeColors();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="w-full max-w-md rounded-lg border shadow-lg"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <h2
            id="dialog-title"
            className="text-lg font-semibold"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-sora)",
            }}
          >
            {title}
          </h2>
          <button
            onClick={handleCancel}
            className="p-1 rounded transition-colors duration-200"
            style={{
              color: "var(--foreground-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p
            id="dialog-message"
            className="text-sm"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: "var(--card-border)" }}
        >
          {type === "confirm" && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
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
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: colors.confirmBg,
              color: "white",
              fontFamily: "var(--font-sora)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
