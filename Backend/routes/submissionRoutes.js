const express = require("express");
const { updateEvaluationCategory,bulkUpdateEvaluationCategory,editEvaluationScore } = require("../controllers/submissionController");
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

router.put("/:submission_id/category", authMiddleware, updateEvaluationCategory);
router.put("/:hackathon_id/evaluations/reject",authMiddleware, bulkUpdateEvaluationCategory);
router.put("/:submission_id/evaluation/score", authMiddleware,editEvaluationScore);


module.exports = router;
