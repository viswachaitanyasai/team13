import React, { useState } from "react";
import { FaHome, FaHistory, FaPlayCircle, FaCalendarAlt, FaPlusCircle, FaBars } from "react-icons/fa";
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
        className={`h-full pt-20 sm:w-[240px] bg-gradient-to-b from-white to-gray-100 text-white shadow-lg flex flex-col justify-between border-gray-700 fixed left-0 top-0 transition-transform transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:flex-col`}
      >
        {/* Navigation Items */}
        <ul className="flex-grow px-2 pt-3">
          <li>
            <button
              onClick={() => handleItemClick("hackathons", "/hackathons")}
              className={`flex items-center w-full p-3 rounded-lg transition-all font-medium text-sm ${
                active === "hackathons"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              <FaHome className="mr-3 text-base" /> Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleItemClick("past", "/hackathons/past")}
              className={`flex items-center w-full p-3 mt-2 rounded-lg transition-all font-medium text-sm ${
                active === "past"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              <FaHistory className="mr-3 text-base" /> Past Hackathons
            </button>
          </li>
          <li>
            <button
              onClick={() => handleItemClick("ongoing", "/hackathons/ongoing")}
              className={`flex items-center w-full p-3 mt-2 rounded-lg transition-all font-medium text-sm ${
                active === "ongoing"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              <FaPlayCircle className="mr-3 text-base" /> Ongoing Hackathons
            </button>
          </li>
          <li>
            <button
              onClick={() => handleItemClick("upcoming", "/hackathons/upcoming")}
              className={`flex items-center w-full p-3 mt-2 rounded-lg transition-all font-medium text-sm ${
                active === "upcoming"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              <FaCalendarAlt className="mr-3 text-base" /> Upcoming Hackathons
            </button>
          </li>
        </ul>

        {/* Create Hackathon Button */}
        <div className="px-4 pb-6">
          <button
            onClick={() => navigate("/create-hackathon")}
            className="flex items-center justify-center w-full p-3 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md font-semibold"
          >
            <FaPlusCircle className="mr-2 text-base" /> Create Hackathon
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
