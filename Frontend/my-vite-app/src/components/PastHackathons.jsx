import React from 'react';
import { Calendar, Code, Shield } from 'lucide-react';
import HackathonCard from './HackathonCard';

const PastHackathons = () => {
  const events = [
    {
      id: 1,
      title: "AI Challenge 2024",
      date: "March 10, 2024",
      description: "Explore cutting-edge AI solutions and compete with top minds! Showcase your innovative approaches to real-world problems.",
      // icon: <Calendar className="h-5 w-5 text-white" />, 
      emoji: "🧠 💻",
      stats: {
        registrations: 500,
        participants: 300
      },
      color: "bg-indigo-600",
      image: "../../src/assets/Ai.png",
      accessType: "Public - Open for students and professionals"
    },
    {
      id: 2,
      title: "CyberSec Hackathon",
      date: "January 25, 2024",
      description: "Join us this Sunday for a chance to win exciting prizes as we delve into 'Unlocking the Future: Navigating the Shadows of Cybersecurity.'",
      icon: <Shield className="h-5 w-5 text-white" />,
      emoji: "🔒",
      stats: {
        registrations: 700,
        participants: 500
      },
      color: "bg-blue-600",
      image: "../../src/assets/Cyber.png",
      accessType: "Private - Invite-only for security researchers"
    },
    {
      id: 3,
      title: "Blockchain Sprint",
      date: "December 15, 2023",
      description: "Unleash your coding genius in blockchain technology, and win epic prizes! Build decentralized solutions to transform industries.",
      icon: <Code className="h-5 w-5 text-white" />,
      emoji: "⛓ ✨",
      stats: {
        registrations: 450,
        participants: 250
      },
      color: "bg-gray-700",
      image: "/assets/blockchain.png",
      accessType: "Public - Open for students and professionals"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Past Hackathons</h2>
      <div className="">      
        {events.map((event) => (
          <HackathonCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default PastHackathons;