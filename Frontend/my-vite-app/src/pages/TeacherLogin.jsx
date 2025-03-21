import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom"; 

function TeacherLogin() {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const submit = () => {
        console.log("Email:", email);
        console.log("Password:", password);
      };
      
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center w-full h-full flex-1 text-center">
        <div className="bg-white items-center justify-center rounded-2xl shadow-2xl flex w-2/5 max-w-4xl">
          <div className="w-full">
            <div className="text-3xl font-bold text-blue-500 mt-10">
              Teacher Login
            </div>

            <form action="POST">
              <div className="flex flex-col items-center mt-4">
                <div className="m-4 w-1/2">
                  <input
                    type="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="name@mail.com"
                  />
                </div>
                <div className="m-4 w-1/2">
                  <input
                    type="password"
                    className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Password"
                  />
                </div>
                <div className="m-4">
                  <button
                    onClick={() => navigate("./otp-verification")} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </form>

            <div>or</div>

            <div className="mb-6 ">
              <a
                className="hover:underline text-blue-500 hover:text-blue-900"
                href="#"
              >
                Click here{' '}
              </a>
              to return to the Home page
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherLogin