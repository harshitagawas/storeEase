"use client";

import { useState } from "react";

/**
 * CreateFolderModal Component
 * Modal for creating a new folder
 */
export default function CreateFolderModal({
  isOpen,
  onClose,
  onSuccess,
  parentFolderId = null,
}) {
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/folders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName.trim(),
          parentId: parentFolderId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create folder");
        return;
      }

      // Success
      setFolderName("");
      onSuccess?.(data.folder);
      onClose();
    } catch (err) {
      console.error("Create folder error:", err);
      setError("Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border p-6"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Create New Folder
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-4 py-2 rounded-lg border transition-colors duration-200"
              style={{
                backgroundColor: "var(--background-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--foreground)",
                fontFamily: "var(--font-sora)",
              }}
              autoFocus
              disabled={isCreating}
            />
            {error && (
              <p
                className="text-sm mt-2"
                style={{
                  color: "var(--orange-bright)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                backgroundColor: "var(--background-secondary)",
                color: "var(--foreground)",
                border: `1px solid var(--border-color)`,
                fontFamily: "var(--font-sora)",
              }}
              disabled={isCreating}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--sidenav-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--background-secondary)";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                backgroundColor: "var(--blue-sky)",
                color: "white",
                fontFamily: "var(--font-sora)",
              }}
              disabled={isCreating}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
