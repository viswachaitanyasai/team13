const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  isVerified: { type: Boolean, default: false }, // Email verification status
  otp: String, // Stores hashed OTP
  otpExpires: Date, // OTP expiration time
});

module.exports = mongoose.model("Teacher", TeacherSchema);
