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
const publishResult=async()=>{

  await publishResults(hackathonId,token);
  window.location.reload();
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <button
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4 md:mb-0"
            onClick={() => navigate(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          <div className="text-center md:text-right">
            <h2 className="text-3xl font-bold text-gray-800">{hackathonData?.title}</h2>
            <p className="text-gray-600 mt-1">{hackathonData?.description}</p>
          </div>
        </div>
  
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {loading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
                <p className="text-gray-500 font-medium">Registrations</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {hackathonData?.number_of_participants || '0'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-gray-500 font-medium">Submissions</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {hackathonData?.number_of_submissions || '0'}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p className="text-gray-500 font-medium">Status</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {hackathonData?.is_result_published ? 'Results Out' : 'In Progress'}
                </p>
              </div>
            </>
          )}
        </div>
  
        {/* Analysis Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              Overall Analysis
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {hackathonData?.summary_analysis || "Not generated yet"}
              </p>
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Skill Gaps
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                {hackathonData?.skill_gap_analysis || "No submissions yet"}
              </p>
            </div>
          </div>
        </div>
  
        {/* Judging Parameters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Judging Parameters
          </h3>
          <div className="flex flex-wrap gap-2">
            {hackathonData?.judging_parameters?.length > 0 ? (
              hackathonData.judging_parameters.map((param, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {param}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No judging parameters specified.</p>
            )}
          </div>
        </div>
  
        {/* Submission Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Submission Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {loading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
                  </div>
                ))
              ) : (
                data.map((item, index) => (
                  <div key={index} className="text-center">
                    <p className="text-gray-500 font-medium">{item.name}</p>
                    <p 
                      className="text-2xl font-bold mt-1"
                      style={{ color: item.color }}
                    >
                      {item.count ?? "N/A"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
  
          {/* Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Submission Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#4B5563" />
                  <YAxis stroke="#4B5563" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button
            onClick={() => navigate(`/leaderboard/${hackathonId}`, {state: hackathonData})}
            className="flex items-center justify-center px-6 py-3 bg-yellow-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            View Leaderboard
          </button>
          <button
            onClick={() => navigate(`/submissions/${hackathonId}`, {state: hackathonData})}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            View Evaluations
          </button>
  
          <button
            onClick={hackathonData?.is_result_published ? null : publishResult}
            disabled={hackathonData?.is_result_published || loading}
            className={`flex items-center justify-center px-6 py-3 font-medium rounded-lg shadow-sm transition-colors ${
              hackathonData?.is_result_published 
                ? "bg-green-100 text-green-800 cursor-default"
                : loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : hackathonData?.is_result_published ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Results Published
              </>
            ) : (
              "Publish Results"
            )}
          </button>
        </div>
      </div>
    </div>
  
  );
};

export default ViewSubmission;
