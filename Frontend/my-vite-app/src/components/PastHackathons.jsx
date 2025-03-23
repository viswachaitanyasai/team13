import React from 'react';
import { Calendar, Code, Shield } from 'lucide-react';

const PastHackathons = () => {
  const events = [
    {
      id: 1,
      title: "AI Challenge 2024",
      date: "March 10, 2024",
      description: "Explore cutting-edge AI solutions and compete with top minds! Showcase your innovative approaches to real-world problems.",
      icon: <Calendar className="h-5 w-5" />,
      emoji: "🧠 💻",
      stats: {
        registrations: 500,
        participants: 300
      },
      color: "bg-purple-600",
      image: "../../src/assets/Ai.png",
      accessType: "Public - Open for students and professionals" // Change to actual path or URL
    },
    {
      id: 2,
      title: "CyberSec Hackathon",
      date: "January 25, 2024",
      description: "Join us this Sunday for a chance to win exciting prizes as we delve into 'Unlocking the Future: Navigating the Shadows of Cybersecurity,' taking a small step towards a more secure tomorrow.",
      icon: <Shield className="h-5 w-5" />,
      emoji: "🔒",
      stats: {
        registrations: 700,
        participants: 500
      },
      color: "bg-red-600",
      image: "../../src/assets/Cyber.png",
      accessType: "Private - Invite-only for security researchers"// Change to actual path or URL
    },
    {
      id: 3,
      title: "Blockchain Sprint",
      date: "December 15, 2023",
      description: "Unleash your coding genius in blockchain technology, and win epic prizes! Build decentralized solutions to transform industries.",
      icon: <Code className="h-5 w-5" />,
      emoji: "⛓ ✨",
      stats: {
        registrations: 450,
        participants: 250
      },
      color: "bg-blue-600",
      image: "/assets/blockchain.png",
      accessType: "Public - Open for students and professionals"// Change to actual path or URL
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Past Hackathons</h2>
      <div className="relative pl-12 md:pl-16">
        {/* Timeline line */}
        <div className="absolute left-5 md:left-8 top-0 h-full w-0.5 bg-gray-700"></div>
        
        {/* Event cards */}
        {events.map((event) => (
          <div key={event.id} className="mb-10 relative">
            {/* Icon circle */}
            <div className={`absolute -left-7 md:-left-10 w-12 h-12 rounded-full ${event.color} flex items-center justify-center z-10`}>
              {event.icon}
            </div>
            
            {/* Card */}
            <div className="bg-gray-900 bg-opacity-40 rounded-xl border border-gray-800 p-5 ml-2 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-900/30">
              <h2 className="text-orange-500 text-xl md:text-2xl font-bold">{event.title}</h2>
              <p className="text-amber-400 text-sm mb-3">{event.date}</p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-gray-300">{event.description} <span className="text-base">{event.emoji}</span></p>
                </div>
                <div className="flex-shrink-0 h-32 w-full md:w-48 overflow-hidden rounded-lg bg-gray-800">
                  <img 
                    src={event.image} 
                    alt={`${event.title} illustration`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Access Type Section */}
              <div className="mb-3">
                <span className="px-3 py-1.5 bg-gray-800 text-indigo-300 rounded-lg text-sm">
                  {event.accessType}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm">
                    Registrations: {event.stats.registrations}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm">
                    Participants: {event.stats.participants}
                  </span>                </div>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors duration-200">
                  View Submissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastHackathons;
