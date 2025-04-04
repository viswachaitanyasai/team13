const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema(
  {
    submission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true, // One evaluation per submission
    },
    evaluation_status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    evaluation_category: {
      type: String,
      enum: ["shortlisted", "revisit", "rejected"],
      default: "revisit",
    },
    parameter_feedback: [
      {
        name: { type: String, required: true },
        score: { type: Number, required: true, enum: [0, 0.5, 1, 1.5, 2] },
        reason: { type: String, required: true },
      },
    ],
    improvement: [{ type: String }],
    actionable_steps: [{ type: String }],
    strengths: [{ type: String }],
    overall_score: { type: Number, min: 0, max: 10 },
    overall_reason: { type: String },
    summary: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evaluation", EvaluationSchema);
