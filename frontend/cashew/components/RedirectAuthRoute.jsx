// components/RedirectAuthRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const RedirectAuthRoute = ({ children }) => {
  if (isAuthenticated()) {
    // Redirect logged-in users to homepage
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RedirectAuthRoute;
