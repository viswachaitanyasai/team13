const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ],
  },
  grade: {
    type: String,
    required: true,
    enum: [
      "1st",
      "2nd",
      "3rd",
      "4th",
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
    ],
  },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },

  joined_hackathons: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Hackathon" },
  ],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", StudentSchema);
