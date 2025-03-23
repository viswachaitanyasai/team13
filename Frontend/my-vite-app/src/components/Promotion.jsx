import React from "react";

const Promotion = () => {
  return (
    <div className="flex flex-col md:flex-row p-12 max-w-7xl mx-auto gap-12 items-center">
      {/* Left Column */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-snug mb-6">
          Start learning with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            CodeMitra
          </span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          Unlock unlimited access to structured courses, doubt-clearing
          sessions, and win hackathons!
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition duration-300">
          Start Learning 🚀
        </button>
      </div>

      {/* Right Column - Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
        {[
          { label: "Exam Categories", value: "60+", color: "blue", icon: "📚" },
          { label: "Live Classes", value: "1.5k+", color: "green", icon: "🎥" },
          { label: "Video Lessons", value: "1M+", color: "yellow", icon: "🎓" },
          { label: "Educators", value: "14k+", color: "purple", icon: "👨‍🏫" },
          { label: "Hackathons Hosted", value: "1k+", color: "red", icon: "🏆" },
        ].map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-white/20 backdrop-blur-lg shadow-lg rounded-xl border border-white/30 transition-transform duration-300 hover:scale-105"
          >
            <div className="text-5xl">{stat.icon}</div>
            <div className="text-4xl font-bold text-gray-900 mt-3">
              {stat.value}
              {/* <span className="text-emerald-500">+</span> */}
            </div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotion;
