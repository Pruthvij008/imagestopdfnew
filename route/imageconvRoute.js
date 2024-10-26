// src/routes/imageRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const imageController = require("../controller/imageConverter");

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format!"), false);
    }
  },
});

// Route for uploading and converting images
router.post("/upload", upload.single("image"), imageController.convertImage);

module.exports = router;
