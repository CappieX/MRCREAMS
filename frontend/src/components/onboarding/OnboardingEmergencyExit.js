import React from 'react';
import { useAuth } from '../../context/AuthContext';

const OnboardingEmergencyExit = () => {
  const { updateProfile } = useAuth();

  const forceCompleteOnboarding = async () => {
    try {
      await updateProfile({
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString()
      });
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Emergency exit failed:', error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <button
        onClick={forceCompleteOnboarding}
        style={{
          background: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Emergency Exit
      </button>
    </div>
  );
};

export default OnboardingEmergencyExit;
