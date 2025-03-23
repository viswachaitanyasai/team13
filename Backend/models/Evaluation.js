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
    parameter_feedback: [
      {
        judgement_param_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "JudgingParameter", // Links to the judging parameter
          required: true,
        },
        name: { type: String, required: true }, // Parameter name
        score: {
          type: Number,
          required: true,
          enum: [0, 0.5, 1, 2], // AI assigns scores within this range
        },
        reason: { type: String, required: true }, // Justification for the score
      },
    ],
    improvement: [{ type: String }], // General feedback as an array of strings
    actionable_steps: [{ type: String }],
    strengths: [{ type: String }],
    overall_score: { type: Number, min: 0, max: 10 }, // Score out of 10
    summary: [{ type: String }],
  },
  { timestamps: true }
);

/**
 * Pre-save middleware to calculate overall score before saving.
 */
EvaluationSchema.pre("save", function (next) {
  if (this.parameter_feedback.length > 0) {
    const obtainedScore = this.parameter_feedback.reduce(
      (sum, param) => sum + param.score,
      0
    );

    const maxScore = this.parameter_feedback.length * 2; // Each parameter has a max score of 2
    this.overall_score = (obtainedScore / maxScore) * 10; // Normalize to 0-10 range
  } else {
    this.overall_score = 0; // If no parameters, default to 0
  }

  next();
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
