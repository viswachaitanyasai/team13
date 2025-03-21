import React from 'react';

const OTPVerification = () => {
  return (
    <div className="flex h-screen font-sans">
      <div className="flex-1 bg-blue-800 flex justify-center items-center">
        <img src="../src/assets/verification.png" alt="Left Side Illustration" className="max-w-4/5 max-h-4/5" />
      </div>
      <div className="flex-1 bg-gray-100 flex justify-center items-center">
        <div className="text-center p-5">
          <h2 className="text-2xl font-semibold mb-4">OTP Verification</h2>
          <p className="mb-6">Enter OTP sent to bill*****s@example.com</p>
          <div className="flex justify-center mb-6">
            <input type="text" maxLength="1" className="w-10 h-10 mx-1 text-center border rounded" />
            <input type="text" maxLength="1" className="w-10 h-10 mx-1 text-center border rounded" />
            <input type="text" maxLength="1" className="w-10 h-10 mx-1 text-center border rounded" />
            <input type="text" maxLength="1" className="w-10 h-10 mx-1 text-center border rounded" />
            <input type="text" maxLength="1" className="w-10 h-10 mx-1 text-center border rounded" />
          </div>
          <button className="bg-blue-800 text-white py-2 px-6 rounded hover:bg-blue-700">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;