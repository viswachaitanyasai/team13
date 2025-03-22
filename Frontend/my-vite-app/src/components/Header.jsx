import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Detect scroll and update navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full shadow-md h-[12vh] px-6 flex items-center justify-between text-white z-50   ${
        scrolled
          ? "bg-opacity-20 backdrop-blur-lg bg-gray-900" // Glassmorphism effect
          : "bg-black"
      }`}
    >
      {/* Logo */}
      <div
        className="flex items-center text-2xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg"
          width="40"
          alt="Logo"
          className="mr-3"
        />
        EduHack
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 text-md font-medium">
        {isAuthenticated ? (
          <>
            <span
              className="cursor-pointer hover:text-gray-400 transition"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </span>
            <span
              className="cursor-pointer hover:text-gray-400 transition"
              onClick={() => navigate("/organize")}
            >
              Organize
            </span>
          </>
        ) : (
          <>
            <span
              className="border-white border-[0.5px] cursor-pointer relative text-white px-3 py-1 transition-all
                after:absolute after:inset-0 after:border after:border-cyan-400 after:scale-0 
                after:transition-transform after:duration-300 after:rounded-md hover:after:scale-100"
              onClick={() => navigate("/teacher-login")}
            >
              Get Started
            </span>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div
        className="md:hidden cursor-pointer text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>

      {/* Mobile Menu (Slide-in) */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-gray-800 shadow-lg transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 flex flex-col items-center pt-20 space-y-6 text-lg`}
      >
        <FiX
          className="absolute top-5 right-5 text-3xl cursor-pointer"
          onClick={() => setMenuOpen(false)}
        />

        {isAuthenticated ? (
          <>
            <span
              className="cursor-pointer hover:text-gray-400 transition"
              onClick={() => {
                navigate("/dashboard");
                setMenuOpen(false);
              }}
            >
              Dashboard
            </span>
            <span
              className="cursor-pointer hover:text-gray-400 transition"
              onClick={() => {
                navigate("/organize");
                setMenuOpen(false);
              }}
            >
              Organize
            </span>
          </>
        ) : (
          <>
            <span
              className="cursor-pointer relative text-white px-3 py-1 transition-all
                after:absolute after:inset-0 after:border after:border-cyan-400 after:scale-0 
                after:transition-transform after:duration-300 after:rounded-md hover:after:scale-100"
              onClick={() => {
                navigate("/teacher-login");
                setMenuOpen(false);
              }}
            >
              Login
            </span>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition"
              onClick={() => {
                navigate("/signup");
                setMenuOpen(false);
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
