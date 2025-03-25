import React, { useState, useEffect } from "react";
import { Trophy, Lightbulb, Users } from "lucide-react";
// import UpcomingHackathons from './UpcomingHackathons';
// import PastHackathons from "./PastHackathons";
// import OngoingHackathons from "./OngoingHackathons";
import HackathonCard from "./HackathonCard";
import { getHackathons } from "../apis/hackathonapi";


const AboutHackathons = () => { 
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const teacherId = localStorage.getItem("teacherId"); // ✅ Assuming teacher ID is stored in localStorage

      if (!token || !teacherId) {
        toast.error("Unauthorized access. Please log in.");
        return;
      }

      const allHackathons = await getHackathons(token); // ✅ Fetch all hackathons
      const teacherHackathons = allHackathons.filter(
        (hackathon) => hackathon.teacher_id === teacherId
      ); // ✅ Filter hackathons by teacher ID

      setHackathons(teacherHackathons);
    } catch (error) {
      console.error("Error fetching hackathons:", error);
      toast.error(error.error || "Failed to fetch hackathons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen p-8 text-gray-900">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-orange-500 mb-4 tracking-wide">
            Hackathon Central
          </h1>
          <p className="text-black text-lg leading-relaxed max-w-3xl mx-auto">
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
              title: "Create",
              description:
                "Set up a new hackathon by defining rules, timelines, and evaluation criteria. Customize the event to suit your needs",
              icon: <Trophy className="h-12 w-12 text-indigo-500" />,
              bgColor: "bg-indigo-100 border-indigo-300",
            },
            {
              title: "Manage",
              description:
                "Monitor participant submissions, track deadlines, and ensure compliance with the hackathon guidelines.",
              icon: <Lightbulb className="h-12 w-12 text-blue-500" />,
              bgColor: "bg-blue-100 border-blue-300",
            },
            {
              title: "Evaluate",
              description:
                "Use AI to analyze projects, provide insights, and generate fair rankings based on predefined criteria.",
              icon: <Users className="h-12 w-12 text-gray-700" />,
              bgColor: "bg-gray-100 border-gray-300",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-xl border p-8 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-900/50`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        
        {/* <div className="flex justify-center flex-wrap gap-6 mb-16">
          {[
            { label: "Past Hackathons", value: "past" },
            { label: "Ongoing Hackathons", value: "ongoing" },
            { label: "Upcoming Hackathons", value: "upcoming" },
          ].map((button, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(button.value)}
              className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-lg shadow-lg ${
                button.value === activeSection
                  ? "bg-indigo-700 text-white"
                  : index === 3
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

     Display Selected Section
     <div className="mt-6">
        {activeSection === "past" && <PastHackathons />}
        {activeSection === "ongoing" && <OngoingHackathons />}
        {ButtonsactiveSection === "upcoming" && <UpcomingHackathons />}
      </div>
    </div>  */}
    <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Your Hackathons</h2>

        {loading ? (
          // ✅ Skeleton Loader for Loading State
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-5 bg-gray-200 rounded-md animate-pulse">
                <div className="h-6 bg-gray-300 w-3/4 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 w-1/2 rounded mb-3"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : hackathons.length > 0 ? (
          <div className="grid gap-6 text-left">
            {hackathons.map((hackathon) => (
              <HackathonCard
                key={hackathon._id}
                event={hackathon}
                refreshHackathons={fetchHackathons} // ✅ Pass refresh function
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have not created any hackathons yet.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default AboutHackathons;
