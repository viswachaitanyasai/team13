import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const HackathonPieChart = ({ registered, participated }) => {
  const data = [
    { name: "Registered", value:registered, color: "#4CAF50" }, // Green
    { name: "Participated", value: registered-(registered-participated), color: "#F44336" }, // Red
  ];

  return (
    <div className="bg-gray-900 p-5 rounded-xl shadow-lg">
      <h2 className="text-white text-lg font-semibold text-center mb-3">
        Hackathon Participation
      </h2>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default HackathonPieChart;
