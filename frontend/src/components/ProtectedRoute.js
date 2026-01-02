import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false, allowedRoles = [] }) => {
  const { user: currentUser, loading } = useAuth();
  const { needsOnboarding } = useOnboarding();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user needs onboarding
  if (needsOnboarding) {
    return <Navigate to="/onboarding" />;
  }

  // Check allowed roles if provided
  const role = currentUser.user_type || currentUser.userType;
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If user has a dashboard, redirect there, otherwise home
    return <Navigate to="/dashboard" />;
  }

  // Backward compatibility for adminOnly
  if (adminOnly) {
    const admins = ['admin', 'super_admin', 'platform_admin', 'it_admin'];
    // Check user_type or legacy is_admin flag
    if (!admins.includes(role) && !currentUser.is_admin) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
