// // src/components/ImageUploader.js
// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import "./ImageUploader.css"; // Assuming you will create a CSS file for styles

// const ImageUploader = ({ onImagesChange }) => {
//   const [previewUrls, setPreviewUrls] = useState([]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const urls = files.map((file) => URL.createObjectURL(file));
//     setPreviewUrls(urls);
//     onImagesChange(files);
//   };

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;

//     const reorderedUrls = Array.from(previewUrls);
//     const [removed] = reorderedUrls.splice(result.source.index, 1);
//     reorderedUrls.splice(result.destination.index, 0, removed);

//     setPreviewUrls(reorderedUrls);
//   };

//   return (
//     <div>
//       <h2>Upload Images</h2>
//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleImageChange}
//       />
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="images">
//           {(provided) => (
//             <div
//               className="image-preview-container"
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//             >
//               {previewUrls.map((url, index) => (
//                 <Draggable
//                   key={index}
//                   draggableId={`image-${index}`}
//                   index={index}
//                 >
//                   {(provided) => (
//                     <div
//                       className="image-preview"
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                     >
//                       <img src={url} alt={`preview-${index}`} />
//                     </div>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// };

// export default ImageUploader;
// src/components/ImageUploader.js
// import React, { useState } from "react";
// import { useDrag, useDrop } from "react-dnd";
// import "./ImageUploader.css"; // Assuming you will create a CSS file for styles

// const ItemType = {
//   IMAGE: "image",
// };

// const ImageItem = ({ url, index, moveImage }) => {
//   const [, ref] = useDrag({
//     type: ItemType.IMAGE,
//     item: { index },
//   });

//   const [, drop] = useDrop({
//     accept: ItemType.IMAGE,
//     hover(item) {
//       if (item.index !== index) {
//         moveImage(item.index, index);
//         item.index = index; // Update the index to the new position
//       }
//     },
//   });

//   return (
//     <div ref={(node) => ref(drop(node))} className="image-preview">
//       <img src={url} alt={`preview-${index}`} />
//     </div>
//   );
// };

// const ImageUploader = ({ onImagesChange }) => {
//   const [previewUrls, setPreviewUrls] = useState([]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const urls = files.map((file) => URL.createObjectURL(file));
//     setPreviewUrls(urls);
//     onImagesChange(files);
//   };

//   const moveImage = (fromIndex, toIndex) => {
//     const updatedUrls = [...previewUrls];
//     const [movedImage] = updatedUrls.splice(fromIndex, 1);
//     updatedUrls.splice(toIndex, 0, movedImage);
//     setPreviewUrls(updatedUrls);
//   };

//   return (
//     <div>
//       <h2>Upload Images</h2>
//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={handleImageChange}
//       />
//       <div className="image-preview-container">
//         {previewUrls.map((url, index) => (
//           <ImageItem
//             key={index}
//             index={index}
//             url={url}
//             moveImage={moveImage}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageUploader;
// src/components/ImageUploader.js
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./ImageUploader.css"; // Ensure to import the CSS

const ItemType = {
  IMAGE: "image",
};

const ImageItem = ({ url, index, moveImage }) => {
  const [, ref] = useDrag({
    type: ItemType.IMAGE,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.IMAGE,
    hover(item) {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index; // Update the index to the new position
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="image-preview">
      <img src={url} alt={`preview-${index}`} />
    </div>
  );
};

const ImageUploader = ({ onImagesChange }) => {
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    onImagesChange(files);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedUrls = [...previewUrls];
    const [movedImage] = updatedUrls.splice(fromIndex, 1);
    updatedUrls.splice(toIndex, 0, movedImage);
    setPreviewUrls(updatedUrls);
  };

  return (
    <div>
      <h2>Upload Images</h2>
      <label className="label-upload">
        Choose Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </label>
      <div className="image-preview-container">
        {previewUrls.map((url, index) => (
          <ImageItem
            key={index}
            index={index}
            url={url}
            moveImage={moveImage}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
