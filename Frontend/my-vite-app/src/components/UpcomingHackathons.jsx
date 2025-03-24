import React, { useState, useEffect } from 'react';
import { Calendar, Code, Shield } from 'lucide-react';
import HackathonCard from './HackathonCard';
import { getHackathons } from "../apis/hackathonapi";
import { toast } from "react-toastify";

const UpcomingHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        return;
      }
      try {
        const allHackathons = await getHackathons(token);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingHackathons = allHackathons.filter((hackathon) => {
          const startDate = new Date(hackathon.start_date);
          startDate.setHours(0, 0, 0, 0);

          return startDate > today;
        });

        setHackathons(upcomingHackathons);
      } catch (error) {
        toast.error(error.error || "Failed to fetch hackathons.");
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  // const events = [
  //   {
  //     id: 1,
  //     title: "AI Revolution 2025",
  //     date: "June 15, 2025",
  //     description: "Join the AI revolution! Innovate and build AI-driven solutions for real-world problems.",
  //     icon: <Calendar className="h-5 w-5 text-white" />, 
  //     emoji: "🤖 🚀",
  //     stats: {
  //       registrations: 1000,
  //       participants: 800
  //     },
  //     color: "bg-indigo-600",
  //     image: "../../src/assets/AiRevolution.png",
  //     accessType: "Public - Open for students and professionals"
  //   },
  //   {
  //     id: 2,
  //     title: "CyberDefend Hack 2025",
  //     date: "July 22, 2025",
  //     description: "Test your cybersecurity skills in a high-stakes hacking challenge. Win big and secure the future!",
  //     icon: <Shield className="h-5 w-5 text-white" />,
  //     emoji: "🔐💻",
  //     stats: {
  //       registrations: 1200,
  //       participants: 950
  //     },
  //     color: "bg-blue-600",
  //     image: "../../src/assets/CyberDefend.png",
  //     accessType: "Private - Invite-only for security professionals"
  //   },
  //   {
  //     id: 3,
  //     title: "Blockchain Builders 2025",
  //     date: "August 18, 2025",
  //     description: "Shape the future of blockchain! Compete to build the most innovative decentralized applications.",
  //     icon: <Code className="h-5 w-5 text-white" />,
  //     emoji: "⛓ 💡",
  //     stats: {
  //       registrations: 900,
  //       participants: 700
  //     },
  //     color: "bg-gray-700",
  //     image: "../../src/assets/BlockchainBuilders.png",
  //     accessType: "Public - Open for students and professionals"
  //   }
  // ];

  return (
    <div className="max-w-4xl mx-auto mt-2 p-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Upcoming Hackathons</h2>
      {loading ? (
        <p className="text-gray-600">Loading hackathons...</p>
      ) : hackathons.length > 0 ? (
        <div className="grid gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon._id} event={hackathon} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No upcoming hackathons found.</p>
      )}
    </div>
  );
};

export default UpcomingHackathons;
