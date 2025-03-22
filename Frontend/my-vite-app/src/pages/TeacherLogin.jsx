import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function TeacherLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const imageRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      let angle = 0;
      const animate = () => {
        angle += 0.1;
        image.style.transform = `rotate(${angle}deg) scale(1.1)`;
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-black">
      {/* Left Side - Enhanced Image Section */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <div
          ref={imageRef}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
          style={{ backgroundImage: "../../src/assets/8.jpg" }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400 to-purple-700 opacity-80"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <h2 className="text-4xl font-bold mb-4">Empowering Educators</h2>
          <p className="text-lg text-gray-200">
            Join our community and revolutionize the way you teach.
          </p>
          <div className="mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 animate-pulse text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332. 0.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332. 0.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332. 0.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
      </div>

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
          Dont have an account ?{" "}
          <a
            className="text-indigo-500 hover:underline mt-2 inline-block"
            href="#"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;