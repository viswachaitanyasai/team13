import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const SecuredRoute = () => {
  const token = localStorage.getItem("authToken");

  return token ? <Outlet /> : <Navigate to="/teacher-login" replace />;
};

export default SecuredRoute;

