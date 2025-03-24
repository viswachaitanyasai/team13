const express = require("express");
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getMyHackathons,
  getHackathonById,
  getPublicHackathons,
} = require("../controllers/studentController");
const submissionController = require("../controllers/submissionController");
const { uploadMiddleware } = require("../controllers/uploadController");

const studentAuthMiddleware = require("../middlewares/studentAuthMiddleware");

const router = express.Router();

// Student registration route
router.post("/register", registerStudent);

// Student login route
router.post("/login", loginStudent);

// Protected route - Get Student Profile
router.get("/profile", studentAuthMiddleware, getStudentProfile);
router.get("/myhackathons", studentAuthMiddleware, getMyHackathons);
router.get("/hackathon/:id", getHackathonById);
router.get("/hackathons", getPublicHackathons);

router.post("/submit", uploadMiddleware,studentAuthMiddleware, submissionController.submitSolution);


module.exports = router;
