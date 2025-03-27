import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnalysis, handleCategoryChange } from "../apis/hackathonapi";
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
  FaTrophy,
  FaUser,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaChartBar
} from "react-icons/fa";
import { Bar, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const SubmissionAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const { evaluation_id } = useParams();
  const token = localStorage.getItem("authToken");
  const [expandedParameter, setExpandedParameter] = useState(null);
  const [chartView, setChartView] = useState("radar"); // 'radar' or 'bar'

  const [submissionData, setSubmissionData] = useState({
    submission_id: "",
    participant: {
      name: "",
      email: "",
      grade: "",
      district: "",
      state: "",
    },
    submissionLink: "",
    totalScore: "",
    reason: "",
    evaluation: [],
    strengths: [],
    improvements: [],
    overallSummary: "",
    currentStatus: "",
  });

  const [metrics, setMetrics] = useState({
    averageParameterScore: 0,
    strongestParameter: "",
    strongestParameterScore: 0,
    weakestParameter: "",
    weakestParameterScore: 0,
    aboveAverageParameters: 0,
  });

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await getAnalysis(evaluation_id, token);
        const evaluationData = res?.evaluation;
        
        setSubmissionData({
          submission_id: evaluationData?.submission_id || '',
          participant: {
            name: res?.student?.name || "",
            email: res?.student?.email || "",
            grade: res?.student?.grade || "",
            district: res?.student?.district || "",
            state: res?.student?.state || "",
          },
          submissionLink: res?.submissionUrl || "",
          totalScore: evaluationData?.overall_score || 0,
          reason: evaluationData?.overall_reason || "",
          evaluation: evaluationData?.parameter_feedback || [],
          strengths: evaluationData?.strengths || [],
          improvements: evaluationData?.improvement || [],
          overallSummary: evaluationData?.summary || "",
          currentStatus: evaluationData?.evaluation_category || "",
        });
        
        if (evaluationData?.parameter_feedback?.length > 0) {
          const scores = evaluationData.parameter_feedback.map(p => p.score);
          const average = scores.reduce((a, b) => a + b, 0) / scores.length;
          const maxScore = Math.max(...scores);
          const minScore = Math.min(...scores);
          const strongestParam = evaluationData.parameter_feedback.find(p => p.score === maxScore);
          const weakestParam = evaluationData.parameter_feedback.find(p => p.score === minScore);
          const aboveAvg = scores.filter(s => s > average).length;
          
          setMetrics({
            averageParameterScore: average.toFixed(1),
            strongestParameter: strongestParam?.name || "",
            strongestParameterScore: strongestParam?.score || 0,
            weakestParameter: weakestParam?.name || "",
            weakestParameterScore: weakestParam?.score || 0,
            aboveAverageParameters: aboveAvg,
          });
        }
        
        setStatus(evaluationData?.evaluation_category || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [evaluation_id, token]);

  const handleSave = async () => {
    await handleCategoryChange(submissionData.submission_id, token, status);
    window.location.reload();
  };

  // Enhanced Radar Chart Configuration
  const radarChartData = {
    labels: submissionData.evaluation.map(param => param.name),
    datasets: [
      {
        label: 'Parameter Scores',
        data: submissionData.evaluation.map(param => param.score),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: submissionData.evaluation.map(param => 
          param.score >= 2 ? '#10B981' : 
          param.score >= 1 ? '#F59E0B' : '#EF4444'
        ),
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(200, 200, 200, 0.3)'
        },
        suggestedMin: 0,
        suggestedMax: 2,
        ticks: {
          stepSize: 0.5,
          backdropColor: 'rgba(0, 0, 0, 0)'
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)'
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#4B5563'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const param = submissionData.evaluation.find(p => p.name === context.label);
            return [
              `Score: ${context.raw}/2`,
              `Feedback: ${param?.reason || 'No feedback available'}`
            ];
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.1
      }
    }
  };

  // Bar Chart Configuration
  const barChartData = {
    labels: submissionData.evaluation.map(param => param.name),
    datasets: [
      {
        label: 'Parameter Scores',
        data: submissionData.evaluation.map(param => param.score),
        backgroundColor: submissionData.evaluation.map(param => 
          param.score >= 2 ? '#10B981' : 
          param.score >= 1 ? '#F59E0B' : '#EF4444'
        ),
        borderColor: '#1F2937',
        borderWidth: 1,
        barThickness: 20,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 2,
        ticks: {
          stepSize: 0.5
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)'
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const param = submissionData.evaluation.find(p => p.name === context.label);
            return [
              `Score: ${context.raw}/2`,
              `Feedback: ${param?.reason || 'No feedback available'}`
            ];
          }
        }
      }
    }
  };

  const toggleParameterExpansion = (index) => {
    setExpandedParameter(expandedParameter === index ? null : index);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "shortlisted": return "bg-green-100 text-green-800";
      case "revisit": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Submissions
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Submission Analysis</h1>
          <div className="w-8"></div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Score Card */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">Total Score</h3>
                  <FaTrophy className="text-yellow-500 text-xl" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(submissionData.totalScore * 100) / 100} <span className="text-lg text-gray-500">/ 10</span>
                  </p>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submissionData.currentStatus)}`}>
                      {submissionData.currentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Average Parameter Score */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">Avg. Parameter</h3>
                  <FaChartLine className="text-green-500 text-xl" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics.averageParameterScore} <span className="text-lg text-gray-500">/ 2</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{metrics.aboveAverageParameters} above average</p>
                </div>
              </div>

              {/* Strongest Parameter */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">Strongest Area</h3>
                  <FaCheckCircle className="text-indigo-500 text-xl" />
                </div>
                <div className="mt-4">
                  <p className="text-xl font-bold text-gray-900 capitalize">
                    {metrics.strongestParameter || "N/A"} ({metrics.strongestParameterScore}/2)
                  </p>
                </div>
              </div>

              {/* Weakest Parameter */}
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">Needs Improvement</h3>
                  <FaExclamationCircle className="text-red-500 text-xl" />
                </div>
                <div className="mt-4">
                  <p className="text-xl font-bold text-gray-900 capitalize">
                    {metrics.weakestParameter || "N/A"} ({metrics.weakestParameterScore}/2)
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Chart View Toggle */}
              <div className="lg:col-span-2 flex justify-end">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => setChartView("radar")}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                      chartView === "radar"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FaChartLine className="inline mr-2" /> Radar View
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartView("bar")}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                      chartView === "bar"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FaChartBar className="inline mr-2" /> Bar Chart
                  </button>
                </div>
              </div>

              {/* Chart Display */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                  {chartView === "radar" ? (
                    <>
                      <FaChartLine className="text-blue-500" /> Parameter Performance Radar
                    </>
                  ) : (
                    <>
                      <FaChartBar className="text-blue-500" /> Parameter Scores Breakdown
                    </>
                  )}
                </h3>
                <div className="h-64">
                  {chartView === "radar" ? (
                    <Radar 
                      data={radarChartData}
                      options={radarChartOptions}
                    />
                  ) : (
                    <Bar
                      data={barChartData}
                      options={barChartOptions}
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {chartView === "radar" 
                    ? "Hover over points to see detailed feedback for each parameter"
                    : "Hover over bars to see detailed feedback for each parameter"}
                </p>
              </div>

              {/* Parameter Details */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-indigo-500" /> Parameter-wise Evaluation
                </h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {submissionData.evaluation.map((param, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleParameterExpansion(index)}
                      >
                        <div>
                          <h4 className="font-medium capitalize">{param.name}</h4>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            param.score >= 2 ? 'bg-green-100 text-green-800' :
                            param.score >= 1 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Score: {param.score}/2
                          </span>
                        </div>
                        {expandedParameter === index ? (
                          <FaChevronUp className="text-gray-500" />
                        ) : (
                          <FaChevronDown className="text-gray-500" />
                        )}
                      </div>
                      {expandedParameter === index && (
                        <div className="mt-2 pl-2">
                          <p className="text-sm text-gray-600">{param.reason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Strengths */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" /> Key Strengths ({submissionData.strengths.length})
                </h3>
                <ul className="space-y-3">
                  {submissionData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">{strength}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <FaExclamationCircle className="text-yellow-500" /> Areas for Improvement ({submissionData.improvements.length})
                </h3>
                <ul className="space-y-3">
                  {submissionData.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
                      <FaExclamationCircle className="text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">{improvement}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-indigo-500" /> Insights & Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Performance Summary</h4>
                  <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>Scored {submissionData.totalScore}/10 overall</li>
                    <li>{metrics.aboveAverageParameters} out of {submissionData.evaluation.length} parameters above average</li>
                    <li>Strongest in {metrics.strongestParameter}</li>
                    <li>Needs work on {metrics.weakestParameter}</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-1 text-purple-700">
                    <li>Focus on improving {metrics.weakestParameter}</li>
                    <li>Leverage strength in {metrics.strongestParameter}</li>
                    <li>Review detailed feedback for each parameter</li>
                    <li>Consider mentoring in identified weak areas</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2">
                <FaSave className="text-indigo-500" /> Update Evaluation Status
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {["shortlisted", "revisit", "rejected"].map((option) => (
                  <button
                    key={option}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      status === option
                        ? option === "shortlisted"
                          ? "bg-green-600 text-white"
                          : option === "revisit"
                          ? "bg-yellow-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setStatus(option)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSave}
                className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <FaSave /> Save Status
              </button>
            </div>

            {/* Submission Link */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Submission Link</h3>
                  <p className="text-sm text-gray-500">View the student's original submission</p>
                </div>
                <a
                  href={submissionData.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                  <FaExternalLinkAlt /> View Submission
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionAnalysis;