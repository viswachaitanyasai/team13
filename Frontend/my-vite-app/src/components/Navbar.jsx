import React, { useState } from "react";
import { FaChevronDown, FaCog, FaSignOutAlt, FaUserTie } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Navbar({ teacherName }) {
    const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-[#4c3c3c] bg-opacity-20 backdrop-blur-lg border border-gray-700 shadow-xl w-full ">
      {/* Logo & Title */}
      <div className="flex items-center">
        <img
          src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg"
          alt="Logo"
          className="h-14 mr-5 drop-shadow-lg"
        />
        <h1 className="text-2xl font-bold text-indigo-400 tracking-wide">
          Teacher Dashboard
        </h1>
      </div>

      {/* Profile & Dropdown */}
      <div className="relative">
        <div
          className="flex items-center cursor-pointer space-x-2 p-2 px-4 rounded-xl border border-gray-600 bg-gray-900 bg-opacity-40 hover:bg-opacity-60 transition-all shadow-md backdrop-blur-lg"
          onClick={toggleDropdown}
        >
          <img
            src="../../src/assets/Profile.png"
            alt="Profile"
            className="h-9 w-9 rounded-full border border-indigo-400 shadow-md"
          />
          <span className="text-white font-medium">{teacherName}</span>
          <FaChevronDown className="text-indigo-300 text-sm transition-transform duration-300" />
        </div>

        {/* Dropdown Menu with Framer Motion */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-2 w-52 bg-gray-900 bg-opacity-90 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => navigate("./profile")}
                className="block px-5 py-3 text-sm text-white hover:bg-indigo-500 transition-all no-underline w-full text-left flex items-center"
              >
                <FaUserTie className="mr-2" />
                Your Profile
              </button>
              <a
                href="/settings"
                className="block px-5 py-3 text-sm text-white hover:bg-indigo-500 transition-all no-underline flex items-center"
              >
                <FaCog className="mr-2" /> Settings
              </a>
              <a
                href="/logout"
                className="block px-5 py-3 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-all no-underline flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Log Out
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
