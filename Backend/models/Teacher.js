const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ], // Regex for email validation
  },
  password: { type: String, required: true }, // Removed password regex
  isVerified: { type: Boolean, default: false }, // Email verification status
  otp: String, // Stores hashed OTP
  otpExpires: Date, // OTP expiration time
});

module.exports = mongoose.model("Teacher", TeacherSchema);
