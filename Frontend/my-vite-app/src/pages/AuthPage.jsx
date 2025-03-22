import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    navigate("/dashboard");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering with:", firstName, lastName, email, password);
    navigate("/otp-verification");
  };

  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900">
      <div className="flex w-3/4 my-20 bg-gray-800 bg-opacity-90 shadow-2xl rounded-lg overflow-hidden backdrop-blur-md">
        {/* Left Side - Image Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-8">
          <img src="../../src/assets/login.jpg" alt="Auth Visual" className="w-full h-auto rounded-lg shadow-lg" />
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome to EduHack!</h2>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-6 bg-gray-700 rounded-full p-1">
            <button
              className={`w-1/2 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${isLogin ? "bg-indigo-600 text-white" : "text-gray-300"}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${!isLogin ? "bg-indigo-600 text-white" : "text-gray-300"}`}
              onClick={
                () => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
              <>
                {/* First Name */}
                <label className="block text-sm ml-2 mb-2 font-medium text-gray-300">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
                
                {/* Last Name */}
                <label className="block text-sm ml-2 mb-2 font-medium text-gray-300">Last Name</label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </>
            )}
            {/* Email */}
            <label className="block text-sm ml-2 mb-2 font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Password */}
            <label className="block text-sm font-medium ml-2 mb-2 text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                required
              />
              <span className="absolute right-3 top-3 cursor-pointer text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password (only for Register) */}
            {!isLogin && (
              <>
                <label className="block text-sm font-medium ml-2 mb-2 text-gray-300">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between text-sm text-gray-400 mb-4">
              <label>
                <input type="checkbox" className="mr-1" /> Remember me
              </label>
              <span className="cursor-pointer">Forgot Password?</span>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;