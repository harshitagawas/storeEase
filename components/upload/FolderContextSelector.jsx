"use client";

import { useState, useEffect } from "react";
import { Folder } from "lucide-react";

/**
 * FolderContextSelector Component
 * Displays breadcrumb navigation and allows changing folder context
 */
export default function FolderContextSelector({
  selectedFolderId,
  onFolderChange,
  breadcrumb = [],
}) {
  const [isChanging, setIsChanging] = useState(false);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isChanging) {
      fetchFolders();
    }
  }, [isChanging, selectedFolderId]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      // If a folder is selected, we need to get its parent to show siblings
      // For now, let's show all root-level folders when changing
      // This is simpler and allows selecting any folder
      const url = `/api/folders/list?parentId=null`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSelect = (folderId) => {
    onFolderChange(folderId);
    setIsChanging(false);
  };

  const getBreadcrumbText = () => {
    if (breadcrumb.length === 0) {
      return "Root";
    }
    return breadcrumb.map((f) => f.name).join(" / ");
  };

  return (
    <div
      className="p-4 rounded-lg border transition-colors duration-300"
      style={{
        backgroundColor: "var(--card-background)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <label
            className="text-sm font-medium block mb-1"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            Current Folder
          </label>
          <div
            className="text-base font-semibold"
            style={{
              color: "var(--foreground)",
              fontFamily: "var(--font-sora)",
            }}
          >
            {getBreadcrumbText()}
          </div>
        </div>
        <button
          onClick={() => setIsChanging(!isChanging)}
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
          {isChanging ? "Cancel" : "Change Folder"}
        </button>
      </div>

      {isChanging && (
        <div className="mt-4 space-y-2">
          {loading ? (
            <p
              className="text-sm text-center py-4"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              Loading folders...
            </p>
          ) : (
            <>
              <button
                onClick={() => handleFolderSelect(null)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                style={{
                  backgroundColor:
                    selectedFolderId === null
                      ? "var(--sidenav-active)"
                      : "var(--background-secondary)",
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
                onMouseEnter={(e) => {
                  if (selectedFolderId !== null) {
                    e.currentTarget.style.backgroundColor =
                      "var(--sidenav-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFolderId !== null) {
                    e.currentTarget.style.backgroundColor =
                      "var(--background-secondary)";
                  }
                }}
              >
                <Folder
                  size={16}
                  className="inline mr-2"
                  style={{ color: "var(--blue-sky)" }}
                />
                Root
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderSelect(folder.id)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2"
                  style={{
                    backgroundColor:
                      selectedFolderId === folder.id
                        ? "var(--sidenav-active)"
                        : "var(--background-secondary)",
                    color: "var(--foreground)",
                    fontFamily: "var(--font-sora)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFolderId !== folder.id) {
                      e.currentTarget.style.backgroundColor =
                        "var(--sidenav-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFolderId !== folder.id) {
                      e.currentTarget.style.backgroundColor =
                        "var(--background-secondary)";
                    }
                  }}
                >
                  <Folder size={16} style={{ color: "var(--blue-sky)" }} />
                  {folder.name}
                </button>
              ))}
              {folders.length === 0 && (
                <p
                  className="text-sm text-center py-4"
                  style={{
                    color: "var(--foreground-secondary)",
                    fontFamily: "var(--font-sora)",
                  }}
                >
                  No folders in this location
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
