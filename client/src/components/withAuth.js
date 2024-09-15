import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const withAuth = (Component, requiredAccessLevel) => {
  return (props) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (user.access_level < requiredAccessLevel) {
      return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page
    }

    return <Component {...props} />;
  };
};

export default withAuth;
