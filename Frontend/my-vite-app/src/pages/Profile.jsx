import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import divider from "../assets/divider.svg";  
import client3 from "../assets/client3.png";  

function Profile() {
  const [users, setUsers] = useState({
    name: "Adway",
    email: "adway@gmail.com",
    domain: "Web Development",
    contact: "8985670092"
  });

  return (
    <div className="flex">
      <div className="h-screen sticky top-0">
        <Sidebar />
      </div>
      <div className="flex flex-col items-center mx-auto">
        <div className="text-5xl font-bold text-blue-400 mb-10 mt-10">
          YOUR DETAILS
        </div>
        <div className="mb-8">
          <img className="w-64" src={divider} alt="divider" />
        </div>

        <div className="flex flex-row">
          <div className="w-80">
            <img className="w-80 mt-16 rounded-full" src={client3} alt="Profile" />
          </div>

          <div className="flex flex-col gap-5 mt-16 ml-20">
            <span className="text-2xl bg-blue-100 h-16 px-4 py-2 text-blue-500 rounded-lg font-bold">
              Name: {users.name}
            </span>
            <span className="text-2xl bg-blue-100 h-16 px-4 py-2 text-blue-500 rounded-lg font-bold">
              Email: {users.email}
            </span>
            <span className="text-2xl bg-blue-100 h-16 px-4 py-2 text-blue-500 rounded-lg font-bold">
              Domain: {users.domain}
            </span>
            <span className="text-2xl bg-blue-100 h-16 px-4 py-2 text-blue-500 rounded-lg font-bold">
              Contact: {users.contact}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
