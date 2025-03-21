import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  return (
    <nav className="w-full h-16 bg-dark shadow-lg flex items-center">
      <div className="flex items-center justify-between w-full px-6 md:px-12">
        <div className="flex items-center text-white text-xl md:text-2xl font-extrabold">
          <img 
            src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg" 
            width="40" 
            alt="Logo" 
            className="mr-2" 
          />
          CodeMitra
        </div>

   
        <ul className="hidden md:flex space-x-6 text-base font-medium text-white">
          <button
            onClick={() => navigate("./teacher-login")} 
            className="text-white cursor-pointer hover:text-indigo-300 transition"
          >
            LOGIN AS TEACHER
          </button>
          <li 
            onClick={() => navigate("/student-login")} 
            className="text-white cursor-pointer hover:text-indigo-300 transition"
          >
            LOGIN AS STUDENT
          </li>
          <li className="cursor-pointer hover:text-indigo-300 transition">Contact Us</li>
          <li>
            <a href="https://www.codemitra.org/landing" className="text-white text-lg hover:text-indigo-300 transition">
              <span className="fab fa-facebook" />
            </a>
          </li>
          <li>
            <a href="https://breadsbangalore.org/" className="text-white text-lg hover:text-indigo-300 transition">
              <span className="fa fa-twitter" />
            </a>
          </li>
        </ul>

        <div className="hidden md:block bg-white text-indigo-600 px-4 py-1.5 rounded-lg font-semibold cursor-pointer hover:bg-gray-200 transition">
          Sign Up
        </div>

        {/* Mobile Menu Button */}
        <div 
          className="md:hidden text-2xl text-white cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 text-white text-lg font-medium flex flex-col space-y-4 py-4 px-6 shadow-md mt-2">
          <li 
            onClick={() => navigate("/teacher-login")} 
            className="hover:text-indigo-300 cursor-pointer"
          >
            LOGIN AS TEACHER
          </li>
          <li 
            onClick={() => navigate("/student-login")} 
            className="hover:text-indigo-300 cursor-pointer"
          >
            LOGIN AS STUDENT
          </li>
          <a href="#" className="hover:text-indigo-300">Contact Us</a>
          <div className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-center cursor-pointer hover:bg-gray-200 transition">
            Sign Up
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;
