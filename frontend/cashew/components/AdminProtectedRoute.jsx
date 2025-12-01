// components/AdminProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/adminAuth";

const AdminProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/adminlogin" replace />;
  }
  return children;
};

export default AdminProtectedRoute;
