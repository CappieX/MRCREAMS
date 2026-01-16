import React, { useState, useEffect } from 'react';
import UserTypeSelection from './UserTypeSelection';
import BasicInformation from './BasicInformation';
import RelationshipContext from './RelationshipContext';
import GoalsPreferences from './GoalsPreferences';
import EmotionalSnapshot from './EmotionalSnapshot';
import TermsPrivacy from './TermsPrivacy';
import OnboardingEmergencyExit from './OnboardingEmergencyExit';
import WelcomeScreen from './WelcomeScreen';
import { useOnboarding } from '../../hooks/useOnboarding';

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const { saveOnboardingProgress } = useOnboarding();

  const steps = [
    { component: UserTypeSelection, title: "Relationship Status" },
    { component: BasicInformation, title: "Basic Information" },
    { component: RelationshipContext, title: "Relationship Context" },
    { component: GoalsPreferences, title: "Goals & Preferences" },
    { component: EmotionalSnapshot, title: "Emotional Snapshot" },
    { component: TermsPrivacy, title: "Terms & Privacy" },
    { component: WelcomeScreen, title: "Welcome" }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('onboarding_temp_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.data) {
          setOnboardingData(parsed.data);
        }
        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step < steps.length) {
          setCurrentStep(parsed.step);
        }
      } catch (e) {
      }
    }
  }, []);

  const updateOnboardingData = (newData) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const handleStepComplete = (stepData) => {
    const mergedData = { ...onboardingData, ...stepData };
    const nextStep = currentStep < steps.length - 1 ? currentStep + 1 : currentStep;
    updateOnboardingData(stepData);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
    saveOnboardingProgress(nextStep, mergedData);
    localStorage.setItem('onboarding_temp_data', JSON.stringify({ step: nextStep, data: mergedData }));
  };

  const handleFinalComplete = (finalData) => {
    const completeData = { ...onboardingData, ...finalData };
    const finalStepIndex = steps.length - 1;
    saveOnboardingProgress(finalStepIndex, completeData);
    localStorage.setItem('onboarding_temp_data', JSON.stringify({ step: finalStepIndex, data: completeData }));

    if (typeof onComplete === 'function') {
      onComplete(completeData);
    } else {
      localStorage.removeItem('onboarding_temp_data');
      window.location.href = '/dashboard';
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="onboarding-flow">
      <div className="onboarding-progress">
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}` }
            >
              <div className="step-number">{index + 1}</div>
              <span className="step-label">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-container">
        <CurrentStepComponent
          userType={onboardingData.userType}
          onboardingData={onboardingData}
          onComplete={currentStep === steps.length - 1 ? handleFinalComplete : handleStepComplete}
          onBack={handleBack}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>

      {/* Emergency exit for stuck onboarding */}
      <OnboardingEmergencyExit />
    </div>
  );
};

export default OnboardingFlow;
