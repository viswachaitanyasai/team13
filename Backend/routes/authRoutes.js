const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail); // OTP verification
router.post("/resend-otp", resendOTP); // Resend OTP
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


module.exports = router;
