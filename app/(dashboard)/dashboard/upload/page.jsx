"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, FolderPlus } from "lucide-react";
import FolderContextSelector from "@/components/upload/FolderContextSelector";
import CreateFolderModal from "@/components/upload/CreateFolderModal";
import UploadQueue from "@/components/upload/UploadQueue";
import { useDialog } from "@/components/ui/Dialog";

/**
 * Upload Page
 * Main page for uploading files and organizing them into folders
 * Reads folder context from URL query parameter: ?folder=<folderId>
 */
export default function UploadPage() {
  const searchParams = useSearchParams();
  const { showDialog } = useDialog();
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [isValidatingFolder, setIsValidatingFolder] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

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

  // Validate and process files
  const processFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) {
        showDialog({
          type: "error",
          title: "No Files Selected",
          message: "Please select at least one file to upload.",
        });
        return;
      }

      const fileArray = Array.from(files);
      const validFiles = [];
      const invalidFiles = [];

      // Validate each file
      fileArray.forEach((file) => {
        // Check file size (100MB limit)
        const MAX_FILE_SIZE = 100 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles.push({
            name: file.name,
            reason: `File size exceeds 100MB limit`,
          });
          return;
        }

        // Check file type
        const allowedTypes = [
          /^image\//,
          /^video\//,
          /^application\/pdf$/,
          /^application\/(msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
          /^application\/(vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/,
          /^application\/(vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\.presentationml\.presentation)$/,
          /^text\//,
        ];

        const isAllowedType = allowedTypes.some((pattern) =>
          pattern.test(file.type)
        );

        if (!isAllowedType) {
          invalidFiles.push({
            name: file.name,
            reason:
              "File type not supported. Only images, videos, PDFs, and documents are allowed.",
          });
          return;
        }

        validFiles.push(file);
      });

      // Show error for invalid files
      if (invalidFiles.length > 0) {
        const errorMessage =
          invalidFiles.length === 1
            ? `${invalidFiles[0].name}: ${invalidFiles[0].reason}`
            : `${invalidFiles.length} file(s) were rejected:\n${invalidFiles
                .map((f) => `• ${f.name}: ${f.reason}`)
                .join("\n")}`;

        showDialog({
          type: "error",
          title: "Invalid Files",
          message: errorMessage,
        });
      }

      // Process valid files
      if (validFiles.length > 0) {
        const newUploads = validFiles.map((file, index) => ({
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
      }
    },
    [showDialog]
  );

  const handleFileSelect = (e) => {
    const files = e.target.files;
    processFiles(files);

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

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    processFiles(files);
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

      {/* Drag and Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchStart={(e) => {
          // Touch-friendly: allow touch events to trigger file selection
          e.preventDefault();
        }}
        className={`p-6 sm:p-12 rounded-lg border-2 border-dashed transition-all duration-300 ${
          isDragging ? "scale-[1.02]" : ""
        }`}
        style={{
          backgroundColor: isDragging
            ? "var(--background-secondary)"
            : "var(--card-background)",
          borderColor: isDragging ? "var(--blue-sky)" : "var(--card-border)",
        }}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div
            className="p-4 rounded-full"
            style={{
              backgroundColor: isDragging
                ? "rgba(59, 130, 246, 0.1)"
                : "var(--background-secondary)",
            }}
          >
            <Upload
              size={48}
              style={{
                color: isDragging
                  ? "var(--blue-sky)"
                  : "var(--foreground-secondary)",
              }}
            />
          </div>
          <div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-sora)",
              }}
            >
              {isDragging
                ? "Drop files here to upload"
                : "Drag and drop files here"}
            </h3>
            <p
              className="text-sm mb-4"
              style={{
                color: "var(--foreground-secondary)",
                fontFamily: "var(--font-sora)",
              }}
            >
              or click the button below to select files
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCreateFolder}
                className="px-4 sm:px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--background-secondary)",
                  color: "var(--foreground)",
                  border: `1px solid var(--border-color)`,
                  fontFamily: "var(--font-sora)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--sidenav-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--background-secondary)";
                }}
              >
                <FolderPlus size={18} />
                Create New Folder
              </button>
              <button
                onClick={handleUploadClick}
                className="px-4 sm:px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
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
                <Upload size={18} />
                Select Files
              </button>
            </div>
          </div>
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
