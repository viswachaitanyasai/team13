import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Statistics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      studentStats: [30, 20, 40, 25, 50],
      taskCompletion: [300, 50, 100],
      attendance: [78, 85, 90, 88],
      classProgress: [
        { class: "Class A", registered: 78, completed: 32 },
        { class: "Class B", registered: 60, completed: 43 },
        { class: "Class C", registered: 80, completed: 67 },
        { class: "Class D", registered: 104, completed: 56 },
      ],
      individualPerformance: [
        { student: "John", score: 75 },
        { student: "Emma", score: 82 },
        { student: "Mike", score: 60 },
        { student: "Sophia", score: 90 },
      ],
      upcomingActivities: [
        "Meeting with the VC - 10 AM - Due soon",
        "Meeting with the John - 11 AM - Upcoming",
        "Class B middle session - 1 PM - Upcoming",
        "Send Mr. Ayo class  - 2 PM - Upcoming",
      ],
    });
  }, []);

  if (!data) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-center text-blue-600 text-lg animate-pulse font-medium">
        Loading statistics...
      </p>
    </div>
  );

  // Blue color palette
  const blueColorPalette = {
    bar: {
      backgroundColor: [
        'rgba(37, 99, 235, 0.9)',
        'rgba(37, 99, 235, 0.8)',
        'rgba(37, 99, 235, 0.7)',
        'rgba(37, 99, 235, 0.6)',
        'rgba(37, 99, 235, 0.5)'
      ],
      hoverBackgroundColor: [
        'rgba(37, 99, 235, 1)',
        'rgba(37, 99, 235, 0.9)',
        'rgba(37, 99, 235, 0.8)',
        'rgba(37, 99, 235, 0.7)',
        'rgba(37, 99, 235, 0.6)'
      ]
    },
    pie: {
      backgroundColor: [
        'rgba(37, 99, 235, 0.9)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(96, 165, 250, 0.7)'
      ],
      hoverBackgroundColor: [
        'rgba(37, 99, 235, 1)',
        'rgba(59, 130, 246, 0.9)',
        'rgba(96, 165, 250, 0.8)'
      ]
    },
    doughnut: {
      backgroundColor: [
        'rgba(37, 99, 235)',
        'rgba(59, 130, 246, 0.9)',
        'rgba(96, 165, 250, 0.5)',
        'rgba(147, 197, 253, 0.3)'
      ],
      hoverBackgroundColor: [
        'rgba(37, 99, 235, 1)',
        'rgba(59, 130, 246, 0.9)',
        'rgba(96, 165, 250, 0.8)',
        'rgba(147, 197, 253, 0.7)'
      ]
    },
    line: {
      borderColor: 'rgba(37, 99, 235, 0.9)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      pointBackgroundColor: 'rgba(37, 99, 235, 1)',
      pointBorderColor: '#fff'
    },
    individual: [
      { main: 'rgba(37, 99, 235)', background: 'rgba(219, 234, 254, 0.4)' },
      { main: 'rgba(37, 99, 235)', background: 'rgba(219, 234, 254, 0.4)' },
      { main: 'rgba(37, 99, 235)', background: 'rgba(219, 234, 254, 0.4)' },
      { main: 'rgba(37, 99, 235)', background: 'rgba(219, 234, 254, 0.4)' }
    ]
  };

  const individualPerformanceData = data?.individualPerformance?.map((student, index) => ({
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [student.score, 100 - student.score],
        backgroundColor: [
          blueColorPalette.individual[index % blueColorPalette.individual.length].main,
          blueColorPalette.individual[index % blueColorPalette.individual.length].background
        ],
        borderWidth: 0,
        cutout: '75%'
      },
    ],
  }));

  const barData = {
    labels: ["Class A", "Class B", "Class C", "Class D", "Class E"],
    datasets: [
      {
        label: "Student Statistics",
        data: data.studentStats,
        backgroundColor: blueColorPalette.bar.backgroundColor,
        hoverBackgroundColor: blueColorPalette.bar.hoverBackgroundColor,
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 138, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 6,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(219, 234, 254, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(219, 234, 254, 0.2)'
        },
        ticks: {
          color: 'rgba(30, 58, 138, 0.8)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(30, 58, 138, 0.8)'
        }
      }
    },
    maintainAspectRatio: false
  };

  const pieData = {
    labels: ["Completed", "Pending", "Failed"],
    datasets: [
      {
        label: "Task Completion Status",
        data: data.taskCompletion,
        backgroundColor: blueColorPalette.pie.backgroundColor,
        hoverBackgroundColor: blueColorPalette.pie.hoverBackgroundColor,
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: 'rgba(30, 58, 138, 0.8)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 138, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 6,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(219, 234, 254, 0.3)',
        borderWidth: 1
      }
    },
    maintainAspectRatio: false
  };

  const doughnutData = {
    labels: data.classProgress.map((item) => item.class),
    datasets: [
      {
        label: "Class Completion",
        data: data.classProgress.map((item) => item.completed),
        backgroundColor: blueColorPalette.doughnut.backgroundColor,
        hoverBackgroundColor: blueColorPalette.doughnut.hoverBackgroundColor,
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: 'rgba(30, 58, 138, 0.8)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 138, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 6,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(219, 234, 254, 0.3)',
        borderWidth: 1
      }
    },
    cutout: '65%',
    maintainAspectRatio: false
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Attendance Rate",
        data: data.attendance,
        borderColor: blueColorPalette.line.borderColor,
        backgroundColor: blueColorPalette.line.backgroundColor,
        pointBackgroundColor: blueColorPalette.line.pointBackgroundColor,
        pointBorderColor: blueColorPalette.line.pointBorderColor,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 58, 138, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 6,
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(219, 234, 254, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 70,
        grid: {
          color: 'rgba(219, 234, 254, 0.2)'
        },
        ticks: {
          color: 'rgba(30, 58, 138, 0.8)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(30, 58, 138, 0.8)'
        }
      }
    },
    maintainAspectRatio: false
  };

  const individualOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    cutout: '75%',
    maintainAspectRatio: true
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-blue-800 transition-all duration-500 hover:text-blue-600">
        Statistics Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-md rounded-2xl transform transition-all duration-500 hover:shadow-xl border border-blue-100 hover:border-blue-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800">Student Statistics</h3>
          </div>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-md rounded-2xl transform transition-all duration-500 hover:shadow-xl border border-blue-100 hover:border-blue-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800">Task Completion</h3>
          </div>
          <div className="h-64">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-md rounded-2xl transform transition-all duration-500 hover:shadow-xl border border-blue-100 hover:border-blue-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800">Attendance Trends</h3>
          </div>
          <div className="h-64">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-md rounded-2xl transform transition-all duration-500 hover:shadow-xl border border-blue-100 hover:border-blue-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800">Class Progress</h3>
          </div>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-md rounded-2xl transform transition-all duration-500 hover:shadow-xl border border-blue-100 hover:border-blue-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800">Individual Performance</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            {individualPerformanceData?.map((d, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div className="h-32 w-32">
                  <Doughnut data={d} options={individualOptions} />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-3xl font-bold text-blue-700">
                    {data?.individualPerformance?.[index]?.score}%
                  </p>
                </div>
                <p className="text-center mt-2 font-semibold text-blue-800">
                  {data?.individualPerformance?.[index]?.student}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="bg-white p-6 shadow-md rounded-2xl transform transition-all duration-500 hover:shadow-xl border border-blue-100 hover:border-blue-300">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-800">Upcoming Activities</h3>
          </div>
          
          <ul className="space-y-3">
            {data.upcomingActivities.map((activity, index) => {
              const isDueSoon = activity.includes("Due soon");
              return (
                <li 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    isDueSoon ? 'bg-blue-50 border-l-4 border-blue-600' : 'bg-white border border-blue-100'
                  }`}
                >
                  <p className={`${isDueSoon ? 'font-medium text-blue-800' : 'text-blue-700'}`}>{activity}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Statistics;