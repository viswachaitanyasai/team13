import React, { useState, useEffect }  from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

function Layout({ onDashboardClick, onShowHackathonsClick }) {
  // State to hold the teacher's name
  const [teacherName, setTeacherName] = useState("Teacher");

  // Fetch teacher name from localStorage when the component mounts
  useEffect(() => {
    const storedName = localStorage.getItem("teacherName");
    if (storedName) {
      setTeacherName(storedName);
    }
  }, []);
  return (
    <div className="flex flex-col h-screen max-w-screen overflow-x-hidden">
      {/* Navbar */}
      <Navbar teacherName={teacherName} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          onDashboardClick={onDashboardClick}
          onShowHackathonsClick={onShowHackathonsClick}
        />

        {/* Main Content - Leaves space for other pages */}
        <main className="flex-1 p-0 lg:ml-[240px] mt-[72px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
