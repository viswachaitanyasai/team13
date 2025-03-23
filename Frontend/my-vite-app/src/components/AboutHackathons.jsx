import React, { useState } from 'react';
import { Trophy, Lightbulb, Users } from "lucide-react";
import UpcomingHackathons from './UpcomingHackathons';
import PastHackathons from './PastHackathons';
// import UpcomingHackathons from './UpcomingHackathons';


const AboutHackathons = () => {
  const [activeSection, setActiveSection] = useState('past');

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen p-6 text-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 tracking-wide">Hackathon Central</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Discover the exciting world of hackathons where innovation meets collaboration. 
            Our platform showcases events from various tech domains including <span className="text-indigo-600 font-semibold">AI</span>, 
            <span className="text-blue-600 font-semibold"> Cybersecurity</span>, and 
            <span className="text-gray-800 font-semibold"> Blockchain Technology</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[ 
            {
              title: "Compete",
              description: "Challenge yourself against top minds and showcase your technical expertise.",
              icon: <Trophy className="h-10 w-10 text-indigo-500" />,
              bgColor: "bg-indigo-100 border-indigo-300"
            },
            {
              title: "Learn",
              description: "Gain valuable experience and expand your skillset through hands-on projects.",
              icon: <Lightbulb className="h-10 w-10 text-blue-500" />,
              bgColor: "bg-blue-100 border-blue-300"
            },
            {
              title: "Network",
              description: "Connect with fellow enthusiasts, mentors, and potential employers in tech.",
              icon: <Users className="h-10 w-10 text-gray-700" />,
              bgColor: "bg-gray-100 border-gray-300"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-xl border p-6 flex flex-col items-center text-center transition-transform duration-300  hover:shadow-xl`}
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mb-12 flex justify-center flex-wrap gap-4">
          <button onClick={() => setActiveSection('past')} className={`px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 ${activeSection === 'past' ? 'bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            Past Hackathons
          </button>
          <button onClick={() => setActiveSection('ongoing')} className={`px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 ${activeSection === 'ongoing' ? 'bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            Ongoing Hackathons
          </button>
          <button onClick={() => setActiveSection('upcoming')} className={`px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 ${activeSection === 'upcoming' ? 'bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
            Upcoming Hackathons
          </button>
        </div>
      </div>

      {/* Display Selected Section */}
      <div className="mt-6">
        {activeSection === 'past' && <PastHackathons />}
        {/* {activeSection === 'ongoing' && <OngoingHackathons />} */}
        {activeSection === 'upcoming' && <UpcomingHackathons />}
      </div>
    </div>
  );
};

export default AboutHackathons;
