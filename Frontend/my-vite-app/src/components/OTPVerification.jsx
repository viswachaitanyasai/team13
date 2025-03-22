import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    console.log('Resend code requested');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 p-4">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <button className="text-indigo-400 mb-6 self-start hover:text-indigo-300 transition" onClick={() => console.log("Back button clicked")}>
          &larr; Back
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-400">Email Verification</h2>
        <p className="text-gray-400 mb-6 text-center">
          Enter the 4-digit verification code sent to <span className="text-indigo-300">info@koalaui.com</span>
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

        <button className="text-indigo-400 block mx-auto mb-4 hover:text-indigo-300 transition" onClick={handleResend}>
          Resend Code
        </button>

        <button
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg w-full hover:bg-indigo-500 transition"
          onClick={() => navigate("./dashboard")}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
