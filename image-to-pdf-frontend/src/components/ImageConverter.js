// src/components/ImageConverter.js
import React, { useState } from "react";
import axios from "axios";
import "./ImageConverter.css";

const ImageConverter = () => {
  const [image, setImage] = useState(null); // Store the uploaded image
  const [convertedImage, setConvertedImage] = useState(null); // Store the converted image
  const [format, setFormat] = useState(""); // Selected format
  const [loading, setLoading] = useState(false); // Loading state for conversion
  const [error, setError] = useState(null); // Error handling

  // Handle image upload
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
    setConvertedImage(null); // Reset converted image when a new image is uploaded
    setError(null); // Clear error message
  };

  // Handle format selection
  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  // Handle image conversion
  const handleConvertImage = async () => {
    if (!image || !format) {
      setError("Please upload an image and select a format.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("format", format);

    try {
      const response = await axios.post(
        "https://allimageservices.onrender.com/api/imgconv/upload",
        formData,
        {
          responseType: "blob", // Expect the response to be a Blob (binary data)
        }
      );

      const blob = new Blob([response.data]);
      const imageUrl = URL.createObjectURL(blob);
      setConvertedImage(imageUrl); // Set the converted image URL
      setLoading(false);
    } catch (error) {
      setError("Failed to convert image. Please try again.");
      setLoading(false);
    }
  };

  // Handle re-upload/cancel image
  const handleReupload = () => {
    setImage(null);
    setConvertedImage(null);
    setError(null);
  };

  return (
    <div className="converter-container">
      <h1 className="title">Image Converter</h1>

      <div className="upload-area">
        {/* Upload Image Button */}
        <div className="left-container">
          {image ? (
            <div className="image-preview">
              <img src={URL.createObjectURL(image)} alt="Uploaded" />
              <button className="cancel-btn" onClick={handleReupload}>
                Cancel & Re-upload
              </button>
            </div>
          ) : (
            <>
              <label htmlFor="imageUpload" className="upload-btn">
                Upload Image
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        {/* Format Selection Dropdown */}
        <div className="center-container">
          <label htmlFor="format">Select Format:</label>
          <select id="format" value={format} onChange={handleFormatChange}>
            <option value="">-- Select Format --</option>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="jpg">JPG</option>
            <option value="webp">WEBP</option>
          </select>

          {/* Convert Button */}
          <button
            className="convert-btn"
            onClick={handleConvertImage}
            disabled={loading || !image}
          >
            {loading ? "Converting..." : "Convert"}
          </button>

          {/* Error message */}
          {error && <div className="error">{error}</div>}
        </div>

        {/* Converted Image Display */}
        {convertedImage && (
          <div className="right-container">
            <h3>Converted Image:</h3>
            <img
              src={convertedImage}
              alt="Converted"
              className="converted-image"
            />
            {/* Download Button */}
            <a
              href={convertedImage}
              download={`converted.${format}`}
              className="download-btn"
            >
              Download Converted Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageConverter;
