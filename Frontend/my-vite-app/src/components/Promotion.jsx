import React from "react";

const Promotion = () => {
  return (
    <div className="flex flex-col md:flex-row p-8 max-w-6xl mx-auto gap-12">
      {/* Left Column */}
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
          Start learning with <span class="text-blue-400">CodeMitra</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-6">
          Get unlimited access to structured courses &amp; doubt clearing sessions &amp; Win Hackathons
        </p>
        <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300">
          Start learning
        </button>
      </div>

      {/* Right Column*/}
      <div className="grid grid-cols-2 gap-6 md:w-2/3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-600 mb-2">Exam categories</div>
            <div className="text-5xl font-bold text-slate-700">60<span className="text-emerald-500">+</span></div>
          </div>
          <div className="bg-amber-200 rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <div className="bg-amber-400 w-8 h-8 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-600 mb-2">Daily live classes</div>
            <div className="text-5xl font-bold text-slate-700">1.5k<span className="text-emerald-500">+</span></div>
          </div>
          <div className="bg-red-100 rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <div className="bg-red-200 w-16 h-10 rounded-md"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-600 mb-2">Video lessons</div>
            <div className="text-5xl font-bold text-slate-700">1M<span className="text-emerald-500">+</span></div>
          </div>
          <div className="bg-amber-100 rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <div className="bg-amber-200 w-16 h-10 rounded-md"></div>
          </div>
        </div>
        
  
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-600 mb-2">Educators</div>
            <div className="text-5xl font-bold text-slate-700">14k<span className="text-emerald-500">+</span></div>
          </div>
          <div className="bg-blue-100 rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <div className="bg-blue-500 w-12 h-12 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-600 mb-2">Problem Solved</div>
            <div className="text-5xl font-bold text-slate-700">30K<span className="text-emerald-500">+</span></div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <img src="../src/assets/problem.png"></img>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-600 mb-2">Total Hackathons Organised</div>
            <div className="text-5xl font-bold text-slate-700">1k<span className="text-emerald-500">+</span></div>
          </div>
          <div className="bg-purple-100 rounded-lg p-4 w-24 h-24 flex items-center justify-center">
            <img src="../src/assets/Hackathon.png"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;