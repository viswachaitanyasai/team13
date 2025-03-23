import React from 'react';
import { Calendar, Code, Shield } from 'lucide-react';
import HackathonCard from './HackathonCard';

const UpcomingHackathons = () => {
  const events = [
    {
      id: 1,
      title: "AI Revolution 2025",
      date: "June 15, 2025",
      description: "Join the AI revolution! Innovate and build AI-driven solutions for real-world problems.",
      icon: <Calendar className="h-5 w-5 text-white" />, 
      emoji: "🤖 🚀",
      stats: {
        registrations: 1000,
        participants: 800
      },
      color: "bg-indigo-600",
      image: "../../src/assets/AiRevolution.png",
      accessType: "Public - Open for students and professionals"
    },
    {
      id: 2,
      title: "CyberDefend Hack 2025",
      date: "July 22, 2025",
      description: "Test your cybersecurity skills in a high-stakes hacking challenge. Win big and secure the future!",
      icon: <Shield className="h-5 w-5 text-white" />,
      emoji: "🔐💻",
      stats: {
        registrations: 1200,
        participants: 950
      },
      color: "bg-blue-600",
      image: "../../src/assets/CyberDefend.png",
      accessType: "Private - Invite-only for security professionals"
    },
    {
      id: 3,
      title: "Blockchain Builders 2025",
      date: "August 18, 2025",
      description: "Shape the future of blockchain! Compete to build the most innovative decentralized applications.",
      icon: <Code className="h-5 w-5 text-white" />,
      emoji: "⛓ 💡",
      stats: {
        registrations: 900,
        participants: 700
      },
      color: "bg-gray-700",
      image: "../../src/assets/BlockchainBuilders.png",
      accessType: "Public - Open for students and professionals"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Upcoming Hackathons</h2>
      <div className="relative pl-12 md:pl-16">
        {/* Timeline line */}
        <div className="absolute left-5 md:left-8 top-0 h-full w-0.5 bg-gray-300"></div>
        
        {events.map((event) => (
          <HackathonCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default UpcomingHackathons;
