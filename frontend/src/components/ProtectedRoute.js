import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false }) => {
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

  if (adminOnly && !currentUser.is_admin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;