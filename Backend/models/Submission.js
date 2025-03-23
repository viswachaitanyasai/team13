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
    extractedText: { type: String },
    submission_date: { type: Date, default: Date.now },
  },
  { _id: false }
);

SubmissionSchema.index({ hackathon_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model("Submission", SubmissionSchema);
