const mongoose = require("mongoose");

const HackathonSchema = new mongoose.Schema({
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  title: String,
  description: String,
  start_date: Date,
  end_date: Date,
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hackathon", HackathonSchema);
