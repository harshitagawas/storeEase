/**
 * Document Text Extraction Utility
 *
 * Extracts plain text from various document formats (PDF, TXT, DOCX)
 * for AI processing.
 */

import mammoth from "mammoth";

/**
 * Extract text from a document buffer
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} Extracted plain text
 * @throws {Error} If extraction fails or format is not supported
 */
export async function extractTextFromDocument(buffer, mimeType) {
  // =====================
  // PDF FILES
  // =====================
  if (mimeType === "application/pdf" || mimeType.includes("pdf")) {
    try {
      // Dynamic import to avoid ESM/CJS issues in Next.js + Turbopack
      const pdfParse = (await import("pdf-parse")).default;

      const data = await pdfParse(buffer);
      return data.text || "";
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  // =====================
  // DOCX FILES
  // =====================
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("docx")
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    } catch (error) {
      throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
  }

  // =====================
  // DOC FILES (legacy)
  // =====================
  if (
    mimeType === "application/msword" ||
    mimeType.includes("msword") ||
    mimeType.includes("doc")
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    } catch (error) {
      throw new Error(
        `Failed to extract text from DOC. Legacy .doc support is limited: ${error.message}`
      );
    }
  }

  // =====================
  // PLAIN TEXT FILES
  // =====================
  if (mimeType === "text/plain" || mimeType.includes("text")) {
    try {
      return buffer.toString("utf-8");
    } catch (error) {
      throw new Error(`Failed to extract text from TXT: ${error.message}`);
    }
  }

  throw new Error(`Unsupported document type: ${mimeType}`);
}

/**
 * Check if a file type is supported for text extraction
 *
 * @param {string} mimeType - MIME type of the file
 * @returns {boolean} True if supported
 */
export function isDocumentTypeSupported(mimeType) {
  const supportedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];

  return (
    supportedTypes.some((type) => mimeType.includes(type)) ||
    mimeType.includes("pdf") ||
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("msword") ||
    mimeType.includes("docx") ||
    mimeType.includes("doc") ||
    mimeType.includes("text")
  );
}
