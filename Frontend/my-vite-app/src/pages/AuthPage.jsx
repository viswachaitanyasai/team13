import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../apis/authapi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const rememberMeStatus = localStorage.getItem("rememberMe") === "true";

    if (rememberMeStatus && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const toggleAuthMode = (mode) => {
    setIsLogin(mode);
    setErrorMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, password });

      if (!response.teacher.isVerified) {
        toast.error("Email not verified. Please verify your email.");
        return;
      }
      localStorage.setItem("teacherName", response.teacher.name);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userEmail", email);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
      }
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedFirstName || !trimmedEmail || !trimmedPassword) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        name: `${trimmedFirstName}`,
        email: trimmedEmail,
        password: trimmedPassword,
      });
      toast.success("Registration Successful! Verify your email.");
      console.log(response);
      navigate("/otp-verification", { state: { email: email } });
    } catch (error) {
      toast.error(error.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-black max-h-screen min-h-screen">
      <div className="flex w-3/4 my-20 bg-gray-900 bg-opacity-90 shadow-2xl rounded-lg overflow-hidden backdrop-blur-md">
        {/* Left Side - Image Section */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <img
            src="../../src/assets/login.jpg"
            alt="Auth Visual"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full md:w-1/2 p-10">
          {/* Toggle Buttons */}
          <button
            className="text-cyan-600 mb-6 self-start hover:text-indigo-300 transition"
            onClick={() => navigate("/")}
          >
            &larr; Back
          </button>
          <div className="flex justify-center mb-4 bg-gray-700 rounded-full p-1">
            <button
              className={`w-1/2 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${
                isLogin ? "bg-cyan-700 text-white" : "text-gray-300"
              }`}
              onClick={() => toggleAuthMode(true)}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${
                !isLogin ? "bg-cyan-700 text-white" : "text-gray-300"
              }`}
              onClick={() => toggleAuthMode(false)}
            >
              Register
            </button>
          </div>
          <AnimatePresence mode="wait">
            {/* Animated Login/Register Form */}
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ x: isLogin ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {!isLogin && (
                  <>
                    {/* First Name */}
                    <label className="block text-sm ml-2 mb-2 font-medium text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                      required
                    />

                    {/* Last Name */}
                  </>
                )}
                {/* Email */}
                <label className="block text-sm ml-2 mb-2 font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />

                {/* Password */}
                <label className="block text-sm font-medium ml-2 mb-2 text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-full outline-none mb-3 bg-gray-900 text-white focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <button
                  className={`w-full bg-cyan-700 text-white py-3 rounded-lg transition duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "hover:bg-indigo-700"
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Login" : "Register"}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
