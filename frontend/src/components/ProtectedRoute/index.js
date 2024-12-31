import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  // Check if the token exists in cookies
  const token = Cookies.get('token');

  if (!token) {
    // Redirect to login if token is missing
    return <Navigate to="/login" replace />;
  }

  // Render the children if token is present
  return children;
};

export default ProtectedRoute;
