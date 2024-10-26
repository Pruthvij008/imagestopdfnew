// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ImageUploader from "./components/ImageUploader";
import PDFGenerator from "./components/PDFGenerator";
import ImageConverter from "./components/ImageConverter"; // New component
import PDFToImage from "./components/PDFToImage"; // New component
import PDFsplitter from "./components/pdfsplitter";
import "./App.css"; // Import the updated CSS

const App = () => {
  const [images, setImages] = useState([]);

  const handleImagesChange = (files) => {
    setImages(files);
  };

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div>
          {/* Navbar */}
          <nav>
            <div className="nav-brand">File Converter</div>
            <ul>
              <li>
                <Link to="/">Image to PDF</Link>
              </li>
              <li>
                <Link to="/image-converter">Image Converter</Link>
              </li>
              <li>
                <Link to="/pdf-to-image">PDF merger</Link>
              </li>
              <li>
                <Link to="/pdfsplitter">PDF splitter</Link>
              </li>
            </ul>
          </nav>

          {/* Routes */}
          <Routes>
            <Route
              path="/"
              element={
                <div className="page-container">
                  <h1>Image to PDF Converter</h1>
                  <ImageUploader onImagesChange={handleImagesChange} />
                  <PDFGenerator images={images} />
                </div>
              }
            />
            <Route path="/image-converter" element={<ImageConverter />} />
            <Route path="/pdf-to-image" element={<PDFToImage />} />
            <Route path="/pdfsplitter" element={<PDFsplitter />} />
          </Routes>
        </div>
      </DndProvider>
    </Router>
  );
};

export default App;
