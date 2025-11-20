import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useOnboarding = () => {
  const { user, updateProfile } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setNeedsOnboarding(true);
      // Restore previous step if exists
      setOnboardingStep(user.onboardingStep || 0);
    }
  }, [user]);

  const completeOnboarding = async (onboardingData) => {
    try {
      const profileData = {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        userType: onboardingData.userType,
        relationshipContext: onboardingData.relationshipContext,
        goalsPreferences: onboardingData.goalsPreferences,
        emotionalSnapshot: onboardingData.emotionalSnapshot,
        ...onboardingData.basicInfo
      };

      await updateProfile(profileData);
      setNeedsOnboarding(false);

      // Track onboarding completion in analytics
      if (window.gtag) {
        window.gtag('event', 'onboarding_complete', {
          user_type: onboardingData.userType?.id,
          goals_count: onboardingData.goalsPreferences?.goals?.length || 0
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const saveOnboardingProgress = async (step, data) => {
    try {
      await updateProfile({
        onboardingStep: step,
        onboardingData: data
      });
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  };

  return {
    needsOnboarding,
    onboardingStep,
    completeOnboarding,
    saveOnboardingProgress
  };
};
