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
      navigate("/dashboard"); // ✅ Redirect to dashboard after deletion
    } catch (error) {
      console.error("Hackathon Deletion Error:", error);
      toast.error(error.error || "Failed to delete hackathon.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-700 rounded-md"></div>
          <div className="h-4 w-64 bg-gray-700 rounded-md"></div>
          <div className="h-4 w-40 bg-gray-700 rounded-md"></div>
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
    <div className="min-h-screen flex justify-center bg-gray-900 p-6 text-white w-full">
      <div className="w-full h-full bg-gray-800 rounded-xl shadow-lg p-6">

      <div className="flex items-center w-50 justify-between bg-gray-700 p-3 rounded-lg mb-4">
          <span className="text-lg font-semibold text-white">Invite Code:</span>
          <div className="flex items-center gap-3">
            <span className="text-orange-400 font-bold">{hackathon.invite_code}</span>
            <button
              onClick={handleCopyInviteCode}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-white text-sm flex items-center gap-1"
            >
              <FaCopy /> Copy
            </button>
          </div>
        </div>

        {/* 🔥 Hackathon Title */}
        <h2 className="text-3xl font-bold text-orange-400">{hackathon.title}</h2>
        <p className="text-gray-400 mt-2">{hackathon.description}</p> {/* ✅ ADDED DESCRIPTION */}

        {/* 🗓️ Hackathon Details */}
        <div className="mt-4">
          <p><FaCalendarAlt className="inline-block text-indigo-400 mr-2" /><strong>Start Date:</strong> {new Date(hackathon.start_date).toLocaleDateString()}</p>
          <p><FaCalendarAlt className="inline-block text-red-400 mr-2" /><strong>End Date:</strong> {new Date(hackathon.end_date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {hackathon.status}</p> {/* ✅ ADDED STATUS */}
        </div>

        {/* 👥 Participants */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white">Participants:</h3>
          <ul className="list-disc ml-6 text-gray-300">
            {hackathon.participants.length > 0 ? (
              hackathon.participants.map((participant, index) => (
                <li key={index}>
                  <FaUser className="inline-block text-indigo-400 mr-2" />
                  {participant.name} - {participant.email}
                </li>
              ))
            ) : (
              <p className="text-gray-400">No participants yet.</p>
            )}
          </ul>
        </div>

        {/* 🏆 Judging Parameters */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white">Judging Parameters:</h3>
          <ul className="list-disc ml-6 text-gray-300">
            {hackathon.judging_parameters.length > 0 ? (
              hackathon.judging_parameters.map((param, index) => (
                <li key={index}><FaClipboardList className="inline-block text-green-400 mr-2" />{param.name}</li>
              ))
            ) : (
              <p className="text-gray-400">No judging parameters specified.</p>
            )}
          </ul>
        </div>

        {/* 🔑 Access Type */}
        <div className="mt-4">
          <p>
            <FaGlobe className="inline-block text-blue-400 mr-2" />
            <strong>Access Type:</strong> {hackathon.is_public ? "Public" : "Private"}
          </p>
          {!hackathon.is_public && hackathon.invite_code && (
            <p>
              <FaKey className="inline-block text-yellow-400 mr-2" />
              <strong>Invite Code:</strong> {hackathon.invite_code}
            </p>
          )}
        </div>

        {/* 📄 Additional Details */}
        <div className="mt-4">
          <p><strong>Allow Multiple Solutions:</strong> {hackathon.allow_multiple_solutions ? "Yes" : "No"}</p> {/* ✅ ADDED allow_multiple_solutions */}
          <p><strong>Custom Prompt:</strong> {hackathon.custom_prompt}</p> {/* ✅ ADDED custom_prompt */}
          <p><strong>Grade:</strong> {hackathon.grade}</p> {/* ✅ ADDED Grade */}
        </div>

        {/* 🎗️ Sponsors */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white">Sponsors:</h3>
          <ul className="list-disc ml-6 text-gray-300">
            {hackathon.sponsors.length > 0 ? (
              hackathon.sponsors.map((sponsor, index) => (
                <li key={index}>{sponsor}</li>
              ))
            ) : (
              <p className="text-gray-400">No sponsors listed.</p>
            )}
          </ul>
        </div>

        {/* 📎 Attached File */}
        {hackathon.file_attachment_url && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">Attached File:</h3>
            <a href={hackathon.file_attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              <FaFileAlt className="inline-block mr-2" />View File
            </a>
          </div>
        )}

        {/* 📷 Display Banner */}
        {hackathon.image_url && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white">Hackathon Banner:</h3>
            <img src={hackathon.image_url} alt="Hackathon Banner" className="w-full max-w-lg rounded-lg" />
          </div>
        )}
        {hackathon.status === "upcoming" && (
          <div className="mt-6 flex gap-4">
            {/* Edit Button */}
            <button
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md flex items-center"
              onClick={() => navigate(`/edit-hackathon/${hackathonId}`)}
            >
              <FaEdit className="mr-2" /> Edit Hackathon
            </button>

            {/* Delete Button */}
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
              onClick={handleDeleteHackathon}
            >
              <FaTrash className="mr-2" /> Delete Hackathon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHackathon;
