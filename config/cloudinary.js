require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (photo) => {
  const cloudRes = await cloudinary.uploader.upload(photo);
  if (cloudRes.url) {
    return cloudRes.url;
  }
  return new Error("Failed to upload photo");
};

module.exports = { cloudinary, uploadToCloudinary };
