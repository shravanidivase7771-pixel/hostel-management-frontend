import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's authorized role dashboard if trying to access unauthorized route
    const userRole = user.role;
    if (userRole === 'student') return <Navigate to="/dashboard/student" replace />;
    if (userRole === 'warden') return <Navigate to="/dashboard/warden" replace />;
    if (userRole === 'watchman') return <Navigate to="/dashboard/watchman" replace />;
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <Outlet />;
};
