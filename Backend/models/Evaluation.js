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
      default:"revisit",
    },
    parameter_feedback: [
      {
        // judgement_param_id: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "JudgingParameter",
        //   required: true,
        // },
        name: { type: String, required: true },
        score: { type: Number, required: true, enum: [0, 0.5, 1, 2] },
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

// ✅ Automatically calculate `overall_score` based on parameter_feedback
EvaluationSchema.pre("save", function (next) {
  if (this.parameter_feedback?.length > 0) {
    const obtainedScore = this.parameter_feedback.reduce(
      (sum, param) => sum + param.score,
      0
    );
    const maxScore = this.parameter_feedback.length * 2;

    this.overall_score =
      Math.round((obtainedScore / maxScore) * 10 * 100) / 100; // Rounded to 2 decimal places
  } else {
    this.overall_score = 0;
  }

  next();
});

module.exports = mongoose.model("Evaluation", EvaluationSchema);
