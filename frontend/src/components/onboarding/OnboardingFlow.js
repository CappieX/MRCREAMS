import React, { useState, useEffect } from 'react';
import UserTypeSelection from './UserTypeSelection';
import BasicInformation from './BasicInformation';
import RelationshipContext from './RelationshipContext';
import GoalsPreferences from './GoalsPreferences';
import EmotionalSnapshot from './EmotionalSnapshot';
import TermsPrivacy from './TermsPrivacy';
import OnboardingEmergencyExit from './OnboardingEmergencyExit';

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});

  const steps = [
    { component: UserTypeSelection, title: "Relationship Status" },
    { component: BasicInformation, title: "Basic Information" },
    { component: RelationshipContext, title: "Relationship Context" },
    { component: GoalsPreferences, title: "Goals & Preferences" },
    { component: EmotionalSnapshot, title: "Emotional Snapshot" },
    { component: TermsPrivacy, title: "Terms & Privacy" },
    { component: WelcomeScreen, title: "Welcome" }
  ];

  // Debug: Log when onComplete prop changes
  useEffect(() => {
    console.log('OnboardingFlow mounted with onComplete:', typeof onComplete);
  }, [onComplete]);

  const updateOnboardingData = (newData) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const handleStepComplete = (stepData) => {
    console.log(`Step ${currentStep} completed with data:` , stepData);
    updateOnboardingData(stepData);

    // Move to next step if not the last one
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinalComplete = (finalData) => {
    console.log('Final completion called with:', finalData);
    const completeData = { ...onboardingData, ...finalData };

    if (typeof onComplete === 'function') {
      onComplete(completeData);
    } else {
      console.error('onComplete is not available, using fallback');
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
