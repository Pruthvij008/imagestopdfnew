const express = require("express");
const imageRoutes = require("./route/imageRoute");
const imgconvRoutes = require("./route/imageconvRoute");
const pdfRoutes = require("./route/pdfRoute");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://imagestopdfnew-1.onrender.com","https://allimageservicesa.onrender.com"], // Allow both localhost and your production domain
    methods: ["GET", "POST", "OPTIONS"], // Allow specific methods
  })
);

app.use(express.json());

app.use("/api/images", imageRoutes);
app.use("/api/imgconv", imgconvRoutes);
app.use("/api/pdf", pdfRoutes);

app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: `Can't find ${req.originalUrl} on this server!` });
});

module.exports = app;
