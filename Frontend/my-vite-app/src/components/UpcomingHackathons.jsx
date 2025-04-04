import React, { useState, useEffect } from 'react';
import { Calendar, Code, Shield } from 'lucide-react';
import HackathonCard from './HackathonCard';
import { getHackathons } from "../apis/hackathonapi";
import { toast } from "react-toastify";


const UpcomingHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  
    const fetchHackathons = async () => {
      setLoading(true);
      try{
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        return;
      }
      
        const allHackathons = await getHackathons(token);
        console.log(allHackathons);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingHackathons = allHackathons.filter((hackathon) => {
          const startDate = new Date(hackathon.start_date);
          startDate.setHours(0, 0, 0, 0);

          return startDate > today;
        });

        setHackathons(upcomingHackathons);
      } catch (error) {
        console.error(error);
        toast.error(error.error || "Failed to fetch hackathons.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
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
    <div className="bg-white min-h-screen p-8 text-white">
    <div className="max-w-4xl mx-auto mt-2 p-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Upcoming Hackathons</h2>

      {loading ? (
        // ✅ **Skeleton Loader**
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
             <div key={index} className="bg-gray-200 rounded-xl border border-gray-200 p-5 shadow-md animate-pulse">
             <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
             <div className="h-4 bg-gray-400 rounded w-1/2 mb-4"></div>
             <div className="h-20 bg-gray-300 rounded mb-4"></div>
             <div className="h-6 bg-gray-400 rounded w-1/3"></div>
           </div>
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard
              key={hackathon._id}
              event={hackathon}
              refreshHackathons={fetchHackathons}
              showDeleteButton={true}
              showEditButton={true} 
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No upcoming hackathons found.</p>
      )}
    </div>
    </div>
  );
};

export default UpcomingHackathons;
