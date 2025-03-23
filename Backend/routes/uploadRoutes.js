const express = require("express");
const {
  uploadMiddleware,
  uploadFile,
} = require("../controllers/uploadController");

const router = express.Router();

// File Upload Route
router.post("/upload", uploadMiddleware, uploadFile);

module.exports = router;
