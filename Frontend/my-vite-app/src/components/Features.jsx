import React from "react";
import { FaRobot, FaSlidersH, FaShieldAlt, FaChartBar } from "react-icons/fa";

const features = [
  {
    icon: <FaRobot className="text-cyan-400 text-4xl" />,
    title: "Automated Solution Evaluation",
    description:
      "AI-powered scoring system providing instant feedback to streamline assessments.",
  },
  {
    icon: <FaSlidersH className="text-purple-400 text-4xl" />,
    title: "Customizable Judging Criteria",
    description:
      "Define scoring parameters for each hackathon, ensuring fair and flexible evaluation.",
  },
  {
    icon: <FaShieldAlt className="text-red-400 text-4xl" />,
    title: "Secure Participation Controls",
    description:
      "Use invite codes, grade restrictions, and private passkeys to manage participant access.",
  },
  {
    icon: <FaChartBar className="text-green-400 text-4xl" />,
    title: "Real-Time Performance Insights",
    description:
      "Monitor registrations, submission trends, and leaderboard rankings with ease.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-black py-20 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6 text-cyan-400 border-[1px] border-black">
          Unlock the Power of Smart Learning
        </h2>
        <p className="text-gray-300 font-semibold max-w-2xl mx-auto mb-12">
          A modern platform designed for educators and students to enhance
          learning through technology.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-700 backdrop-blur-lg hover:shadow-cyan-400/20 transition-all"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <p className="text-white text-md mt-24 border-t border-white pt-8 w-[80%]"></p>
      </div>
    </section>
  );
}

export default FeaturesSection;
