import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaCog, FaSignOutAlt, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../apis/authapi";

function Navbar({ teacherName }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [storedTeacherName, setStoredTeacherName] = useState("Organizer");
  const dropdownRef = useRef(null); // Reference for dropdown menu
  const buttonRef = useRef(null); 

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("teacherName");
    if (nameFromStorage) {
      setStoredTeacherName(nameFromStorage);
    }

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout API
      localStorage.removeItem("authToken"); // Clear auth token
      localStorage.removeItem("teacherName"); // Clear stored teacher name
      navigate("/teacher-login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav className="flex  items-center justify-between py-3 px-4 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg w-full fixed top-0 z-50 border-b border-gray-700">
      {/* Logo & Title */}
      <div className="flex items-center gap-2">
        <img
          src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg"
          alt="Logo"
          className="h-10 drop-shadow-lg"
        />
        <h1 className="text-lg font-semibold text-white tracking-wide m-0">
          EduHack
        </h1>
      </div>

      {/* Profile & Dropdown */}
      <div className="relative">
        <div
          ref={buttonRef}
          className="flex items-center cursor-pointer px-3 py-1 gap-2 rounded-full border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-all shadow-lg backdrop-blur-lg"
          onClick={toggleDropdown}
        >
          <img
            src="../../src/assets/Profile.png"
            alt="Profile"
            className="h-8 w-8 rounded-full border border-indigo-400 shadow-lg"
          />
          <span className="text-white font-medium text-sm">
            {teacherName || storedTeacherName}
          </span>
          <FaChevronDown
            className={`text-indigo-300 text-sm transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            <button
              onClick={() => navigate("/profile")}
              className="block px-6 py-3 text-sm text-white hover:bg-indigo-500 transition-all no-underline w-full text-left flex items-center"
            >
              <FaUserTie className="mr-3" /> Your Profile
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="block px-6 py-3 text-sm text-white hover:bg-indigo-500 transition-all no-underline w-full text-left flex items-center"
            >
              <FaCog className="mr-3" /> Settings
            </button>
            <button
              onClick={handleLogout}
              className="block px-6 py-3 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-all no-underline w-full text-left flex items-center"
            >
              <FaSignOutAlt className="mr-3" /> Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
