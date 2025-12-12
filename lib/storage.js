import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function uploadToCloudinary(tempPath) {
  const file = await cloudinary.uploader.upload(tempPath, {
    folder: "digital-locker",
  });
  return file.secure_url;
}
