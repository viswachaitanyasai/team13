import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";

const ViewEvaluation = () => {
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

  const handleStatusUpdate = (id, newStatus) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id ? { ...submission, status: newStatus } : submission
      )
    );
  };

  const filteredSubmissions = submissions.filter(
    (submission) => submission.status === selectedTab
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6 text-white">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-4">
        <h2 className="text-4xl font-bold text-blue-400 text-center">
          {hackathon.name}
        </h2>
        <p className="text-gray-300 mt-2 text-center">
          {hackathon.description}
        </p>

        <Tabs.Root
          className="mt-2"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <Tabs.List className="flex justify-center space-x-6 border-b border-gray-700 pb-2 transition-all duration-300 ease-in-out">
            {["shortlisted", "revisit", "rejected"].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className={`px-3 py-2 rounded-full transition-all duration-300 ease-in-out text-sm font-semibold shadow-md ${
                  selectedTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {filteredSubmissions.length > 0 ? (
            <div className="mt-6 space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-gray-700 p-3 rounded-lg shadow-md flex flex-col"
                >
                  <p className="text-lg font-semibold text-blue-400">
                    {submission.name}
                  </p>
                  <p className="text-gray-300">Class: {submission.class}</p>
                  <p className="text-gray-300 font-semibold">
                    Total Score: {submission.score}
                  </p>
                  <div className="mt-2 flex justify-between items-center space-x-2">
                    <a
                      href={submission.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
                    >
                      View Submission
                    </a>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-md font-medium shadow-md transition">
                      View Analysis
                    </button>
                    <select
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md"
                      value={submission.status}
                      onChange={(e) =>
                        handleStatusUpdate(submission.id, e.target.value)
                      }
                    >
                      <option value="shortlisted">Shortlisted</option>
                      <option value="revisit">Revisit</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-400 text-center">
              No submissions found in this category.
            </p>
          )}
        </Tabs.Root>
      </div>
    </div>
  );
};

export default ViewEvaluation;
