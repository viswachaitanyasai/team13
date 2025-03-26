import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEvaluations } from "../apis/hackathonapi";
import { FiArrowLeft, FiAward, FiCheckCircle, FiRefreshCw, FiXCircle, FiArrowRight } from "react-icons/fi";
import { getHackathonById } from "../apis/hackathonapi";

const Leaderboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hackathonId } = useParams();
    
    const [hackathonData, setHackathonData] = useState(location.state || {});
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hackathonStats, setHackathonStats] = useState({
      totalParticipants: 0,
      totalSubmissions: 0,
      averageScore: 0,
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("authToken");
          
          if (!hackathonData.title) {
            const hackathonResponse = await getHackathonById(hackathonId, token);
            setHackathonData(hackathonResponse);
          }
  
          const evaluationsResponse = await getEvaluations(hackathonId, token);
          const data = await evaluationsResponse;
  
          setHackathonStats({
            totalParticipants: data.totalParticipants,
            totalSubmissions: data.totalSubmissions,
            averageScore: data.averageScore,
          });
  
          const sortedSubmissions = data.evaluations
            .map((evalItem, index) => ({
              id: index + 1,
              name: evalItem.studentName,
              class: evalItem.grade,
              link: evalItem.submission_url,
              status: evalItem.evaluation_category,
              score: evalItem.overall_score,
              evalId: evalItem.evaluation_id
            }))
            .sort((a, b) => b.score - a.score)
            .map((submission, index) => ({
              ...submission,
              rank: index + 1
            }));
  
          setSubmissions(sortedSubmissions);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  
      fetchData();
    }, [hackathonId, hackathonData.title]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "shortlisted":
        return <FiCheckCircle className="text-green-500" />;
      case "revisit":
        return <FiRefreshCw className="text-yellow-500" />;
      case "rejected":
        return <FiXCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-indigo-100 transition"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
                <FiAward className="h-8 w-8" />
                {hackathonData.title} Leaderboard
              </h1>
              <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm md:text-base">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{hackathonStats.totalParticipants}</span> Participants
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">{hackathonStats.totalSubmissions}</span> Submissions
                </span>
                <span className="flex items-center gap-1">
                  Avg Score: <span className="font-medium">{hackathonStats.averageScore.toFixed(2)}</span>
                </span>
              </div>
            </div>
            
            <div className="w-10"></div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="p-4 md:p-6">
          {submissions.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Analysis
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          submission.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          submission.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          submission.rank === 3 ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          <span className="font-medium">{submission.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{submission.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          submission.score >= 8 ? 'bg-green-100 text-green-800' :
                          submission.score >= 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {submission.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(submission.status)}
                          <span className={`text-sm capitalize ${
                            submission.status === "shortlisted" ? 'text-green-600' :
                            submission.status === "revisit" ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {submission.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/analysis/${submission.evalId}`)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="View detailed analysis"
                        >
                          <FiArrowRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No submissions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no submissions for this hackathon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;