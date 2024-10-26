const sharp = require("sharp");

exports.convertImage = async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file
    const targetFormat = req.body.format; // Get target format from the form

    // Validate if a file was uploaded
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Validate if the target format is supported
    if (!["png", "jpg", "jpeg", "webp"].includes(targetFormat)) {
      return res.status(400).send("Invalid target format.");
    }

    // Use Sharp to convert the image to the desired format
    const convertedImageBuffer = await sharp(file.buffer)
      .toFormat(targetFormat) // Convert to the desired format
      .toBuffer();

    // Set headers and send the converted image back to the client
    res.set({
      "Content-Type": `image/${targetFormat}`,
      "Content-Disposition": `attachment; filename=converted.${targetFormat}`,
    });

    res.send(convertedImageBuffer);
  } catch (error) {
    res.status(500).send("Error converting image: " + error.message);
  }
};
