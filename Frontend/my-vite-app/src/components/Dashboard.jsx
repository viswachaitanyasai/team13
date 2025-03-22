import React from "react";
import HackathonPieChart from "./HackathonPieChart";
import RegistrationStats from "./RegistrationStats";
import HackathonStatus from "./HackathonStatus";
import PastHackathons from "./PastHackathons";

function Dashboard() {
    const ongoingHackathons = ["Hackathon X", "CodeSprint 2025"];
    const upcomingHackathons = ["AI Challenge", "CyberSec Hack"];
    const pastHackathons = [
        {
          name: "AI Challenge 2024",
          date: "March 10, 2024",
          registered: 500,
          participated: 300,
          submissions: 120,
        },
        {
          name: "CyberSec Hackathon",
          date: "Jan 25, 2024",
          registered: 700,
          participated: 500,
          submissions: 200,
        },
        {
          name: "Blockchain Sprint",
          date: "Dec 15, 2023",
          registered: 450,
          participated: 250,
          submissions: 100,
        },
      ];
  return (
    <main className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Hackathon Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <HackathonStatus ongoing={ongoingHackathons} upcoming={upcomingHackathons} />
      <RegistrationStats week={50} month={200} year={1500} />
          <HackathonPieChart registered={100} participated={50} />


        {/* Registration Stats - Weekly, Monthly, Yearly */}
        {/* <div className="bg-gray-800 p-5 rounded-xl shadow-lg flex justify-center"> */}
          
        {/* </div> */}
        
      </div>
      <div className="">
        <PastHackathons hackathons={pastHackathons} />
      </div>
    </main>
  );
}

export default Dashboard;
