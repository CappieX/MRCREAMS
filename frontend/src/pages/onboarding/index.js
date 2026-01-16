import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OnboardingRouter = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = user.userType || user.user_type;

  if (role === 'therapist') {
    return <Navigate to="/onboarding/therapist" replace />;
  }

  if (role === 'company' || role === 'platform_admin' || role === 'executive') {
    return <Navigate to="/onboarding/professional" replace />;
  }

  if (role === 'admin' || role === 'super_admin' || role === 'it_admin' || role === 'support') {
    return <Navigate to="/onboarding/admin" replace />;
  }

  return <Navigate to="/onboarding/client" replace />;
};

export default OnboardingRouter;

