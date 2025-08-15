import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/Cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "form-builder-uploads", 
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"], 
    transformation: [{ width: 1000, height: 1000, crop: "limit" }], 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
