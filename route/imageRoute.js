const express = require("express");
const multer = require("multer");
const {
  uploadImages,
  generatePDF,
} = require("./../controller/imageController");

const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for uploading images to Cloudinary
router.post("/upload", upload.array("images"), uploadImages);

// Route for generating the PDF based on image order
router.post("/generate-pdf", generatePDF);

module.exports = router;
