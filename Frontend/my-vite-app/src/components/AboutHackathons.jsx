import React from 'react';
import { Trophy, Lightbulb, Users } from "lucide-react";
import PastHackathons from './PastHackathons';

const AboutHackathons = () => {
  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-orange-500 mb-4 tracking-wide">Hackathon Central</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Discover the exciting world of hackathons where innovation meets collaboration. 
            Our platform showcases events from various tech domains including <span className="text-indigo-400 font-semibold">AI</span>, 
            <span className="text-red-400 font-semibold"> cybersecurity</span>, and 
            <span className="text-green-400 font-semibold"> blockchain technology</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Compete",
              description: "Challenge yourself against top minds and showcase your technical expertise.",
              icon: <Trophy className="h-10 w-10 text-yellow-400" />,
              bgColor: "bg-gray-900/70 border-gray-700"
            },
            {
              title: "Learn",
              description: "Gain valuable experience and expand your skillset through hands-on projects.",
              icon: <Lightbulb className="h-10 w-10 text-indigo-400" />,
              bgColor: "bg-gray-900/70 border-gray-700"
            },
            {
              title: "Network",
              description: "Connect with fellow enthusiasts, mentors, and potential employers in tech.",
              icon: <Users className="h-10 w-10 text-green-400" />,
              bgColor: "bg-gray-900/70 border-gray-700"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-xl border p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gray-900/40`}
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-base">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mb-12 flex justify-center flex-wrap gap-4">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors duration-200">
            Past Hackathons
          </button>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors duration-200">
            Ongoing Hackathons
          </button>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors duration-200">
            Upcoming Hackathons
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200">
            Host an Event
          </button>
        </div>
      </div>

      {/* Past Hackathons Section */}
      <PastHackathons />
    </div>
  );
};

export default AboutHackathons;
