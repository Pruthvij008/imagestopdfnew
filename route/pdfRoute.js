const express = require("express");
const multer = require("multer");
const { mergePDFs, splitPDF } = require("./../controller/pdfController"); // Adjust path as necessary

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle merging multiple PDFs
router.post(
  "/merge-pdfs",
  upload.array("pdfs"),
  (req, res, next) => {
    console.log("Files uploaded:", req.files);
    next();
  },
  mergePDFs
);
router.post("/split-pdf", upload.single("pdf"), splitPDF);
module.exports = router;
