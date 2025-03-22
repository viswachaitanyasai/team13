import React from "react";

const RegistrationStats = ({ week, month, year }) => {
  return (
    <div className="bg-gray-900 text-white p-5 rounded-xl shadow-lg w-72">
      <h2 className="text-lg font-semibold text-center mb-3">Total Registrations</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm">Last Week</span>
          <span className="text-lg font-bold">{week}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm">Last Month</span>
          <span className="text-lg font-bold">{month}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Last Year</span>
          <span className="text-lg font-bold">{year}</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStats;
