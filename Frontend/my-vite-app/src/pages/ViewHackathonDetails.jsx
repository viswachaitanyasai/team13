import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getHackathonById } from "../apis/hackathonapi"; // API call to fetch hackathon
import { toast } from "react-toastify";
import { FaUser, FaCalendarAlt, FaClipboardList } from "react-icons/fa"; // Icons for UI

const ViewHackathon = () => {
  const { hackathonId } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await getHackathonById(hackathonId);
        setHackathon(response);
      } catch (error) {
        toast.error(error.error || "Failed to load hackathon details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [hackathonId]);

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
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-orange-400">{hackathon.title}</h2>
        <p className="text-gray-300 mt-2">{hackathon.description}</p>

        {/* Event Dates */}
        <div className="mt-4 flex items-center text-gray-400">
          <FaCalendarAlt className="mr-2" />
          <span className="text-sm">
            {new Date(hackathon.start_date).toLocaleDateString()} -{" "}
            {new Date(hackathon.end_date).toLocaleDateString()}
          </span>
        </div>

        {/* Judging Parameters */}
        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Judging Criteria</h3>
          <ul className="text-gray-300 text-sm">
            {hackathon.judging_parameters.map((param, index) => (
              <li key={index} className="flex items-center gap-2">
                <FaClipboardList className="text-indigo-400" />
                {param}
              </li>
            ))}
          </ul>
        </div>

        {/* Participants */}
        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Participants</h3>
          {hackathon.participants.length > 0 ? (
            <ul className="text-gray-300 text-sm">
              {hackathon.participants.map((participant, index) => (
                <li key={index} className="flex items-center gap-2">
                  <FaUser className="text-green-400" />
                  {participant.name} ({participant.email})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No participants yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewHackathon;
