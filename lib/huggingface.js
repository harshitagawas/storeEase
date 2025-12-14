/**
 * Hugging Face Inference API Utility
 *
 * Reusable server-side utility for calling Hugging Face models securely.
 * Never exposes API key to the client.
 */

const HUGGINGFACE_API_URL = "https://router.huggingface.co/hf-inference/models";
const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Call Hugging Face Inference API
 *
 * @param {string} model - Model name (e.g., "facebook/bart-large-cnn")
 * @param {object} inputs - Input payload for the model
 * @param {number} timeout - Request timeout in milliseconds (default: 30000)
 * @returns {Promise<object>} Model response
 * @throws {Error} If request fails or times out
 */
export async function callHuggingFaceAPI(
  model,
  inputs,
  timeout = DEFAULT_TIMEOUT
) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured");
  }

  const url = `${HUGGINGFACE_API_URL}/${model}`;

  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Hugging Face API error: ${response.status} ${response.statusText}`;

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorMessage = errorJson.error;
        }
      } catch {
        // If parsing fails, use the text as-is
        if (errorText) {
          errorMessage = errorText;
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Handle array response (some models return arrays)
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      `Failed to call Hugging Face API: ${error.message || "Unknown error"}`
    );
  }
}
