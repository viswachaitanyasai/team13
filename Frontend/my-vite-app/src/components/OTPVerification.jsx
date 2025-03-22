import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail, resendOTP } from "../apis/authapi";
import { toast } from "react-toastify";

const EmailVerification = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const email = location.state?.email || "your email";
  const [otp, setOtp] = useState(['', '', '', '','','']);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleVerify = async () => {
    setErrorMessage("");
    setLoading(true);
    
    try {
      const response = await verifyEmail({ email, otp: otp.join("") });

      // If OTP verification is successful
      localStorage.setItem("teacherName", response.teacher.name);
      localStorage.setItem("authToken", response.token);
      toast.success("OTP verification successful!")
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.error || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    setResendLoading(true);
    
    try {
      await resendOTP(email);
      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      toast.error(error.error || "Failed to resend OTP. Try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <button className="text-indigo-400 mb-6 self-start hover:text-indigo-300 transition" onClick={() => navigate("/teacher-login")}>
          &larr; Back
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-400">Email Verification</h2>
        <p className="text-gray-400 mb-6 text-center">
          Enter the 6-digit verification code sent to <span className="text-indigo-300">{email}</span>
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-14 h-14 bg-gray-900 text-indigo-400 border border-indigo-500 rounded-lg text-center text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          ))}
        </div>
        <button 
          className="text-indigo-400 block mx-auto mb-4 hover:text-indigo-300 transition disabled:opacity-50" 
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading ? "Resending..." : "Resend Code"}
        </button>

        <button
          className={`bg-indigo-600 text-white py-3 px-6 rounded-lg w-full hover:bg-indigo-500 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
