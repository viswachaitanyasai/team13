import React, { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaChartLine,
    FaCheckCircle,
    FaEnvelope,
    FaExclamationCircle,
    FaExternalLinkAlt,
    FaLightbulb,
    FaMapMarkerAlt,
    FaSave,
    FaSchool,
    FaTimesCircle,
    FaTrophy, FaUser
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function SubmissionAnalysis() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Simulated loading effect
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setStatus(submissionData.currentStatus);
    }, 1500); // Simulating API call delay
  }, []);

  // Sample Data (Replace with API Data)
  const submissionData = {
    participant: {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      grade: "10th Grade",
      district: "District A",
      state: "State X",
    },
    submissionLink: "https://example.com/submission/123",
    totalScore: 8.5,
    reason:"The reason for overall score is this",
    avgScore: 7.2,
    evaluation: {
      creativity: { score: 8, reason: "Creative and original concept." },
      presentation: { score: 9, reason: "Clear and professional presentation." },
      technicalSkill: { score: 7, reason: "Strong coding, but lacked some optimizations." },
      impact: { score: 9, reason: "High impact on the target audience." },
    },
    strengths: ["Strong technical skills.", "Great presentation skills.", "Innovative approach."],
    improvements: ["Optimize code for better performance.", "Improve testing coverage."],
    overallSummary: "Alice demonstrated strong skills and creativity, but there's room for improvement in performance optimization.",
    currentStatus: "shortlisted",
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 p-4 md:p-8 text-white md:w-full w-screen">
      {/* Back Button */}
      <div className="w-full max-w-5xl">
        <button className="mb-6 text-blue-500 hover:text-blue-400 transition flex items-center" onClick={() => navigate(-1)}>
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {/* Skeleton Loader */}
      {loading ? (
        <div className="animate-pulse w-full max-w-5xl">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-700 rounded-lg"></div>
            <div className="h-32 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-32 bg-gray-700 rounded-lg w-full mt-6"></div>
        </div>
      ) : (
        <>
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
            {/* Total Score & Leaderboard */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full">
              <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
                <FaTrophy className="mr-2" /> Performance Overview
              </h2>
              <div className="space-y-2">
                <p className="text-xl font-bold text-green-400">Total Score: {submissionData.totalScore} / 10</p>
                <p className="text-xl font-bold text-yellow-400">Avg Score: {submissionData.avgScore} / 10</p>
               
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">Edit Submission Status</h2>
      <div className="flex flex-wrap gap-4">
        {["shortlisted", "revisit", "rejected"].map((option) => (
          <button
            key={option}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              status === option
                ? option === "shortlisted"
                  ? "bg-green-500 text-white"
                  : option === "revisit"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-gray-600 text-gray-300"
            }`}
            onClick={() => setStatus(option)}
          >
            {option === "shortlisted" ? <FaCheckCircle className="mr-2" /> 
            : option === "revisit" ? <FaExclamationCircle className="mr-2" /> 
            : <FaTimesCircle className="mr-2" />} 
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={()=>console.log("saved")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-full flex items-center gap-2 transition hover:bg-blue-600"
      >
        <FaSave /> Save Status
      </button>
    </div>
          </div>
          <div className="mt-6 w-full">
              <h3 className="text-lg font-medium text-gray-300">Overall Reason for Score</h3>
              <p className="bg-gray-700 p-4 rounded-lg text-gray-200">{submissionData.reason}</p>
            </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-5xl mt-6">
            <h2 className="md:text-2xl text-lg font-semibold text-blue-400 mb-4 flex items-center">
              <FaChartLine className="mr-2" /> Parameter-wise Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(submissionData.evaluation).map(([param, details]) => (
                <div key={param} className="bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-200 capitalize">{param.replace(/([A-Z])/g, " $1")}</h3>
                  <div className="mt-2 flex justify-between text-gray-300">
                    <p className={`text-lg font-semibold ${getScoreColor(details.score)}`}>Score: {details.score}</p>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{details.reason}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Strengths, Improvements & Summary */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-5xl mt-6">
            <h2 className="md:text-2xl text-xl font-semibold text-blue-400 mb-4 flex items-center">
              <FaLightbulb className="mr-3" /> Strengths, Improvements & Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300">Strengths</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {submissionData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" /> {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300">Areas for Improvement</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {submissionData.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center">
                      <FaExclamationCircle className="text-yellow-500 mr-2" /> {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-300">Overall Summary</h3>
              <p className="bg-gray-700 p-4 rounded-lg text-gray-200">{submissionData.overallSummary}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-5xl mt-3">
      <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
        <FaUser className="mr-2" /> Student Information
      </h2>
      <div className="space-y-3 text-gray-300">
        <p className="flex items-center">
          <FaUser className="mr-2 text-blue-400" /> 
          <span className="font-medium">Name:</span> {submissionData.participant.name}
        </p>
        <p className="flex items-center">
          <FaEnvelope className="mr-2 text-yellow-400" /> 
          <span className="font-medium">Email:</span> {submissionData.participant.email}
        </p>
        <p className="flex items-center">
          <FaSchool className="mr-2 text-green-400" /> 
          <span className="font-medium">Grade:</span> {submissionData.participant.grade}
        </p>
        <p className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-red-400" /> 
          <span className="font-medium">District:</span> {submissionData.participant.district}
        </p>
        <p className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-purple-400" /> 
          <span className="font-medium">State:</span> {submissionData.participant.state}
        </p>
      </div>
    </div>
    <div className="bg-gray-800 mt-4 p-6 rounded-xl shadow-xl w-full flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-300">Submission</h2>
      <a
        href={submissionData.submissionLink}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full flex items-center gap-2 transition hover:bg-blue-600"
      >
        <FaExternalLinkAlt /> View Submission
      </a>
    </div>
        </>
      )}
    </div>
  );
}

export default SubmissionAnalysis;
