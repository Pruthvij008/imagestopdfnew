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
