import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-opacity-50 backdrop-blur-lg shadow-lg p-4 flex items-center justify-between text-white transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center text-2xl font-extrabold cursor-pointer" onClick={() => navigate("/")}> 
        <img 
          src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg" 
          width="40" 
          alt="Logo" 
          className="mr-2"
        />
        CodeMitra
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-8 text-lg items-center justify-center mb-0">
        <li className="hover:text-indigo-300 transition duration-300 cursor-pointer" onClick={() => navigate("/teacher-login")}>
          Login
        </li>
        <li className="hover:text-indigo-300 transition duration-300 cursor-pointer">Contact Us</li>
      </ul>
      
      {/* Sign Up Button */}
      <button className="hidden md:block bg-indigo-500 px-6 py-2 rounded-xl font-semibold hover:bg-indigo-600 transition duration-300">
        Sign Up
      </button>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden text-3xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>
      
      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <FiX className="absolute top-6 right-6 text-4xl cursor-pointer" onClick={() => setMenuOpen(false)} />
        <button onClick={() => { navigate("/teacher-login"); setMenuOpen(false); }} className="text-xl py-4 hover:text-indigo-300 transition duration-300">
          Login
        </button>
        <button className="text-xl py-4 hover:text-indigo-300 transition duration-300">Contact Us</button>
        <button className="mt-6 bg-indigo-500 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-600 transition duration-300">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Header;