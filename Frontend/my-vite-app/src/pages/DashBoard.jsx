import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateHackathon from "./CreateHackathon"; // Import the form
import HackathonModal from "../components/HackathonModal";

const hackathons = [
  {
    title: "AI Challenge",
    date: "May 15, 2025",
    participants: 250,
    image: "../src/assets/Ai.png",
  },
  {
    title: "Cyber Security Sprint",
    date: "June 10, 2025",
    participants: 300,
    image: "../src/assets/Cyber.png",
  },
  {
    title: "Web Dev Battle",
    date: "July 1, 2025",
    participants: 180,
    image: "../src/assets/Web.png",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Blur background when modal is open */}
      <div className={isModalOpen ? "opacity-50 pointer-events-none" : ""}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
          >
            + Create Hackathon
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Hackathons */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Upcoming Hackathons
            </h2>
            <div className="space-y-4">
              {hackathons.map((hack, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-sm flex"
                >
                  <img
                    src={hack.image}
                    alt={hack.title}
                    className="w-1/3 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {hack.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {hack.date} • {hack.participants} registered
                    </p>
                    <button className="mt-2 text-blue-500 hover:underline text-sm">
                      Learn more &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Quick Actions
            </h2>
            <button className="block w-full bg-gray-200 py-2 my-2 rounded-md hover:bg-gray-300 transition">
              View Submissions
            </button>
            <button className="block w-full bg-gray-200 py-2 my-2 rounded-md hover:bg-gray-300 transition">
              Manage Teams
            </button>
            <button className="block w-full bg-gray-200 py-2 my-2 rounded-md hover:bg-gray-300 transition">
              Send Announcements
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Creating Hackathon */}
      <HackathonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateHackathon />
      </HackathonModal>
    </div>
  );
};

export default Dashboard;
