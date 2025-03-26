import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHackathonById } from "../apis/hackathonapi"; // API call to fetch hackathon
import { toast } from "react-toastify";
import { FaUser, FaCalendarAlt, FaClipboardList, FaKey, FaGlobe, FaFileAlt, FaEdit, FaTrash, FaCopy } from "react-icons/fa"; // Icons for UI
import { removeHackathon } from "../apis/hackathonapi";

const ViewHackathon = () => {
  const { hackathonId } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate();

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await getHackathonById(hackathonId);
        console.log(response);
        setHackathon(response);
      } catch (error) {
        toast.error(error.error || "Failed to load hackathon details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [hackathonId]);

  const handleCopyInviteCode = () => {
    if (hackathon?.invite_code) {
      navigator.clipboard.writeText(hackathon.invite_code);
      toast.success("Invite code copied to clipboard!");
    }
  };
  const handleDeleteHackathon = async () => {
    if (!window.confirm("Are you sure you want to delete this hackathon?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await removeHackathon(hackathonId, token);
      toast.success("Hackathon deleted successfully!");
      navigate("/hackathons"); // ✅ Redirect to dashboard after deletion
    } catch (error) {
      console.error("Hackathon Deletion Error:", error);
      toast.error(error.error || "Failed to delete hackathon.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white text-white">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-300 rounded-md"></div>
          <div className="h-4 w-64 bg-gray-300 rounded-md"></div>
          <div className="h-4 w-40 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="mt-10 flex justify-center">
        <div className="bg-gray-800 text-red-400 border border-red-500 px-6 py-3 rounded-lg shadow-lg">
          Hackathon not found.
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
          
          {hackathon.status === "upcoming" && (
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm flex items-center transition-colors"
                onClick={() => navigate(`/edit-hackathon/${hackathonId}`)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm flex items-center transition-colors"
                onClick={handleDeleteHackathon}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
  
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Invite Code Banner */}
          <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 p-6 py-2 pt-3 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-medium">Invite Participants</h3>
                <p className="text-indigo-200 text-sm mt-1">Share this code to allow others to join</p>
              </div>
              <div className="flex items-center gap-3 bg-indigo-900/30 px-4 py-2 rounded-lg">
                <span className="text-xl font-mono font-bold tracking-wider">{hackathon.invite_code}</span>
                <button
                  onClick={handleCopyInviteCode}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-md transition-colors"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
          {/* Hackathon Banner Image */}
          {hackathon.image_url && (
            <div className="w-full h-64 sm:h-80 overflow-hidden">
              <img 
                src={hackathon.image_url} 
                alt="Hackathon Banner" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
  
          {/* Hackathon Title and Description */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{hackathon.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  hackathon.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                  hackathon.status === "ongoing" ? "bg-green-100 text-green-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {hackathon.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {hackathon.is_public ? "Public" : "Private"}
                </span>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{hackathon.description}</p>
            </div>
  
            {/* Key Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-500 text-xl">Start Date</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900 flex justify-center items-center pb-0">
                  {new Date(hackathon.start_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
  
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-500 text-xl">End Date</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(hackathon.end_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
  
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-500 text-xl">Access</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {hackathon.is_public ? "Open to all" : "Invite only"}
                </p>
              </div>
  
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-500 text-xl">Multiple Solutions</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {hackathon.allow_multiple_solutions ? "Allowed" : "Not Allowed"}
                </p>
              </div>
            </div>
  
            {/* Problem Statement Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-line">{hackathon.problem_statement}</p>
              </div>
            </div>
  
            {/* Additional Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Judging Parameters */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Judging Parameters
                </h2>
                {hackathon.judging_parameters.length > 0 ? (
                  <ul className="space-y-3">
                    {hackathon.judging_parameters.map((param, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-gray-700">{param.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No judging parameters specified</p>
                )}
              </div>
  
              {/* Sponsors */}
              {hackathon.sponsors.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Sponsors
                  </h2>
                  <ul className="space-y-3">
                    {hackathon.sponsors.map((sponsor, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                        <span className="text-gray-700">{sponsor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
  
            {/* Attachments */}
            {hackathon.file_attachment_url && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Resources
                </h2>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <a 
                      href={hackathon.file_attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Download Resource File
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Click to view/download additional resources</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewHackathon;
