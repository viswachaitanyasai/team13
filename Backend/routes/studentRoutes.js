const express = require("express");
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  getMyHackathons,
  getHackathonById,
  getPublicHackathons,
  joinHackathon,
  getEvaluation,
} = require("../controllers/studentController");
const {submitSolution} = require("../controllers/submissionController");
const { uploadMiddleware } = require("../controllers/uploadController");

const studentAuthMiddleware = require("../middlewares/studentAuthMiddleware");

const router = express.Router();

// Student registration route
router.post("/register", registerStudent);

// Student login route
router.post("/login", loginStudent);

router.get("/profile", studentAuthMiddleware, getStudentProfile);
router.get("/hackathons/:hackathon_id", getHackathonById);
router.get("/hackathons", getPublicHackathons);
router.post("/join", studentAuthMiddleware, joinHackathon);
router.get("/myhackathons", studentAuthMiddleware, getMyHackathons);
router.post("/submit", uploadMiddleware, studentAuthMiddleware, submitSolution);
router.get("/results/:hackathon_id", studentAuthMiddleware, getEvaluation);

module.exports = router;
