// // src/App.js
// import React, { useState } from "react";
// import ImageUploader from "./components/ImageUploader";
// import PDFGenerator from "./components/PDFGenerator";

// const App = () => {
//   const [images, setImages] = useState([]);

//   const handleImagesChange = (files) => {
//     setImages(files);
//   };

//   return (
//     <div>
//       <h1>Image to PDF Converter</h1>
//       <ImageUploader onImagesChange={handleImagesChange} />
//       <PDFGenerator images={images} />
//     </div>
//   );
// };

// export default App;
// src/App.js
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ImageUploader from "./components/ImageUploader";
import PDFGenerator from "./components/PDFGenerator";

const App = () => {
  const [images, setImages] = useState([]);

  const handleImagesChange = (files) => {
    setImages(files);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Image to PDF Converter</h1>
        <ImageUploader onImagesChange={handleImagesChange} />
        <PDFGenerator images={images} />
      </div>
    </DndProvider>
  );
};

export default App;
