import React, { useState } from "react";  
import CreateHackathonForm from "../components/CreateHackathonForm";
import Sidebar from "../components/Sidebar";

function CreateHackathon() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* Main Content */}
      {/* <div className="flex-1 flex justify-center items-center p-6 bg-gray-100">
        <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md"> */}
        
          <CreateHackathonForm />
        {/* </div>
      </div> */}
    </div>
  );
}

export default CreateHackathon;
