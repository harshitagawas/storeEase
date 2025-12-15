/**
 * Document Text Extraction Utility
 *
 * Extracts plain text from various document formats (PDF, TXT, DOCX)
 * for AI processing.
 */

import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Normalize extracted text by trimming and collapsing excessive blank lines.
 *
 * @param {string} text
 * @returns {string}
 */
function cleanExtractedText(text) {
  if (!text) return "";
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extract text from a document buffer
 *
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<{success: boolean, text?: string, reason?: string}>}
 * @throws {Error} If extraction fails
 */
export async function extractTextFromDocument(buffer, mimeType) {
  try {
    if (mimeType === "application/pdf") {
      const data = await pdfParse(buffer, {
        max: 0,
        pagerender: () => "",
        normalizeWhitespace: true,
        disableFontFace: true,
      });

      const text = data.text?.trim();

      if (!text || text.length < 200) {
        return {
          success: false,
          reason: "NO_TEXT",
        };
      }

      return {
        success: true,
        text,
      };
    }

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value } = await mammoth.extractRawText({ buffer });
      const text = value?.trim();

      if (!text || text.length < 200) {
        return {
          success: false,
          reason: "NO_TEXT",
        };
      }

      return {
        success: true,
        text,
      };
    }

    return {
      success: false,
      reason: "UNSUPPORTED_TYPE",
    };
  } catch (err) {
    console.error("Document extraction failed:", err);
    throw new Error("Failed to extract text from document");
  }
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
