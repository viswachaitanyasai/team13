const HackathonSchema = new mongoose.Schema({
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String },
  file_attachment_url: { type: String },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  sponsors: [{ type: String }],
  allow_multiple_solutions: { type: Boolean, default: false },
  is_public: { type: Boolean, default: true },
  passkey: { type: String, select: false },
  invite_code: { type: String, unique: true, required: true },
  grade: {
    type: String,
    required: true,
    enum: [
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
      "UG",
      "PG",
    ], // Restrict valid grades
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
  judging_parameters: [
    { type: mongoose.Schema.Types.ObjectId, ref: "JudgingParameter" },
  ],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hackathon", HackathonSchema);
