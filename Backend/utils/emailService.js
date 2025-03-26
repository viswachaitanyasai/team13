const nodemailer = require("nodemailer");

// Configure transporter (Use your email credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password (not normal password)
  },
});

// Function to send OTP via email
const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP for email verification is: ${otp}. This OTP expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    // console.log(`OTP sent to ${email}`);
  } catch (error) {
    // console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP. Try again later.");
  }
};

module.exports = { sendOTP, transporter };
