const mongoose = require("mongoose");

const QuizSubmissionSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  answers: [{ type: Number, required: true }], // Index of selected options
  score: { type: Number, default: 0 }, // Auto-calculated based on correct answers
  submitted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizSubmission", QuizSubmissionSchema);
