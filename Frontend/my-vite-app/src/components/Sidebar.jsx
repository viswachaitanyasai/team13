import React, { useState } from "react";
import { FaHome, FaTrophy, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar({ onDashboardClick, onShowHackathonsClick }) {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();

  const handleItemClick = (item, callback) => {
    setActive(item);
    callback();
  };

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white shadow-lg flex flex-col justify-between border-r border-gray-800">
      <div className="flex flex-col items-center py-6">
        <img
          src="https://d51e583nnuf2e.cloudfront.net/Frontend/assets/img/logo-in-circle.svg"
          alt="Company Logo"
          className="h-16 w-16 drop-shadow-lg"
        />
        <h2 className="mt-2 text-lg font-semibold text-indigo-400">Teacher Dashboard</h2>
      </div>

      {/* Navigation Items */}
      <ul className="flex-grow px-4">
        <li>
          <button
            onClick={() => handleItemClick("dashboard", onDashboardClick)}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${
              active === "dashboard" ? "bg-indigo-500 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <FaHome className="mr-3" /> Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => handleItemClick("hackathons", onShowHackathonsClick)}
            className={`flex items-center w-full p-3 rounded-lg transition-all ${
              active === "hackathons" ? "bg-indigo-500 text-white" : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <FaTrophy className="mr-3" /> Show Hackathons
          </button>
        </li>
      </ul>

      {/* Create Hackathon Button */}
      <div className="px-4 pb-6">
        <button
          onClick={() => navigate("./create-hackathon")}
          className="flex items-center justify-center w-full p-3 text-lg bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
        >
          <FaPlus className="mr-2" /> Create Hackathon
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
