import express from "express";
import { upload } from "../middlewares/cloudinaryUpload.middleware.js"; 

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    res.json({
      success: true,
      data: {
        url: req.file.path, 
        publicId: req.file.filename, 
      },
      message: "Image uploaded successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
});

export default router;
