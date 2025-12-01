// components/AdminRedirectRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/adminAuth";

const AdminRedirectRoute = ({ children }) => {
  if (isAdminAuthenticated()) {
    return <Navigate to="/admindashboard" replace />;
  }
  return children;
};

export default AdminRedirectRoute;
