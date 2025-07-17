import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imageName) {
  const imagePath = path.join(`./public/uploads/${imageName}`);
  const result = await cloudinary.v2.uploader.upload(imagePath);
  // Wait before deleting file (optional)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  fs.unlink(imagePath, (err) => {
    if (err) console.error(err);
  });
  return result.url;
}

export default uploadImage;

