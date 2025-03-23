import React from "react";
import { Trophy, Lightbulb, Users } from "lucide-react";
import PastHackathons from "./PastHackathons";

const AboutHackathons = () => {
  return (
    <div className="bg-black min-h-screen p-8 text-white">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-orange-500 mb-4 tracking-wide">
            Hackathon Central
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
            Explore hackathons where innovation meets collaboration. From{" "}
            <span className="text-indigo-400 font-semibold">AI</span>,
            <span className="text-red-400 font-semibold"> Cybersecurity</span>,
            to
            <span className="text-green-400 font-semibold"> Blockchain</span>,
            challenge yourself and grow!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              title: "Compete",
              description:
                "Showcase your skills against top minds in the industry.",
              icon: <Trophy className="h-12 w-12 text-yellow-400" />,
              bgColor: "bg-gray-900/70 border-gray-700",
            },
            {
              title: "Learn",
              description:
                "Gain experience through hands-on projects and mentorship.",
              icon: <Lightbulb className="h-12 w-12 text-indigo-400" />,
              bgColor: "bg-gray-900/70 border-gray-700",
            },
            {
              title: "Network",
              description:
                "Meet fellow tech enthusiasts, mentors, and employers.",
              icon: <Users className="h-12 w-12 text-green-400" />,
              bgColor: "bg-gray-900/70 border-gray-700",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-xl border p-8 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-900/50`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center flex-wrap gap-6 mb-16">
          {[
            "Past Hackathons",
            "Ongoing Hackathons",
            "Upcoming Hackathons",
            "Host an Event",
          ].map((label, index) => (
            <button
              key={index}
              className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-lg shadow-lg ${
                index === 3
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Past Hackathons Section */}
      <PastHackathons />
    </div>
  );
};

export default AboutHackathons;
