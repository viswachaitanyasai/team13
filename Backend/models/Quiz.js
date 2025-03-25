const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question_text: { type: String, required: true },
  options: [{ type: String, required: true }], // Array of options
  correct_answer: { type: Number, required: true }, // Index of the correct option
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema], // Array of questions
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  }, // Link to Teacher
  created_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true }, // To deactivate quiz if needed
});

module.exports = mongoose.model("Quiz", QuizSchema);
