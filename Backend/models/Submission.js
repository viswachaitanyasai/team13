const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    hackathon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    submission_url: { type: String, required: true }, // URL to the submitted solution
    submission_date: { type: Date, default: Date.now },
    grade_received: { type: String, enum: ["low", "mid", "high"] },
    feedback: { type: String },
  },
  { _id: false }
);

SubmissionSchema.index({ hackathon_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model("Submission", SubmissionSchema);