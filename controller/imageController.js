// const cloudinary = require("cloudinary").v2;
// const { PDFDocument } = require("pdf-lib");
// const axios = require("axios");

// // Cloudinary configuration directly in controller
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Upload images to Cloudinary
// exports.uploadImages = async (req, res) => {
//   try {
//     const files = req.files;
//     let imageUrls = [];

//     // Loop through each file to upload to Cloudinary
//     for (const file of files) {
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           { folder: "pdf_images" },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           }
//         );
//         uploadStream.end(file.buffer);
//       });

//       imageUrls.push(result.secure_url);
//     }

//     // Send back image URLs to the client
//     res.json({ imageUrls });
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     res.status(500).json({ message: "Image upload failed", error });
//   }
// };

// // Generate PDF from the ordered image URLs
// exports.generatePDF = async (req, res) => {
//   try {
//     const { imageUrls } = req.body; // Ordered URLs from the frontend

//     if (!imageUrls || imageUrls.length === 0) {
//       return res.status(400).json({ message: "No images provided" });
//     }

//     // Create a new PDF document
//     const pdfDoc = await PDFDocument.create();

//     // Add each image to the PDF in the specified sequence
//     for (const imageUrl of imageUrls) {
//       const response = await axios.get(imageUrl, {
//         responseType: "arraybuffer",
//       });
//       const imageBytes = response.data;

//       // Determine the image format by the URL or headers (simplified by URL extension check)
//       let image;
//       if (imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")) {
//         // Embed JPEG image
//         image = await pdfDoc.embedJpg(imageBytes);
//       } else if (imageUrl.endsWith(".png")) {
//         // Embed PNG image
//         image = await pdfDoc.embedPng(imageBytes);
//       } else {
//         return res.status(400).json({ message: "Unsupported image format" });
//       }

//       // Create a page in the PDF document with the size of the image
//       const page = pdfDoc.addPage([image.width, image.height]);

//       // Draw the image on the page
//       page.drawImage(image, {
//         x: 0,
//         y: 0,
//         width: image.width,
//         height: image.height,
//       });
//     }

//     // Save the PDF document to a buffer
//     const pdfBytes = await pdfDoc.save();

//     // Send the generated PDF back to the client
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
//     res.send(Buffer.from(pdfBytes));
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).json({ message: "Failed to generate PDF", error });
//   }
// };
const cloudinary = require("cloudinary").v2;
const { PDFDocument } = require("pdf-lib");
const axios = require("axios");
const multer = require("multer");
const sharp = require("sharp");

// Cloudinary configuration directly in controller
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("images"); // Accept multiple files

// Upload images to Cloudinary
exports.uploadImages = async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log("Incoming files:", req.files);

    // Check if files are present
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files;
    let imageUrls = [];

    // Loop through each file to process and upload to Cloudinary
    for (const file of files) {
      // Resize the image using Sharp
      const resizedImageBuffer = await sharp(file.buffer)
        .resize(800, 800, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();

      // Upload the resized image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "pdf_images" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(resizedImageBuffer);
      });

      imageUrls.push(result.secure_url);
    }

    // Send back image URLs to the client
    res.json({ imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Image upload failed", error });
  }
};

// Generate PDF from the ordered image URLs
exports.generatePDF = async (req, res) => {
  try {
    const { imageUrls } = req.body; // Ordered URLs from the frontend

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add each image to the PDF in the specified sequence
    for (const imageUrl of imageUrls) {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      const imageBytes = response.data;

      // Determine the image format by the URL or headers (simplified by URL extension check)
      let image;
      if (imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")) {
        // Embed JPEG image
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (imageUrl.endsWith(".png")) {
        // Embed PNG image
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        return res.status(400).json({ message: "Unsupported image format" });
      }

      // Create a page in the PDF document with the size of the image
      const page = pdfDoc.addPage([image.width, image.height]);

      // Draw the image on the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    // Save the PDF document to a buffer
    const pdfBytes = await pdfDoc.save();

    // Send the generated PDF back to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF", error });
  }
};