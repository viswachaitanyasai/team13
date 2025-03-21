import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen w-full bg-black">
      {/* Left Side - Image Section */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('https://source.unsplash.com/800x600/?education,teacher')" }}
      ></div>

      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-3/4 max-w-md text-center text-white">
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>
          <form>
            <div className="mb-4">
              <input
                type="email"
                className="w-full p-3 bg-transparent border border-gray-300 text-white placeholder-gray-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mail.com"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full p-3 bg-transparent border border-gray-300 text-white placeholder-gray-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button
              onClick={() => navigate("./otp-verification")}
              className="w-full py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition duration-300"
              type="button"
            >
              Sign In
            </button>
          </form>
          <p className="mt-4 text-white font-semibold">or</p>
          Dont have an account ? {" "}
          <a
            className="text-indigo-500  hover:underline mt-2 inline-block"
            href="#"
          >
            Register
          </a>{" "}
          
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;