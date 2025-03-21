const mongoose = require("mongoose");

const HackathonSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  judging_parameters: [
    { type: mongoose.Schema.Types.ObjectId, ref: "JudgingParameter" },
  ],
  image_url: { type: String }, // URL for the hackathon poster
  file_attachment_url: { type: String }, // URL for terms & conditions file
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  sponsors: [{ type: String }], // List of sponsor names
  is_public: { type: Boolean, default: true }, // Public or Private Hackathon
  passkey: { type: String, select: false }, // Hashed passkey (Only for private hackathons)
  invite_code: { type: String, unique: true, required: true }, // Unique invite code
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
  allow_multiple_solutions: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Students who joined
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Create a unique compound index on teacher_id and title
HackathonSchema.index({ teacher_id: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("Hackathon", HackathonSchema);
