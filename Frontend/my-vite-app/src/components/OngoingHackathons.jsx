import React, { useState, useEffect } from 'react';
import { Calendar, Code, Shield } from 'lucide-react';
import HackathonCard from './HackathonCard';
import { getHackathons } from "../apis/hackathonapi";
import { toast } from "react-toastify";

const OngoingHackathons = () => {
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
          const today= new Date();
          today.setHours(0, 0, 0, 0);

        const ongoingHackathons = allHackathons.filter((hackathon) => {
          const startDate = new Date(hackathon.start_date);
          const endDate = new Date(hackathon.end_date);

          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          return startDate <= today && endDate >= today;
        });
  
        setHackathons(ongoingHackathons);
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
  //     title: "AI Challenge 2024",
  //     date: "March 10, 2024",
  //     description: "Explore cutting-edge AI solutions and compete with top minds! Showcase your innovative approaches to real-world problems.",
  //     // icon: <Calendar className="h-5 w-5 text-white" />, 
  //     emoji: "🧠 💻",
  //     stats: {
  //       registrations: 500,
  //       participants: 300
  //     },
  //     color: "bg-indigo-600",
  //     image: "../../src/assets/Ai.png",
  //     accessType: "Public - Open for students and professionals"
  //   },
  //   {
  //     id: 2,
  //     title: "CyberSec Hackathon",
  //     date: "January 25, 2024",
  //     description: "Join us this Sunday for a chance to win exciting prizes as we delve into 'Unlocking the Future: Navigating the Shadows of Cybersecurity.'",
  //     icon: <Shield className="h-5 w-5 text-white" />,
  //     emoji: "🔒",
  //     stats: {
  //       registrations: 700,
  //       participants: 500
  //     },
  //     color: "bg-blue-600",
  //     image: "../../src/assets/Cyber.png",
  //     accessType: "Private - Invite-only for security researchers"
  //   },
  //   {
  //     id: 3,
  //     title: "Blockchain Sprint",
  //     date: "December 15, 2023",
  //     description: "Unleash your coding genius in blockchain technology, and win epic prizes! Build decentralized solutions to transform industries.",
  //     icon: <Code className="h-5 w-5 text-white" />,
  //     emoji: "⛓ ✨",
  //     stats: {
  //       registrations: 450,
  //       participants: 250
  //     },
  //     color: "bg-gray-700",
  //     image: "/assets/blockchain.png",
  //     accessType: "Public - Open for students and professionals"
  //   }
  // ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Ongoing Hackathons</h2>
      {loading ? (
        <p className="text-gray-600">Loading hackathons...</p>
      ) : hackathons.length > 0 ? (
        <div className="grid gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon._id} event={hackathon} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No ongoing hackathons found.</p>
      )}
    </div>
  );
};

export default OngoingHackathons;