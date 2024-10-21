# Image Upload and PDF Generation

This project allows users to upload multiple images, which are then processed and uploaded to Cloudinary. The application can generate a PDF document containing the uploaded images in the specified order.

## Features

- **Image Upload**: Users can upload multiple images simultaneously.
- **Image Processing**: Uploaded images are resized to fit within a specified dimension using Sharp.
- **Cloud Storage**: Images are stored in Cloudinary for easy access and management.
- **PDF Generation**: Users can generate a PDF that includes the uploaded images in the order they were uploaded.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime environment.
- **Express**: Web framework for Node.js to handle routing and middleware.
- **Multer**: Middleware for handling multipart/form-data for file uploads.
- **Sharp**: Library for image processing and resizing.
- **Cloudinary**: Cloud-based service for image and video management.
- **pdf-lib**: Library for creating and modifying PDF documents.
- **Axios**: Promise-based HTTP client for making requests.
