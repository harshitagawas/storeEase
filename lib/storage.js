import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} userId - User ID for folder isolation
 * @param {string} [mimeType] - MIME type to pick resource_type
 * @returns {Promise<Object>} Full Cloudinary response with secure_url, public_id, bytes, resource_type
 */
export async function uploadToCloudinary(fileBuffer, userId, mimeType) {
  return new Promise((resolve, reject) => {
    const isPdf =
      mimeType === "application/pdf" || (mimeType && mimeType.includes("pdf"));
    const resourceType = isPdf ? "raw" : "auto";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `storeease/${userId}`,
        resource_type: resourceType,
        type: "upload", // explicitly public
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            bytes: result.bytes,
            resource_type: result.resource_type,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @param {string} resourceType - Cloudinary resource type (image | video | raw)
 * @returns {Promise<Object>} Cloudinary deletion result
 */
export async function deleteFromCloudinary(publicId, resourceType = "raw") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary secure_url
 * @returns {string|null} Extracted public_id or null if extraction fails
 */
export function extractPublicIdFromUrl(url) {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{folder}/{public_id}.{ext}
    // Or: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{folder}/{public_id}.{ext}

    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Find the index of "upload" in the path
    const uploadIndex = pathParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    // Everything after "upload" is the path to the file
    // Skip version if present (it's a number)
    let startIndex = uploadIndex + 1;
    if (pathParts[startIndex] && /^\d+$/.test(pathParts[startIndex])) {
      startIndex++; // Skip version number
    }

    // Join remaining parts to get the full path
    const filePath = pathParts.slice(startIndex).join("/");

    // Remove file extension to get public_id
    const publicId = filePath.replace(/\.[^/.]+$/, "");

    return publicId || null;
  } catch (error) {
    console.error("Failed to extract public_id from URL:", error);
    return null;
  }
}
