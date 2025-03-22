import React from "react";

const HackathonStatus = ({ ongoing, upcoming }) => {
  return (
    <div className="bg-gray-800 text-white p-5 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-3">Hackathon Status</h2>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-indigo-400">Ongoing Hackathons</h3>
        {ongoing.length > 0 ? (
          <ul className="list-disc list-inside text-sm mt-2">
            {ongoing.map((hackathon, index) => (
              <li key={index} className="text-gray-300">{hackathon}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No ongoing hackathons.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-green-400">Upcoming Hackathons</h3>
        {upcoming.length > 0 ? (
          <ul className="list-disc list-inside text-sm mt-2">
            {upcoming.map((hackathon, index) => (
              <li key={index} className="text-gray-300">{hackathon}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">No upcoming hackathons.</p>
        )}
      </div>
    </div>
  );
};

export default HackathonStatus;
