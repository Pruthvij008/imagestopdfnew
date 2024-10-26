const cloudinary = require("cloudinary").v2;
const { PDFDocument } = require("pdf-lib");
const axios = require("axios");
const multer = require("multer");
const sharp = require("sharp");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images");

// Upload images to Cloudinary
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files;
    let imageUrls = [];

    for (const file of files) {
      const resizedImageBuffer = await sharp(file.buffer)
        .resize(800, 800, { fit: sharp.fit.inside, withoutEnlargement: true })
        .toBuffer();

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "pdf_images", quality: "auto:best" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        uploadStream.end(resizedImageBuffer);
      });

      imageUrls.push(result.secure_url);
    }

    res.json({ imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Image upload failed", error });
  }
};

// Generate PDF from image URLs
exports.generatePDF = async (req, res) => {
  try {
    const { imageUrls } = req.body;

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const pdfDoc = await PDFDocument.create();
    const pageWidth = 595.28; // A4 width in points
    const pageHeight = 841.89; // A4 height in points

    for (const imageUrl of imageUrls) {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const imageBytes = response.data;

      let image;
      if (imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")) {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (imageUrl.endsWith(".png")) {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        return res.status(400).json({ message: "Unsupported image format" });
      }

      const { width: originalWidth, height: originalHeight } = image.scale(1);

      let scale = 1;
      if (originalWidth > pageWidth || originalHeight > pageHeight) {
        const widthScale = pageWidth / originalWidth;
        const heightScale = pageHeight / originalHeight;
        scale = Math.min(widthScale, heightScale);
      }

      const imgWidth = originalWidth * scale;
      const imgHeight = originalHeight * scale;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      page.drawImage(image, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF", error });
  }
};
