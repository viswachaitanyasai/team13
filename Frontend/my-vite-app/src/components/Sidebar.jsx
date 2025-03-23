import React, { useState } from "react";
import { FaHome, FaTrophy, FaPlus, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (item, path) => {
    setActive(item);
    navigate(path);
    setIsOpen(false); // Close sidebar on mobile
  };
  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        className="lg:hidden fixed bottom-4 right-4 bg-indigo-600 p-2 rounded-md text-white shadow-md z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars className="text-xl" />
      </button>

      {/* Sidebar */}
      <aside
        className={`h-full pt-20 sm:w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col justify-between border-r border-gray-700 fixed left-0 top-0 transition-transform transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:flex-col`}
      >
        {/* Navigation Items */}
        <ul className="flex-grow px-4">
          <li>
            <button
              onClick={() => handleItemClick("dashboard", "/dashboard")}
              className={`flex items-center w-full p-3 rounded-lg transition-all font-medium text-sm ${
                active === "dashboard" ? "bg-indigo-500 text-white shadow-md" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <FaHome className="mr-3 text-base" /> Dashboard
            </button>
          </li>
          <li>
            <button
               onClick={() => handleItemClick("hackathons", "/hackathons")}
               className={`flex items-center w-full p-3 rounded-lg transition-all font-medium text-sm ${
                 active === "hackathons"
                   ? "bg-indigo-500 text-white shadow-md"
                   : "text-gray-300 hover:bg-gray-700"
               }`}
            >
              <FaTrophy className="mr-3 text-base" /> Show Hackathons
            </button>
          </li>
        </ul>

        {/* Create Hackathon Button */}
        <div className="px-4 pb-6">
          <button
            onClick={() => navigate("/create-hackathon")}
            className="flex items-center justify-center w-full p-3 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md font-semibold"
          >
            <FaPlus className="mr-2 text-base" /> Create Hackathon
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;