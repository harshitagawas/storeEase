import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth-utils";
import { callHuggingFaceAPI } from "@/lib/huggingface";
import {
  extractTextFromDocument,
  isDocumentTypeSupported,
} from "@/lib/document-extractor";

const SUMMARIZATION_MODEL = "facebook/bart-large-cnn";
const MAX_TEXT_LENGTH = 1024; // BART model has token limits

/**
 * POST /api/ai/summarize
 *
 * Summarizes a document using Hugging Face AI
 *
 * Request body:
 * - fileId: string (required)
 *
 * Returns:
 * - summary: string
 * - success: boolean
 */
export async function POST(req) {
  try {
    // Step 1: Authenticate user
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Get fileId from request body
    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Step 3: Fetch file and verify ownership
    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );
    }

    // Step 4: Check if summary already exists
    const existingMetadata = file.aiMetadata;
    if (
      existingMetadata &&
      typeof existingMetadata === "object" &&
      existingMetadata.summary
    ) {
      return NextResponse.json({
        success: true,
        summary: existingMetadata.summary,
        cached: true,
      });
    }

    // Step 5: Check if file type is supported
    if (!isDocumentTypeSupported(file.type)) {
      return NextResponse.json(
        {
          error:
            "File type not supported for summarization. Only PDF, TXT, and DOCX files are supported.",
        },
        { status: 400 }
      );
    }

    // Step 6: Download file from Cloudinary
    let fileBuffer;
    try {
      const fileResponse = await fetch(file.url);
      if (!fileResponse.ok) {
        throw new Error(`Failed to download file: ${fileResponse.statusText}`);
      }
      const arrayBuffer = await fileResponse.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } catch (error) {
      console.error("Failed to download file:", error);
      return NextResponse.json(
        { error: "Failed to download file for processing" },
        { status: 500 }
      );
    }

    // Step 7: Extract text from document
    let extractedText;
    try {
      extractedText = await extractTextFromDocument(fileBuffer, file.type);

      if (!extractedText || extractedText.trim().length === 0) {
        return NextResponse.json(
          { error: "No text content found in document" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Text extraction error:", error);
      return NextResponse.json(
        { error: `Failed to extract text: ${error.message}` },
        { status: 500 }
      );
    }

    // Step 8: Truncate text if too long (BART has token limits)
    // We'll take the first part of the document for summarization
    const textToSummarize =
      extractedText.length > MAX_TEXT_LENGTH
        ? extractedText.substring(0, MAX_TEXT_LENGTH)
        : extractedText;

    // Step 9: Call Hugging Face API for summarization
    let summary;
    try {
      const response = await callHuggingFaceAPI(SUMMARIZATION_MODEL, {
        inputs: textToSummarize,
      });

      // Handle different response formats
      if (typeof response === "string") {
        summary = response;
      } else if (response.summary_text) {
        summary = response.summary_text;
      } else if (response[0]?.summary_text) {
        summary = response[0].summary_text;
      } else if (response[0]?.generated_text) {
        summary = response[0].generated_text;
      } else {
        // Try to extract any text from the response
        summary = JSON.stringify(response);
      }

      if (!summary || summary.trim().length === 0) {
        throw new Error("Empty summary received from AI model");
      }
    } catch (error) {
      console.error("Hugging Face API error:", error);
      return NextResponse.json(
        {
          error: `Failed to generate summary: ${error.message}`,
        },
        { status: 500 }
      );
    }

    // Step 10: Store summary in database
    const updatedMetadata = {
      ...(existingMetadata && typeof existingMetadata === "object"
        ? existingMetadata
        : {}),
      summary: summary.trim(),
      summarizedAt: new Date().toISOString(),
    };

    await prisma.file.update({
      where: { id: fileId },
      data: {
        aiMetadata: updatedMetadata,
      },
    });

    // Step 11: Return summary
    return NextResponse.json({
      success: true,
      summary: summary.trim(),
      cached: false,
    });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
