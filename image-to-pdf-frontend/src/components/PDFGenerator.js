import React, { useState } from "react";
import "./ImageUploader.css"; // Ensure to import the CSS

const PDFGenerator = ({ images }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true); // Show loading state
    try {
      const response = await fetch(
        // "http://localhost:3000/api/images/upload",
        "https://imagestopdfnew.onrender.com/api/images/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        const pdfResponse = await fetch(
          // "http://localhost:3000/api/images/generate-pdf",
          " https://imagestopdfnew.onrender.com/api/images/generate-pdf",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrls: data.imageUrls }),
          }
        );

        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob();
          const pdfUrl = URL.createObjectURL(blob);
          setPdfUrl(pdfUrl);
        }
      } else {
        alert("Failed to upload images");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleDownload = () => {
    // Refresh the page after downloading the PDF
    window.location.reload();
  };

  return (
    <div>
      <button
        className="button-generate"
        onClick={handleGeneratePDF}
        disabled={images.length === 0 || loading}
      >
        {loading ? "Generating PDF..." : "Generate PDF"}
      </button>

      {pdfUrl && (
        <a
          className="pdf-link"
          href={pdfUrl}
          download="generated.pdf"
          onClick={handleDownload} // Refresh on click
        >
          Download PDF
        </a>
      )}
    </div>
  );
};

export default PDFGenerator;
