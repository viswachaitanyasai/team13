import * as Tabs from "@radix-ui/react-tabs";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEvaluations } from "../apis/hackathonapi";

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
        // setLoading(true);
        const token= localStorage.getItem("authToken");
        const response = await getEvaluations(hackathonId, token);
        console.log(response);
        // if (!response.ok) throw new Error("Failed to fetch evaluations");
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
          link: "#",
          status: evalItem.evaluation_category,
          score: evalItem.overall_score,
          evalId:evalItem.evaluation_id
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

  const handleStatusUpdate = (id, newStatus) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id ? { ...submission, status: newStatus } : submission
      )
    );
  };

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

  if (loading) return     <div className="min-h-screen flex justify-center bg-gray-900 p-2 text-white md:w-full w-screen">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg md:p-8 p-3">
          <div className="flex justify-center mt-4 space-x-4 animate-pulse">
            <div className="h-5 w-20 bg-gray-600 rounded"></div>
            <div className="h-5 w-20 bg-gray-600 rounded"></div>
            <div className="h-5 w-20 bg-gray-600 rounded"></div>
          </div>
      </div>
      </div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex justify-center bg-gray-900 p-2 text-white md:w-full w-screen">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg md:p-8 p-3">
        <button
          className="text-blue-600 mb-6 ml-2 self-start hover:text-indigo-300 transition"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
        <h1 className="text-3xl text-center font-bold text-gray-100 mb-4">{data.title}</h1>
        <p className="text-gray-400 text-center mt-2">
          {hackathonStats.totalParticipants} Participants |{" "}
          {hackathonStats.totalSubmissions} Submissions | Avg Score:{" "}
          {hackathonStats.averageScore.toFixed(2)}
        </p>

        <Tabs.Root
          className="mt-6"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <Tabs.List className="flex justify-center md:space-x-6 space-x-2 border-b border-gray-700 pb-4">
            {["shortlisted", "revisit", "rejected"].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {`${tab.charAt(0).toUpperCase() + tab.slice(1)} (${tabCounts[tab]})`}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="mt-6 w-50 p-2 text-center rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

        {filteredSubmissions.length > 0 ? (
          <div className="overflow-x-auto md:overflow-hidden max-w-full mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">
                    Name
                  </th>
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">
                    Class
                  </th>
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">
                    Score
                  </th>
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition duration-200"
                  >
                    <td className="p-2.5 px-4">{submission.name}</td>
                    <td className="p-2.5 px-4">{submission.class}</td>
                    <td className="p-2.5 px-4">{submission.score}</td>
                    <td className="p-2.5 px-4 flex space-x-4">
                      <a
                        href={submission.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 flex-auto text-decoration-none text-center bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition"
                      >
                        View
                      </a>
                      <button onClick={()=>{navigate(`/analysis/${submission.evalId}`)}} className="px-4 py-2 flex-auto bg-green-600 hover:bg-green-700 rounded-full font-medium shadow-md transition">
                        Analysis
                      </button>
                      <select
                        className="pl-2 pr-1 py-2 flex-auto bg-gray-600 text-white rounded-lg shadow-md transition"
                        value={submission.status}
                        onChange={(e) =>
                          handleStatusUpdate(submission.id, e.target.value)
                        }
                      >
                        <option value="shortlisted">Shortlisted</option>
                        <option value="revisit">Revisit</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 text-gray-400 text-center">No submissions found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewEvaluation;