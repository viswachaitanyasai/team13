import React, { useState, useEffect } from 'react';
import { Calendar, Code, Shield } from 'lucide-react';
import HackathonCard from './HackathonCard';
import { getHackathons } from "../apis/hackathonapi";
import { toast } from "react-toastify";

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
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Past Hackathons</h2>
        {loading ? (
          <p className="text-gray-600">Loading hackathons...</p>
        ) : hackathons.length > 0 ? (
          <div className="grid gap-6">
            {hackathons.map((hackathon) => (
              <HackathonCard key={hackathon._id} event={hackathon} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No past hackathons found.</p>
        )}
      </div>
    );
};

export default PastHackathons;