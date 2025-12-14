"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import FilesHeader from "@/components/files/FilesHeader";
import FolderCard from "@/components/files/FolderCard";
import FileCard from "@/components/files/FileCard";
import FilePreviewDrawer from "@/components/files/FilePreviewDrawer";
import CreateFolderModal from "@/components/upload/CreateFolderModal";

/**
 * Files Page
 * Displays folders and files with navigation and management capabilities
 */
export default function FilesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const folderId = searchParams.get("folder");

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (folderId) {
        // Fetch folder details
        const res = await fetch(`/api/folders/details?id=${folderId}`);
        const data = await res.json();

        if (data.success) {
          setFolders(data.folder.children || []);
          setFiles(data.folder.files || []);
          setBreadcrumb(data.folder.breadcrumb || []);
        }
      } else {
        // Fetch root files
        const res = await fetch("/api/files/root");
        const data = await res.json();

        if (data.success) {
          setFolders(data.folders || []);
          setFiles(data.files || []);
          setBreadcrumb([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  // Fetch data when folder changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter folders and files based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const query = searchQuery.toLowerCase();
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(query)
    );
  }, [folders, searchQuery]);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

  const handleFolderCreated = (newFolder) => {
    setIsCreateFolderOpen(false);
    // Refresh data
    fetchData();
  };

  const handleFileDelete = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    // Close drawer if deleted file was selected
    if (selectedFile?.id === fileId) {
      setIsDrawerOpen(false);
      setSelectedFile(null);
    }
  };

  const handleFolderDelete = (folderId) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    // Refresh data to ensure consistency
    fetchData();
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // Clear selectedFile after animation completes
    setTimeout(() => {
      setSelectedFile(null);
    }, 300);
  };

  const handleBackClick = () => {
    if (breadcrumb.length > 1) {
      // Navigate to parent folder
      const parentFolder = breadcrumb[breadcrumb.length - 2];
      router.push(`/dashboard/files?folder=${parentFolder.id}`);
    } else {
      // Navigate to root
      router.push("/dashboard/files");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p
          className="text-sm"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FilesHeader
        breadcrumb={breadcrumb}
        currentFolderId={folderId}
        onCreateFolder={() => setIsCreateFolderOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Search Bar */}
      <div
        className="p-4 rounded-lg border transition-colors duration-300"
        style={{
          backgroundColor: "var(--card-background)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: "var(--foreground-secondary)" }}
          />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
            style={{
              backgroundColor: "var(--background-secondary)",
              color: "var(--foreground)",
              border: `1px solid var(--border-color)`,
              fontFamily: "var(--font-sora)",
            }}
          />
        </div>
      </div>

      {/* Back button if not at root */}
      {breadcrumb.length > 0 && (
        <button
          onClick={handleBackClick}
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
          ← Back
        </button>
      )}

      {/* Folders and Files */}
      {folders.length === 0 && files.length === 0 && !searchQuery ? (
        <div
          className="p-12 rounded-lg border text-center"
          style={{
            backgroundColor: "var(--card-background)",
            borderColor: "var(--card-border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            No folders or files in this location
          </p>
        </div>
      ) : filteredFolders.length === 0 && filteredFiles.length === 0 ? (
        <div
          className="p-12 rounded-lg border text-center"
          style={{
            backgroundColor: "var(--card-background)",
            borderColor: "var(--card-border)",
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "var(--foreground-secondary)",
              fontFamily: "var(--font-sora)",
            }}
          >
            No results found for "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          {/* Folders */}
          {filteredFolders.length > 0 && (
            <div>
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                Folders
              </h2>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-2"
                }
              >
                {filteredFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    viewMode={viewMode}
                    onDelete={handleFolderDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {filteredFiles.length > 0 && (
            <div>
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  color: "var(--foreground)",
                  fontFamily: "var(--font-sora)",
                }}
              >
                Files
              </h2>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-2"
                }
              >
                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    viewMode={viewMode}
                    onDelete={handleFileDelete}
                    onClick={() => handleFileClick(file)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSuccess={handleFolderCreated}
        parentFolderId={folderId}
      />

      {/* File Preview Drawer */}
      <FilePreviewDrawer
        isOpen={isDrawerOpen && selectedFile !== null}
        onClose={handleDrawerClose}
        file={selectedFile}
      />
    </div>
  );
}
