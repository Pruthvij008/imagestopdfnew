// const express = require("express");
// const multer = require("multer");
// const imageRoutes = require("./route/imageRoute");
// const cors = require("cors");

// const app = express();

// // Multer storage for memory handling
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// app.use(express.json()); // To handle JSON data
// app.use(cors()); // Enable CORS if needed
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Adjust the origin as necessary
//   })
// );
// // Use image routes and pass `multer` instance as middleware
// app.use((req, res, next) => {
//   upload.array("images")(req, res, (err) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ message: "Error uploading images", error: err });
//     }
//     next();
//   });
// });

// // Use image routes
// app.use("/api/images", imageRoutes);

// app.all("*", (req, res, next) => {
//   res
//     .status(404)
//     .json({ message: `Can't find ${req.originalUrl} on this server!` });
// });

// module.exports = app;
// app.js
const express = require("express");
const imageRoutes = require("./route/imageRoute");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"||"https://imagestopdfnew-1.onrender.com/",
  })
);

app.use(express.json());

app.use("/api/images", imageRoutes);

app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: `Can't find ${req.originalUrl} on this server!` });
});

module.exports = app;
