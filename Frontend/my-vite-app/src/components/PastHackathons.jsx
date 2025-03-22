import React from "react";

const PastHackathons = ({ hackathons }) => {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center text-white mt-10 ">
        🔥 Past Hackathons
      </h2>

      {hackathons.map((hackathon, index) => (
        <div key={index} className="bg-blue-200 p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold text-indigo-700">{hackathon.name}</h3>
          <p className="text-sm text-gray-600">
            📅 <strong>Date:</strong> {hackathon.date}
          </p>
          <p className="text-sm text-gray-600">
            📌 <strong>Registered:</strong> {hackathon.registered} students
          </p>
          <p className="text-sm text-gray-600">
            ✅ <strong>Participated:</strong> {hackathon.participated} students
          </p>
          <p className="text-sm text-gray-600">
            📂 <strong>Submissions:</strong> {hackathon.submissions}
          </p>
        </div>
      ))}
      </>
  );
};

export default PastHackathons;
