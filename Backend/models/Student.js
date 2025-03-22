const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  grade: { type: String, required: true }, // Student grade (e.g., 10th, 12th, College Year)
  district: { type: String, required: true }, // District of the student
  state: { type: String, required: true }, // State of the student

  joined_hackathons: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon" },
  ], // Track hackathons they joined

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", StudentSchema); // Keeping the model name as "Student"
