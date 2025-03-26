import * as Tabs from "@radix-ui/react-tabs";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEvaluations } from "../apis/hackathonapi";
import { FiArrowLeft, FiExternalLink, FiBarChart2, FiSearch } from "react-icons/fi";

const ViewEvaluation = () => {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();
  const { hackathonId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("shortlisted");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hackathonStats, setHackathonStats] = useState({
    totalParticipants: 0,
    totalSubmissions: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await getEvaluations(hackathonId, token);
        const data = await response;

        setHackathonStats({
          totalParticipants: data.totalParticipants,
          totalSubmissions: data.totalSubmissions,
          averageScore: data.averageScore,
        });

        const formattedSubmissions = data.evaluations.map((evalItem, index) => ({
          id: index + 1,
          name: evalItem.studentName,
          class: evalItem.grade,
          link: evalItem.submission_url,
          status: evalItem.evaluation_category,
          score: evalItem.overall_score,
          evalId: evalItem.evaluation_id
        }));

        setSubmissions(formattedSubmissions);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [hackathonId]);

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.status === selectedTab &&
      submission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabCounts = {
    shortlisted: submissions.filter((s) => s.status === "shortlisted").length,
    revisit: submissions.filter((s) => s.status === "revisit").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-full"></div>
            ))}
          </div>
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
              <h1 className="text-2xl md:text-3xl font-bold">{data.title}</h1>
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
            
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List className="flex border-b border-gray-200">
            {["shortlisted", "revisit", "rejected"].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm md:text-base transition-colors ${
                  selectedTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {`${tab.charAt(0).toUpperCase() + tab.slice(1)} (${tabCounts[tab]})`}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* Search Bar */}
        <div className="p-4 md:p-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search participants..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Submissions Table */}
        <div className="px-4 pb-6">
          {filteredSubmissions.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{submission.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.score >= 8 ? 'bg-green-100 text-green-800' :
                          submission.score >= 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {submission.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <a
                            href={submission.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm bg-white text-gray-700 hover:bg-gray-50"
                          >
                            <FiExternalLink className="mr-1" /> View
                          </a>
                          <button
                            onClick={() => navigate(`/analysis/${submission.evalId}`)}
                            className="flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            <FiBarChart2 className="mr-1" /> Analysis
                          </button>
                        </div>
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
                {searchTerm ? 'Try a different search term' : 'There are currently no submissions in this category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEvaluation;