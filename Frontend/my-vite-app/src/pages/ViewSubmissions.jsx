import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import * as Dialog from "@radix-ui/react-dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { getSubmissionStats } from "../apis/analyticsApi";
import { toast } from "react-toastify";

const ViewSubmissions = () => {
  const { hackathonId } = useParams();
  const [hackathonData, setHackathonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await getSubmissionStats(token);
        console.log("API Response:", response);
        const selectedHackathon = response.stats.find(
          (hackathon) => hackathon._id === hackathonId
        );
        // console.log(hackathonId);
        // console.log(response);

        if (selectedHackathon) {
          setHackathonData(selectedHackathon);
        } else {
          toast.error("No submission data found for this hackathon.");
        }
      } catch (error) {
        toast.error(error.error || "Failed to fetch submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [hackathonId, token]);

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Loading submissions...</p>;
  }

  if (!hackathonData) {
    return <p className="text-red-400 text-center mt-10">No submission data available.</p>;
  }

  const data = [
    { name: "Shortlisted", count: hackathonData.total_submissions, color: "#22C55E" },
    { name: "Participants", count: hackathonData.total_participants, color: "#FACC15" },
  ];

  return (
    <div className="min-h-screen flex justify-center bg-gray-900 p-6 text-white w-full">
      <div className="w-full h-full bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-3xl font-bold text-orange-400">{hackathonData.title}</h2>

        {/* Key Stats */}
        <div className="mt-6 grid grid-cols-2 md:gap-4 gap-2 text-center">
          {[
            { label: "Participants", value: hackathonData.total_participants, color: "text-indigo-400" },
            { label: "Submissions", value: hackathonData.total_submissions, color: "text-green-400" },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-700 md:p-4 p-2 rounded-lg">
              <p className={`lg:text-2xl text-md font-semibold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-gray-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="mt-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Submission Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#CBD5E1" />
              <YAxis stroke="#CBD5E1" />
              <Tooltip contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", color: "#fff" }} />
              <Legend wrapperStyle={{ color: "#CBD5E1" }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Evaluation Button */}
        <div className="mt-6 flex justify-center">
          <Dialog.Root>
            <Dialog.Trigger className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition">
              Evaluate Submissions
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <Dialog.Title className="text-lg font-semibold text-white">
                  Evaluation Details
                </Dialog.Title>
                <p className="text-gray-300 mt-2">Review the submitted projects and scores.</p>
                <div className="mt-4">
                  <Dialog.Close className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
                    Close
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
};

  // const hackathon = {
  //   name: "AI Challenge 2025",
  //   description:
  //     "A cutting-edge AI competition for developers and researchers.",
  //   registrations: 120000,
  //   submissions: 17000,
  //   avgScore: 5,
  //   rejected: 12000,
  //   revisit: 3000,
  //   shortlisted: 2000,
  // };

  // const data = [
  //   { name: "Shortlisted", count: hackathon.shortlisted, color: "#22C55E" },
  //   { name: "Revisit", count: hackathon.revisit, color: "#FACC15" },
  //   { name: "Rejected", count: hackathon.rejected, color: "#EF4444" },
  // ];


//   return (
//     <div className="min-h-screen flex justify-center bg-gray-900 p-6 text-white w-full">
//       <div className="w-full h-full bg-gray-800 rounded-xl shadow-lg p-6">
//         <h2 className="text-3xl font-bold text-orange-400">{hackathon.name}</h2>
//         <p className="text-gray-300 mt-2">{hackathon.description}</p>

//         {/* Key Stats */}
//         <div className="mt-6 grid grid-cols-3 md:gap-4 gap-2 text-center">
//           {[
//             {
//               label: "Registrations",
//               value: hackathon.registrations,
//               color: "text-indigo-400",
//             },
//             {
//               label: "Submissions",
//               value: hackathon.submissions,
//               color: "text-green-400",
//             },
//             {
//               label: "Avg Score",
//               value: hackathon.avgScore,
//               color: "text-yellow-400",
//             },
//           ].map((stat, index) => (
//             <div key={index} className="bg-gray-700 md:p-4 p-2 rounded-lg">
//               <p className={`lg:text-2xl text-md font-semibold ${stat.color}`}>
//                 {stat.value}
//               </p>
//               <p className="text-gray-300 text-sm">{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Beautiful Chart */}
//         <div className="mt-6 bg-gray-700 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold text-white mb-4">
//             Submission Status
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//               data={data}
//               margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
//             >
//               <defs>
//                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
//                   <stop offset="100%" stopColor="#4F46E5" stopOpacity={1} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
//               <XAxis dataKey="name" stroke="#CBD5E1" />
//               <YAxis stroke="#CBD5E1" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#1E293B",
//                   borderRadius: "8px",
//                   border: "none",
//                   color: "#fff",
//                 }}
//                 cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
//               />
//               <Legend wrapperStyle={{ color: "#CBD5E1" }} />
//               <Bar
//                 dataKey="count"
//                 fill="url(#barGradient)"
//                 radius={[8, 8, 0, 0]}
//                 barSize={50}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Evaluation Button */}
//         <div className="mt-6 flex justify-center">
//           <Dialog.Root>
//             <Dialog.Trigger className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition">
//               Evaluate Submissions
//             </Dialog.Trigger>
//             <Dialog.Portal>
//               <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
//               <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//                 <Dialog.Title className="text-lg font-semibold text-white">
//                   Evaluation Details
//                 </Dialog.Title>
//                 <p className="text-gray-300 mt-2">
//                   Review the submitted projects and scores.
//                 </p>
//                 <div className="mt-4">
//                   <Dialog.Close className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
//                     Close
//                   </Dialog.Close>
//                 </div>
//               </Dialog.Content>
//             </Dialog.Portal>
//           </Dialog.Root>
//         </div>
//       </div>
//     </div>
//   );
// };

export default ViewSubmissions;
