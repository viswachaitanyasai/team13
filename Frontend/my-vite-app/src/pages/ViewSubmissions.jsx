import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { getHackathonSummary } from "../apis/hackathonapi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "react-toastify";
import { publishResults } from "../apis/hackathonapi";
// const SkeletonLoader = () => (
//   <div className="animate-pulse flex flex-col gap-4">
//     <div className="h-8 w-2/3 bg-gray-700 rounded"></div>
//     <div className="h-6 w-1/2 bg-gray-700 rounded"></div>
//     <div className="h-40 bg-gray-700 rounded"></div>
//   </div>
// );

const ViewSubmission = () => {
  const { hackathonId } = useParams();
  const [hackathonData, setHackathonData] = useState();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
const publishResult=()=>{
  window.location.reload();
  publishResults(hackathonId,token);
  
}
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await getHackathonSummary(hackathonId, token);
        setHackathonData(response);
        console.log(response)
      } catch (error) {
        console.error(error);
        toast.error(error.error || "Failed to fetch submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [hackathonId, token]);
  const data = [
    { name: "Shortlisted", count: hackathonData?.number_of_shortlisted_students ? hackathonData.number_of_shortlisted_students : "0", color: "#22C55E" },
    { name: "Revisit", count: hackathonData?.number_of_revisit_students ? hackathonData.number_of_revisit_students : "0", color: "#FACC15" },
    { name: "Rejected", count: hackathonData?.number_of_rejected_students ? hackathonData.number_of_rejected_students : "0", color: "#EF4444" },
  ];


  return (
    <div className="min-h-screen flex justify-center bg-gray-900 p-6 text-white w-full">
      {/* {!hackathonData ? (
      <div className="animate-pulse">
        Skeleton for Title
        <div className="h-6 w-48 bg-gray-700 rounded-md mb-4"></div>

        Skeleton for Shortlisted, Rejected, Revisit Stats
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-gray-700 rounded-md"></div>
          <div className="h-16 bg-gray-700 rounded-md"></div>
          <div className="h-16 bg-gray-700 rounded-md"></div>
        </div>
      </div>
    ) : ( */}
      <div className="w-full h-full bg-gray-800 rounded-xl shadow-lg p-6">
        <button
          className="text-blue-600 mb-6 ml-2 self-start hover:text-indigo-300 transition"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
        <h2 className="text-2xl font-bold text-orange-400">{hackathonData?.title}</h2>
        {/* <p className="text-gray-300 mt-2">{hackathonData.description}</p> */}

        {/* Key Stats */}
        {loading ? (
          // ✅ Skeleton Loader
          <div className="mt-6 grid grid-cols-3 md:gap-4 gap-2 text-center animate-pulse">
            {["Registrations", "Submissions", "Overall Summary"].map((label, index) => (
              <div key={index} className="bg-gray-700 md:p-4 p-2 rounded-lg">
                <p className="text-gray-300 text-xl py-1">{label}</p>
                <p className="bg-gray-600 w-12 h-4 rounded-lg mx-auto"></p> {/* Placeholder */}
              </div>
            ))}
          </div>
        ) : (
          // ✅ Actual Data
          <div className="mt-6 grid grid-cols-2 md:gap-4 gap-2 text-center">
            {[
              {
                label: "Registrations",
                value: hackathonData?.number_of_participants ?? <p className="bg-gray-600 w-12 h-4 rounded-lg mx-auto"></p>,
                color: "text-indigo-400",
              },
              {
                label: "Submissions",
                value: hackathonData?.number_of_submissions ?? <p className="bg-gray-600 w-12 h-4 rounded-lg mx-auto"></p>,
                color: "text-green-400",
              }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-700 md:p-4 p-2 rounded-lg">
                <p className="text-gray-300 text-xl py-1">{stat.label}</p>
                <p className={`text-md ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="bg-gray-700 md:p-4 p-2 mt-3 rounded-lg">
          <p className="text-gray-300 text-xl mx-2 font-bold py-1">Overall analysis of Participants</p>
          <p className="text-gray-300 mx-2 mt-2 text-sm md:text-base leading-relaxed">
            {hackathonData?.summary_analysis || "Not Generated yet"}
          </p>
        </div>
        <div className="bg-gray-700 md:p-4 p-2 my-3 rounded-lg">
          <p className="text-gray-300 text-xl mx-2 font-bold py-1">Judgement Parameters</p>

          <ul className="mt-2 p-0 text-gray-200 flex flex-wrap">
            {hackathonData?.judging_parameters.length > 0 ? (
              hackathonData?.judging_parameters.map((param, index) => (
                <li key={index} className="flex items-center gap-2 mx-2">
                  <span className="bg-indigo-500 text-white px-3 py-2.5 rounded-lg text-sm font-semibold">
                    {param} {/* ✅ Dynamically Display Judging Parameter Name */}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 mx-2">No judging parameters specified.</p> // ✅ Handles case when empty
            )}
          </ul>
        </div>


        <div className="bg-gray-700 md:p-4 p-2 mt-3 rounded-lg">
          <p className="text-gray-300 text-xl mx-2 font-bold py-1">Skill gaps in participants</p>
          <p className="text-gray-300 mx-2 mt-2 text-sm md:text-base leading-relaxed">
            {hackathonData?.skill_gap_analysis || "No submissions yet"}
          </p>
        </div>
        <div className="flex display-inline grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
          {hackathonData ? (
            <div className="mt-6 grid grid-cols-3 md:gap-4 gap-2 text-center">
              {data.map((item, index) => (
                <div key={index} className="bg-gray-700 md:p-4 p-2 rounded-lg">
                  {/* ✅ Dynamically set text color */}
                  <p className="text-xl py-1" style={{ color: item.color }}>
                    {item.name}
                  </p>
                  {/* ✅ Show actual data, fallback to 'N/A' if undefined */}
                  <p className="text-md">{item.count ?? "N/A"}</p>
                </div>
              ))}
            </div>
          ) : (
            // ✅ Show skeleton loader while data is being fetched
            <div className="mt-6 grid grid-cols-3 md:gap-4 gap-2 text-center animate-pulse">
              {["Shortlisted", "Revisit", "Rejected"].map((name, index) => (
                <div key={index} className="bg-gray-700 md:p-4 p-2 rounded-lg">
                  <p className="text-gray-500 text-xl py-1">{name}</p>
                  <p className="text-md bg-gray-600 w-12 h-4 rounded-lg mx-auto"></p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 md:gap-4 gap-2 text-center">
            <button
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
              onClick={hackathonData?.is_result_published ? null : publishResult}
              disabled={hackathonData?.is_result_published || loading}
            >
              {loading?"Please Wait":(hackathonData?.is_result_published)?"Results Out":"Publish Results"}
            </button>

            <button
              onClick={() => navigate(`/submissions/${hackathonId}`, {state: hackathonData})}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              View Evaluations
            </button>

          </div>
        </div>
        {/* Beautiful Chart */}
        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Submission Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#CBD5E1" />
              <YAxis stroke="#CBD5E1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1E293B",
                  borderRadius: "8px",
                  border: "none",
                  color: "#fff",
                }}
                cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
              />
              <Legend wrapperStyle={{ color: "#CBD5E1" }} />
              <Bar
                dataKey="count"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

  );
};

export default ViewSubmission;
