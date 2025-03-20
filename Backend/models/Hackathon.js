const mongoose = require("mongoose");

const HackathonSchema = new mongoose.Schema({
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String }, // URL for the hackathon poster
  file_attachment_url: { type: String }, // URL for terms & conditions file
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  sponsors: [{ type: String }], // List of sponsor names
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
  allow_multiple_solutions: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hackathon", HackathonSchema);
