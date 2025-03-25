import * as Tabs from "@radix-ui/react-tabs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewEvaluation = () => {
  const navigate = useNavigate();
  const hackathon = {
    name: "AI Challenge 2025",
    description:
      "A cutting-edge AI competition for developers and researchers.",
  };

  const dummySubmissions = [
    {
      id: 1,
      name: "Alice Johnson",
      class: "10th Grade",
      link: "#",
      status: "shortlisted",
      score: 85,
    },
    {
      id: 2,
      name: "Bob Smith",
      class: "12th Grade",
      link: "#",
      status: "revisit",
      score: 78,
    },
    {
      id: 3,
      name: "Charlie Brown",
      class: "11th Grade",
      link: "#",
      status: "rejected",
      score: 65,
    },
    {
      id: 4,
      name: "David White",
      class: "10th Grade",
      link: "#",
      status: "shortlisted",
      score: 90,
    },
    {
      id: 5,
      name: "Ella Green",
      class: "9th Grade",
      link: "#",
      status: "revisit",
      score: 72,
    },
  ];

  const [submissions, setSubmissions] = useState(dummySubmissions);
  const [selectedTab, setSelectedTab] = useState("shortlisted");
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="min-h-screen flex justify-center bg-gray-900 p-2 text-white md:w-full w-screen">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg md:p-8 p-3">
        <button
          className="text-blue-600 mb-6 ml-2 self-start hover:text-indigo-300 transition"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
        <h2 className="text-3xl font-bold text-blue-400 text-center">
          {hackathon.name}
        </h2>
        

        <Tabs.Root
          className="mt-6"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <Tabs.List className="flex justify-center md:space-x-6 space-x-2 border-b border-gray-700 pb-4">
            {[`shortlisted (count)`, "revisit (count)", "rejected (count) "].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        <input
          type="text"
          placeholder="Search by name..."
          className="mt-6 w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredSubmissions.length > 0 ? (
          <div className="overflow-x-auto md:overflow-hidden max-w-full mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">Name</th>
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">Class</th>
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">Score</th>
                  <th className="p-2.5 px-4 text-left border-b border-gray-600">Actions</th>
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
                      <button className="px-4 py-2 flex-auto bg-green-600 hover:bg-green-700 rounded-full font-medium shadow-md transition">
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
