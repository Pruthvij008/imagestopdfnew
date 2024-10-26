const { PDFDocument } = require("pdf-lib");
const archiver = require("archiver");
const stream = require("stream");

exports.mergePDFs = async (req, res) => {
  try {
    // Log the received files to ensure they are being uploaded
    console.log("Received files:", req.files);

    if (!req.files || req.files.length < 2) {
      return res
        .status(400)
        .json({ message: "At least two PDF files are required to merge" });
    }

    // Continue with merging process
    const mergedPdfDoc = await PDFDocument.create();
    for (const file of req.files) {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const copiedPages = await mergedPdfDoc.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
    }

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdfDoc.save();

    // Ensure the PDF was generated
    if (!mergedPdfBytes) {
      return res.status(500).json({ message: "Failed to generate merged PDF" });
    }

    // Send the file as a PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    console.error("Error during PDF merging:", error);
    res.status(500).json({ message: "Error during PDF merging", error });
  }
};

// exports.splitPDF = async (req, res) => {
//   const { buffer } = req.file; // Access file buffer
//   const { ranges } = req.body; // Expecting ranges as a comma-separated string, e.g., "1-3,4-6"

//   if (!buffer || !ranges) {
//     return res
//       .status(400)
//       .json({ error: "PDF file and page ranges are required." });
//   }

//   try {
//     // Load the uploaded PDF document
//     const pdfDoc = await PDFDocument.load(buffer);
//     const totalPages = pdfDoc.getPageCount();

//     // Parse the specified ranges
//     const splitRanges = ranges
//       .split(",")
//       .map((range) => range.split("-").map(Number));

//     // Check if there are remaining pages after the last range
//     const lastRangeEnd = splitRanges[splitRanges.length - 1][1];
//     if (lastRangeEnd < totalPages) {
//       // Add a range for the remaining pages
//       splitRanges.push([lastRangeEnd + 1, totalPages]);
//     }

//     // Set up the zip archive in memory
//     const archive = archiver("zip", { zlib: { level: 9 } });
//     res.attachment("split_pdfs.zip"); // Set response as attachment with filename

//     // Pipe the archive data to the response
//     archive.pipe(res);

//     // Add each split PDF to the zip archive
//     for (let i = 0; i < splitRanges.length; i++) {
//       const [start, end] = splitRanges[i];

//       // Create a new PDF for the split range
//       const splitPdfDoc = await PDFDocument.create();
//       for (let pageIndex = start - 1; pageIndex < end; pageIndex++) {
//         const [page] = await splitPdfDoc.copyPages(pdfDoc, [pageIndex]);
//         splitPdfDoc.addPage(page);
//       }

//       // Save the split PDF to a buffer and append to archive
//       const splitPdfBytes = await splitPdfDoc.save();
//       archive.append(Buffer.from(splitPdfBytes), {
//         name: `split_${i + 1}.pdf`,
//       });
//     }

//     // Finalize the archive
//     await archive.finalize();
//   } catch (error) {
//     console.error("Error during PDF splitting:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while splitting the PDF." });
//   }
// };

exports.splitPDF = async (req, res) => {
  const { buffer } = req.file; // Access file buffer
  const { splitPoints } = req.body; // Expecting split points as a comma-separated string, e.g., "3,6"

  if (!buffer || !splitPoints) {
    return res
      .status(400)
      .json({ error: "PDF file and split points are required." });
  }

  try {
    // Load the uploaded PDF document
    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();

    // Parse the split points
    const splitPointsArray = splitPoints.split(",").map(Number);

    // Calculate page ranges based on split points
    const ranges = [];
    let startPage = 1;

    for (const point of splitPointsArray) {
      if (point >= startPage && point <= totalPages) {
        ranges.push([startPage, point]);
        startPage = point + 1;
      }
    }

    // Add remaining pages as a final range if there are any left
    if (startPage <= totalPages) {
      ranges.push([startPage, totalPages]);
    }

    // Set up the zip archive in memory
    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment("split_pdfs.zip"); // Set response as attachment with filename

    // Pipe the archive data to the response
    archive.pipe(res);

    // Add each split PDF to the zip archive
    for (let i = 0; i < ranges.length; i++) {
      const [start, end] = ranges[i];

      // Create a new PDF for the split range
      const splitPdfDoc = await PDFDocument.create();
      for (let pageIndex = start - 1; pageIndex < end; pageIndex++) {
        const [page] = await splitPdfDoc.copyPages(pdfDoc, [pageIndex]);
        splitPdfDoc.addPage(page);
      }

      // Save the split PDF to a buffer and append to archive
      const splitPdfBytes = await splitPdfDoc.save();
      archive.append(Buffer.from(splitPdfBytes), {
        name: `split_${i + 1}.pdf`,
      });
    }

    // Finalize the archive
    await archive.finalize();
  } catch (error) {
    console.error("Error during PDF splitting:", error);
    res
      .status(500)
      .json({ error: "An error occurred while splitting the PDF." });
  }
};
