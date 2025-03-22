import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Sidebar from '../components/Sidebar';


function App() {
    const [showDashboard, setShowDashboard] = useState(true);
  
    const handleDashboardClick = () => {
      setShowDashboard(true);
    };
  
    const handleShowHackathonsClick = () => {
      setShowDashboard(false);
    };

  
    return (
      <div className="flex flex-col h-screen">
        <Navbar teacherName="Adway" />
        <div className="flex flex-1">
          <Sidebar           
            onDashboardClick={handleDashboardClick}
            onShowHackathonsClick={handleShowHackathonsClick}
          />
          {showDashboard ? <Dashboard /> : <div className="flex-1 p-4">Hackathons List</div>}
        </div>
      </div>
    );
  }
  
  export default App;