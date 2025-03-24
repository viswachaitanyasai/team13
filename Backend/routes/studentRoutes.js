const express = require("express");
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
} = require("../controllers/studentController");
const studentAuthMiddleware = require("../middlewares/studentAuthMiddleware");

const router = express.Router();

// Student registration route
router.post("/register", registerStudent);

// Student login route
router.post("/login", loginStudent);

// Protected route - Get Student Profile
router.get("/profile", studentAuthMiddleware, getStudentProfile);

module.exports = router;
