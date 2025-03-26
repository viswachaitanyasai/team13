import React from "react";
import { useNavigate } from "react-router-dom";
import { removeHackathon } from "../apis/hackathonapi";
import { toast } from "react-toastify";

const HackathonCard = ({ event, refreshHackathons, showDeleteButton, showEditButton }) => {
  const navigate = useNavigate();

  if (!event) return null;
console.log(event);
  const today = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let status = "Upcoming";
  let statusColor = "bg-sky-500"; // Default for upcoming

  if (today >= startDate && today <= endDate) {
    status = "Ongoing";
    statusColor = "bg-green-500";
  } else if (today > endDate) {
    status = "Past";
    statusColor = "bg-gray-500";
  }

  const handleViewSubmissions = () => {
    navigate(`/summary/${event._id}`);
  };

  const handleViewHackathon = () => {
    navigate(`/hackathon/${event._id}`);
  };
  const handleEditHackathon = () => {
    navigate(`/edit-hackathon/${event._id}`);
  };

  const handleDeleteHackathon = async () => {
    if (!window.confirm("Are you sure you want to delete this hackathon?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await removeHackathon(event._id, token);
      toast.success("Hackathon deleted successfully!");
      if (refreshHackathons) {
        refreshHackathons();
      }
    } catch (error) {
      console.error("Hackathon Deletion Error:", error);
      toast.error(error.message || "Failed to delete hackathon.");
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Card Header with Image */}
        <div className="relative h-48 w-full bg-gradient-to-r from-blue-50 to-indigo-50">
          {event.image_url || event.image ? (
            <img
              src={event.image_url || event.image}
              alt={`${event.title} banner`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
          )}
        </div>
  
        {/* Card Content */}
        <div className="p-5">
          {/* Title and Date */}
          <div className="flex justify-between items-start mb-3">
            <h2
              className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
              onClick={handleViewHackathon}
            >
              {event.title}
            </h2>
            <span className="text-sm text-gray-500 whitespace-nowrap ml-3">
              {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
            </span>
          </div>
  
          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {event.description} {event.emoji && (
              <span className="ml-1 text-lg">{event.emoji}</span>
            )}
          </p>
  
          {/* Status and Stats */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
              {status}
            </span>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{event?.participants?.length || 0} Registered</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event?.submissions?.length || 0} Submissions</span>
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleViewHackathon}
              className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            
            <button
              onClick={handleViewSubmissions}
              className="flex items-center px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Submissions
            </button>
  
            {showEditButton && (
              <button
                onClick={handleEditHackathon}
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
  
            {showDeleteButton && (
              <button
                onClick={handleDeleteHackathon}
                className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
