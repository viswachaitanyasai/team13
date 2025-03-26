const express = require("express");
const {
  createHackathon,
  getHackathons,
  getHackathonById,
  editHackathon,
  removeHackathon,
  getHackathonsByTeacher,
  getHackathonRegistrations,
  getHackathonSubmissions,
  getHackathonEvaluations,
  getHackathonSummary,
  getHackathonEvaluationSummary,
  isResultPublished,
  publishResult,
  getStudentEvaluations,
} = require("../controllers/hackathonController");
const authMiddleware = require("../middlewares/authMiddleware");
const { getEvaluation } = require("../controllers/studentController");

const router = express.Router();

router.post("/", authMiddleware, createHackathon);
router.get("/", authMiddleware, getHackathons);
router.get("/:hackathon_id", getHackathonById);
router.get("/:hackathon_id/registrations",authMiddleware,getHackathonRegistrations);
router.get("/:hackathon_id/submissions",authMiddleware,getHackathonSubmissions);
router.get("/:hackathon_id/evaluations", authMiddleware, getHackathonEvaluations);
router.get("/evaluations/:evaluation_id", authMiddleware, getStudentEvaluations);
router.put("/:hackathon_id", authMiddleware, editHackathon);
router.delete("/:hackathon_id", authMiddleware, removeHackathon); // Protected delete route
router.get("/teacher/:teacher_id", authMiddleware, getHackathonsByTeacher);
router.get("/:hackathon_id/summary", authMiddleware, getHackathonSummary);
router.get("/:hackathon_id/is-result-published",authMiddleware, isResultPublished);
router.post("/:hackathon_id/publish-result", authMiddleware,publishResult);


module.exports = router;
