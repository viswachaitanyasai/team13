import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom"; 

const EmailVerification = () => {
        const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Only allow numbers

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
    // Implement your logic to resend the verification code
    console.log('Resend code requested');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <button className="text-blue-600 mb-6 self-start" onClick={() => console.log("Back button clicked")}>
          &larr; Back
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Email verification</h2>
        <p className="text-gray-600 mb-6 text-center">
          Introduce the 4-digit verification code sent to info@koalaui.com
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
              className="w-12 h-12 border rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button className="text-blue-600 block mx-auto mb-4" onClick={handleResend}>
          Resend code
        </button>

        <button
          className="bg-blue-600 text-white py-3 px-6 rounded-lg w-full"
          onClick={() => navigate("./dashboard")} 
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;