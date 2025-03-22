const express = require("express");
const {
  getHackathonStats,
  getStudentRegistrations,
  getSubmissionStats,
} = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/hackathons", authMiddleware, getHackathonStats);
router.get("/registrations", authMiddleware, getStudentRegistrations);
router.get("/submissions", authMiddleware, getSubmissionStats);

module.exports = router;
