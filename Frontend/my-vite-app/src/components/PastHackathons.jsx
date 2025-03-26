import React, { useState, useEffect } from 'react';
import { Calendar, Code, Shield } from 'lucide-react';
import HackathonCard from './HackathonCard';
import { getHackathons } from "../apis/hackathonapi";
import { toast } from "react-toastify";

const SkeletonCard = () => (
  <div className="bg-gray-200 rounded-xl border border-gray-200 p-5 shadow-md animate-pulse">
    <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-400 rounded w-1/2 mb-4"></div>
    <div className="h-20 bg-gray-300 rounded mb-4"></div>
    <div className="h-6 bg-gray-400 rounded w-1/3"></div>
  </div>
);
const PastHackathons = () => {
  const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchHackathons = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          return;
        }
        try {
          const allHackathons = await getHackathons(token);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const pastHackathons = allHackathons.filter((hackathon) => {
            const endDate = new Date(hackathon.end_date);
            endDate.setHours(0, 0, 0, 0);
  
            return endDate < today;
          });
  
          setHackathons(pastHackathons);
        } catch (error) {
          toast.error(error.error || "Failed to fetch hackathons.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchHackathons();
    }, []);

    return (
      <div className="bg-white min-h-screen p-8 text-white">
      <div className="max-w-4xl mx-auto mt-2 p-4 ">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">Past Hackathons</h2>
        {loading ? (
        <div className="grid gap-6">
          {/* Render 3 Skeleton Cards while loading */}
          {[1, 2, 3].map((index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon._id}
             event={hackathon}
             showDeleteButton={false}
             showEditButton={false} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No ongoing hackathons found.</p>
      )}
    </div>
    </div>
  );
};

export default PastHackathons;