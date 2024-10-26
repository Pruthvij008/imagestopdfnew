import React, { useState } from "react";
import axios from "axios";
import "./SplitPdf.css";

const PDFSplitter = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // State to hold the preview URL
  const [splitPoints, setSplitPoints] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile)); // Create preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !splitPoints) {
      setError("Both PDF file and split points are required.");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("splitPoints", splitPoints);

    try {
      const response = await axios.post(
        "https://imagestopdfnew.onrender.com/api/pdf/split-pdf",
        formData,
        {
          responseType: "blob", // Expect binary response for the ZIP file
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "split_pdfs.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error splitting PDF:", err);
      setError("An error occurred while splitting the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pdf-splitter">
      <h1>PDF Splitter</h1>
      <form onSubmit={handleSubmit}>
        <div className="upload-container">
          <label htmlFor="file" className="upload-label">
            Upload PDF
          </label>
          <input
            type="file"
            id="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className="upload-input"
          />
        </div>
        {/* Preview of the uploaded PDF */}
        {fileUrl && (
          <div className="pdf-preview">
            <p>Preview of the uploaded PDF:</p>
            <embed
              src={fileUrl}
              className="embed-preview"
              type="application/pdf"
              width="100%"
              height="400px"
            />
          </div>
        )}
        <div>
          <label htmlFor="splitPoints">Split Points (e.g., 3,6):</label>
          <input
            type="text"
            id="splitPoints"
            value={splitPoints}
            onChange={(e) => setSplitPoints(e.target.value)}
            placeholder="Enter split points"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Split PDF"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PDFSplitter;
