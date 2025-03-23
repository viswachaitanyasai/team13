const express = require("express");
const {
  uploadMiddleware,
  uploadFile,
} = require("../controllers/uploadController");

const router = express.Router();

// ✅ Set the route to `/files/upload`
router.post("/files/upload", uploadMiddleware, uploadFile);

module.exports = router;
