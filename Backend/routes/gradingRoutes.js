const express = require("express");
const { gradeSubmission } = require("../controllers/gradingController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:submission_id/grade", authMiddleware, gradeSubmission);

module.exports = router;
