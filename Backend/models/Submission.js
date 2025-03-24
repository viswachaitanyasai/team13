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
    evaluation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evaluation",
    },
    submission_url: { type: String,},
    extracted_text: { type: String, default: "" },
    submission_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Ensure a student can submit only once per hackathon
SubmissionSchema.index({ hackathon_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model("Submission", SubmissionSchema);
