import React from "react";
import { useNavigate } from "react-router-dom";

const HackathonCard = ({ event }) => {
  const navigate = useNavigate();

  if (!event) return null;

  const handleViewSubmissions = () => {
    navigate(`/submission/${event._id}`);
  };

  const handleViewHackathon = () => {
    navigate(`/hackathon/${event._id}`);
  };

  return (
    <div className="mb-10 ">
      {/* Icon circle */}
      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 ml-2 shadow-md transition-transform duration-300 hover:shadow-lg ">
        <h2 className="text-indigo-700 text-xl md:text-2xl font-bold">{event.title}</h2>
        <p className="text-gray-600 text-sm mb-3">{event.date}</p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <p className="text-gray-700">{event.description} <span className="text-base">{event.emoji}</span></p>
          </div>
          <div className="flex-shrink-0 h-32 w-full md:w-48 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
            <img 
              src={event.image} 
              alt={`${event.title} illustration`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Access Type Section */}
        {/* <div className="mb-3">
          <span className="px-3 py-1.5 bg-gray-100 text-indigo-700 rounded-lg text-sm">
            {event.accessType}
          </span>
        </div> */}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
              Registrations: {event.stats?.registrations ?? 0}
            </span>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
              Participants: {event.stats?.participants ?? 0}
            </span>
          </div>
          <button
              onClick={handleViewHackathon}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            >
              View Hackathon
            </button>
          <button
            onClick={handleViewSubmissions}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            View Submissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
