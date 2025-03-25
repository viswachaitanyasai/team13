const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createQuiz,
  getQuizById,
  deleteQuiz,
  fetchMyQuizzes,
} = require("../controllers/quizController");
router.post("/create", authMiddleware, createQuiz);
router.post("/fetch/:id", authMiddleware, getQuizById);
router.post("/delete/:id", authMiddleware, deleteQuiz);
router.post("/quizes", authMiddleware, fetchMyQuizzes);

module.exports = router;
