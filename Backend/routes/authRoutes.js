const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  resendOTP,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail); // OTP verification
router.post("/resend-otp", resendOTP); // Resend OTP
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
