const bcrypt = require("bcrypt");

// Generate a 6-digit OTP using Math.random()
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Ensures a 6-digit number
};

// Hash OTP before storing it in DB
const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

// Verify OTP
const verifyOTP = async (enteredOTP, hashedOTP) => {
  return await bcrypt.compare(enteredOTP, hashedOTP);
};

module.exports = { generateOTP, hashOTP, verifyOTP };
