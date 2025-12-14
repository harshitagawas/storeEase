"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import FolderContextSelector from "@/components/upload/FolderContextSelector";
import CreateFolderModal from "@/components/upload/CreateFolderModal";
import UploadQueue from "@/components/upload/UploadQueue";

/**
 * Upload Page
 * Main page for uploading files and organizing them into folders
 * Reads folder context from URL query parameter: ?folder=<folderId>
 */
export default function UploadPage() {
  const searchParams = useSearchParams();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [isValidatingFolder, setIsValidatingFolder] = useState(false);
  const fileInputRef = useRef(null);

  // Read folder from URL query parameter on mount
  useEffect(() => {
    const folderIdFromUrl = searchParams.get("folder");
    if (folderIdFromUrl) {
      validateAndSetFolder(folderIdFromUrl);
    }
  }, [searchParams]);

  // Fetch breadcrumb when folder changes
  useEffect(() => {
    if (selectedFolderId) {
      fetchBreadcrumb(selectedFolderId);
    } else {
      setBreadcrumb([]);
    }
  }, [selectedFolderId]);

  // Validate folder exists and belongs to user, then set it
  const validateAndSetFolder = async (folderId) => {
    setIsValidatingFolder(true);
    try {
      const res = await fetch(`/api/folders/details?id=${folderId}`);
      const data = await res.json();

      if (data.success && data.folder) {
        // Folder is valid, set it as selected
        setSelectedFolderId(folderId);
      } else {
        // Invalid folder, fallback to root
        console.warn("Invalid folder ID from URL, defaulting to root");
        setSelectedFolderId(null);
      }
    } catch (error) {
      console.error("Failed to validate folder:", error);
      // On error, fallback to root
      setSelectedFolderId(null);
    } finally {
      setIsValidatingFolder(false);
    }
  };

  const fetchBreadcrumb = async (folderId) => {
    try {
      const res = await fetch(`/api/folders/list?folderId=${folderId}`);
      const data = await res.json();
      if (data.success && data.breadcrumb) {
        setBreadcrumb(data.breadcrumb);
      }
    } catch (error) {
      console.error("Failed to fetch breadcrumb:", error);
    }
  };

  const handleFolderChange = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleCreateFolder = () => {
    setIsCreateFolderOpen(true);
  };

  const handleFolderCreated = (newFolder) => {
    // Refresh folder list if needed
    setIsCreateFolderOpen(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Initialize upload queue
    const newUploads = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      status: "pending",
      file: file,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Start uploading each file
    newUploads.forEach((upload) => {
      uploadFile(upload);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (upload) => {
    // Update status to uploading
    setUploads((prev) =>
      prev.map((u) => (u.id === upload.id ? { ...u, status: "uploading" } : u))
    );

    try {
      const formData = new FormData();
      formData.append("file", upload.file);
      if (selectedFolderId) {
        formData.append("folderId", selectedFolderId);
      } else {
        formData.append("folderId", "null");
      }

      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Update status to success
      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id
            ? { ...u, status: "success", fileId: data.file?.id }
            : u
        )
      );

      // Remove from queue after 3 seconds
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.id !== upload.id));
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      // Update status to failed
      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id
            ? { ...u, status: "failed", error: error.message }
            : u
        )
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Show loading state while validating folder from URL
  if (isValidatingFolder) {
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
      {/* Page Title */}
      <div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{
            color: "var(--foreground)",
            fontFamily: "var(--font-headline)",
          }}
        >
          Upload & Organize
        </h1>
        <p
          className="text-sm"
          style={{
            color: "var(--foreground-secondary)",
            fontFamily: "var(--font-sora)",
          }}
        >
          Upload files and organize them into folders
        </p>
      </div>

      {/* Folder Context Selector */}
      <FolderContextSelector
        selectedFolderId={selectedFolderId}
        onFolderChange={handleFolderChange}
        breadcrumb={breadcrumb}
      />

      {/* Actions Section */}
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
          Actions
        </h2>
        <div className="flex gap-4">
          <button
            onClick={handleCreateFolder}
            className="px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
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
            📁 Create New Folder
          </button>
          <button
            onClick={handleUploadClick}
            className="px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--blue-sky)",
              color: "white",
              fontFamily: "var(--font-sora)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            📤 Upload Files
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        />
      </div>

      {/* Upload Queue */}
      <UploadQueue uploads={uploads} />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSuccess={handleFolderCreated}
        parentFolderId={selectedFolderId}
      />
    </div>
  );
}
