import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';


function DashboardPage() {
    const [showDashboard, setShowDashboard] = useState(true);
  
    const handleDashboardClick = () => {
      setShowDashboard(true);
    };
  
    const handleShowHackathonsClick = () => {
      setShowDashboard(false);
    };

  
    return (
      <div className="flex flex-col h-screen">
          {showDashboard ? <Dashboard /> : <div className="flex-1 p-4">Hackathons List</div>}
      </div>
    );
  }
  
  export default DashboardPage;