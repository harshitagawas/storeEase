import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth-utils";
import { callHuggingFaceAPI } from "@/lib/huggingface";
export const runtime = "nodejs";

const SUMMARIZATION_MODEL = "sshleifer/distilbart-cnn-12-6";
const MIN_SUMMARY_LENGTH = 40;
const HF_TIMEOUT_MS = 45000;
const MAX_CHARS = 3000;

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

    // Step 2: Get text input (and optional fileType) from request body
    const { text, fileType } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        {
          success: false,
          reason: "INVALID_INPUT",
          message: "Only text-based files can be summarized.",
        },
        { status: 200 }
      );
    }

    if (text.startsWith("http")) {
      return NextResponse.json(
        {
          success: false,
          reason: "INVALID_INPUT",
          message: "Only text-based files can be summarized.",
        },
        { status: 200 }
      );
    }

    // Step 3: Short-circuit PDFs per requirement (no HF call)
    if (fileType === "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          reason: "PDF_UNSUPPORTED",
          message:
            "PDF summarization is supported only for text-based documents. Scanned or complex PDFs are currently unsupported.",
        },
        { status: 200 }
      );
    }

    // Step 4: Call Hugging Face with text directly
    let summary;
    try {
      const inputText =
        text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;

      const response = await callHuggingFaceAPI(
        SUMMARIZATION_MODEL,
        {
          inputs: inputText,
          parameters: {
            max_new_tokens: 120,
            min_length: 30,
            do_sample: false,
          },
        },
        HF_TIMEOUT_MS
      );

      if (typeof response === "string") {
        summary = response;
      } else if (response.summary_text) {
        summary = response.summary_text;
      } else if (response[0]?.summary_text) {
        summary = response[0].summary_text;
      } else if (response[0]?.generated_text) {
        summary = response[0].generated_text;
      }

      if (!summary || summary.trim().length < MIN_SUMMARY_LENGTH) {
        return NextResponse.json(
          {
            success: false,
            reason: "NO_TEXT_FOUND",
            message:
              "This PDF appears to be scanned or contains no readable text.",
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error("Hugging Face API error:", error);
      return NextResponse.json(
        {
          success: false,
          reason: "TIMEOUT",
          message: "Document is too large to summarize right now.",
        },
        { status: 200 }
      );
    }

    // Step 4: Return summary
    return NextResponse.json({
      success: true,
      summary: summary.trim(),
    });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
