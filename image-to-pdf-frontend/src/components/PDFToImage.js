// export default PDFToImage;
import React, { useState } from "react";
import axios from "axios";
import "./PDFToImage.css"; // Import external CSS

const PDFToImage = () => {
  const [pdfCount, setPdfCount] = useState(2); // Default to 2 PDFs
  const [pdfFiles, setPdfFiles] = useState(Array(pdfCount).fill(null)); // Array to hold PDF files
  const [pdfUrls, setPdfUrls] = useState(Array(pdfCount).fill(null)); // Array to hold preview URLs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file change for PDFs
  const handlePdfChange = (index, event) => {
    const file = event.target.files[0];
    const updatedPdfFiles = [...pdfFiles];
    const updatedPdfUrls = [...pdfUrls];

    updatedPdfFiles[index] = file;
    updatedPdfUrls[index] = URL.createObjectURL(file); // Preview URL

    setPdfFiles(updatedPdfFiles);
    setPdfUrls(updatedPdfUrls);
  };

  // Handle form submit to merge PDFs
  const handleMergeSubmit = async (event) => {
    event.preventDefault();

    if (pdfFiles.some((file) => !file)) {
      setError("Please upload all selected PDFs to merge.");
      return;
    }

    const formData = new FormData();
    pdfFiles.forEach((file) => formData.append("pdfs", file)); // Append all PDFs

    try {
      setLoading(true);
      setError(null);

      // Call the backend API to merge PDFs
      const response = await axios.post(
        "https://imagestopdfnew.onrender.com/api/pdf/merge-pdfs", // Replace with your backend URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Expect a blob in the response
        }
      );

      // Create a blob from the response and trigger the download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "merged.pdf"); // Set the file name for download
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.remove(); // Remove the link element

      // Reload the page after successful download
      window.location.reload();
    } catch (error) {
      setError("Failed to merge PDFs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle change in PDF count
  const handlePdfCountChange = (event) => {
    const count = Number(event.target.value);
    setPdfCount(count);
    setPdfFiles(Array(count).fill(null));
    setPdfUrls(Array(count).fill(null));
  };

  return (
    <div className="merge-pdf-container">
      <h1>Merge PDFs</h1>
      <label htmlFor="pdf-count" className="count-label">
        How many PDFs do you want to merge?
      </label>
      <input
        type="number"
        id="pdf-count"
        value={pdfCount}
        min="2" // Minimum PDFs to merge
        onChange={handlePdfCountChange}
        className="count-input"
      />
      <form className="merge-pdf-form" onSubmit={handleMergeSubmit}>
        <div className="pdf-upload-container">
          {/* Render PDF input fields based on the number of PDFs */}
          {Array.from({ length: pdfCount }, (_, index) => (
            <div key={index} className="pdf-upload">
              <label htmlFor={`pdf-${index}`} className="upload-label">
                Upload PDF {index + 1}
              </label>
              <input
                type="file"
                id={`pdf-${index}`}
                accept="application/pdf"
                onChange={(event) => handlePdfChange(index, event)}
                className="file-input"
              />
              {pdfUrls[index] && (
                <div className="pdf-preview">
                  <p>Preview of PDF {index + 1}:</p>
                  <embed
                    src={pdfUrls[index]}
                    className="embed-preview"
                    type="application/pdf"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Merge Button */}
        <button type="submit" className="merge-button" disabled={loading}>
          {loading ? "Merging..." : "Merge PDFs"}
        </button>

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default PDFToImage;
