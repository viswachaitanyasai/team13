import React, { useState } from "react";

function AboutHackathons() {
  const [selectedOption, setSelectedOption] = useState("upcoming");

  const renderContent = () => {
    switch (selectedOption) {
      case "upcoming":
        return <p>These are the upcoming hackathons you can participate in.</p>;
      case "past":
        return <p>Here are details of past hackathons and their winners.</p>;
      case "ongoing":
        return <p>Check out the ongoing hackathons happening right now!</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Hackathon Information
      </h2>
      
      {/* Radio Buttons */}
      <div className="flex justify-center gap-6 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="hackathonType"
            value="upcoming"
            checked={selectedOption === "upcoming"}
            onChange={() => setSelectedOption("upcoming")}
          />
          Upcoming Hackathons
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="hackathonType"
            value="past"
            checked={selectedOption === "past"}
            onChange={() => setSelectedOption("past")}
          />
          Past Hackathons
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="hackathonType"
            value="ongoing"
            checked={selectedOption === "ongoing"}
            onChange={() => setSelectedOption("ongoing")}
          />
          Ongoing Hackathons
        </label>
      </div>
      
      {/* Dynamic Content */}
      <div className="bg-white p-6 shadow-md rounded-lg text-center">
        {renderContent()}
      </div>
    </div>
  );
}

export default AboutHackathons;
