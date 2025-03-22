import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

function Layout({ onDashboardClick, onShowHackathonsClick }) {
  return (
    <div className="flex flex-col h-screen max-w-screen overflow-x-hidden">
      {/* Navbar */}
      <Navbar teacherName="Adway" />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          onDashboardClick={onDashboardClick}
          onShowHackathonsClick={onShowHackathonsClick}
        />

        {/* Main Content - Leaves space for other pages */}
        <main className="flex-1 p-0 lg:ml-64 mt-[72px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
