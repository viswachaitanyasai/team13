const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { uploadMiddleware } = require("../controllers/uploadController");

// ✅ File Upload & Submission Route
router.post("/submit", uploadMiddleware, submissionController.submitSolution);

module.exports = router;
