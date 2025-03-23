const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/tokenUtils");
const { generateOTP, hashOTP, verifyOTP } = require("../utils/otpUtils");
const { sendOTP } = require("../utils/emailService");

// Register a new teacher with OTP verification
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Trim whitespace
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Check if the email is already registered
    const existingUser = await Teacher.findOne({ email: trimmedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // User exists but is unverified, update their OTP and resend
      const otp = generateOTP();
      existingUser.otp = await hashOTP(otp);
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
      existingUser.password = await bcrypt.hash(trimmedPassword, 10); // Update password in case user changed it
      await existingUser.save();

      // Resend OTP
      await sendOTP(trimmedEmail, otp);

      return res.status(200).json({
        message: "OTP resent for email verification",
        email: trimmedEmail,
      });
    }

    // New user registration
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);

    const teacher = await Teacher.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      isVerified: false,
      otp: hashedOTP,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    // Send OTP via email
    await sendOTP(trimmedEmail, otp);

    res.status(201).json({
      message: "OTP sent for email verification",
      email: trimmedEmail,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a teacher
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const teacher = await Teacher.findOne({ email: email.trim() });
    if (!teacher) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Ensure email is verified before login
    if (!teacher.isVerified) {
      return res
        .status(403)
        .json({ error: "Email not verified. Please verify your email first." });
    }

    // Validate password
    if (!(await bcrypt.compare(password.trim(), teacher.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(teacher._id);

    // Set token in HTTP-only cookie (7 days)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Secure in production (HTTPS required)
      sameSite: "None", // ✅ Allows cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.json({
      message: "Login successful",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        isVerified: teacher.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout user (clear token)
const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });
  res.json({ message: "Logged out successfully" });
};

// Verify OTP and activate account
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check required fields
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Find user by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already verified
    if (teacher.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Check if OTP is expired
    if (!teacher.otp || Date.now() > teacher.otpExpires) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    // Verify OTP
    const isOTPValid = await verifyOTP(otp, teacher.otp);
    if (!isOTPValid) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark email as verified and clear OTP fields
    teacher.isVerified = true;
    teacher.otp = null;
    teacher.otpExpires = null;
    await teacher.save();

    // Generate token
    const token = generateToken(teacher._id);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Secure in production (HTTPS required)
      sameSite: "None", // ✅ Allows cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.json({
      message: "Email verified successfully. You are now logged in.",
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "User not found" });
    }

    // If already verified, no need to resend OTP
    if (teacher.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate and hash new OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);

    // Update teacher's OTP details
    teacher.otp = hashedOTP;
    teacher.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    await teacher.save();

    // Send OTP via email
    await sendOTP(email, otp);

    res.json({ message: "New OTP sent successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate and hash OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);

    // Store OTP and set expiry time
    teacher.otp = hashedOTP;
    teacher.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity
    await teacher.save();

    // Send OTP via email
    await sendOTP(email, otp);

    res.json({ message: "Password reset OTP sent to email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if OTP is valid and not expired
    if (!teacher.otp || Date.now() > teacher.otpExpires) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    const isOTPValid = await verifyOTP(otp, teacher.otp);
    if (!isOTPValid) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    teacher.password = hashedPassword;
    teacher.otp = null;
    teacher.otpExpires = null;
    await teacher.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendOTP,
  resetPassword,
  forgotPassword,
};
