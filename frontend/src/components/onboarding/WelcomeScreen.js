import React, { useEffect } from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onboardingData, onComplete, isLastStep = true }) => {
  const { userType, basicInfo } = onboardingData;
  const userName = basicInfo?.fullName?.split(' ')[0] || 'there';

  // Debug logging
  useEffect(() => {
    console.log('WelcomeScreen mounted with props:', {
      hasOnComplete: !!onComplete,
      onboardingData: onboardingData
    });
  }, [onComplete, onboardingData]);

  const welcomeMessages = {
    single_man: {
      title: `Welcome, ${userName}` ,
      subtitle: "Let's explore your emotional strength and patterns together",
      features: [
        "Build emotional awareness skills",
        "Understand relationship patterns",
        "Prepare for healthy connections",
        "Develop communication confidence"
      ],
      nextSteps: [
        "Complete your emotional baseline assessment",
        "Explore personalized growth exercises",
        "Set up your first reflection session"
      ]
    },
    single_woman: {
      title: `Welcome, ${userName}` ,
      subtitle: "This is your safe space for reflection, growth, and healing",
      features: [
        "Heal from past relationships",
        "Build self-confidence and boundaries",
        "Understand your attachment style",
        "Prepare for emotional intimacy"
      ],
      nextSteps: [
        "Start with self-reflection exercises",
        "Set personal growth goals",
        "Explore our community resources"
      ]
    },
    married_man: {
      title: `Welcome back to connection, ${userName}` ,
      subtitle: "MR.CREAMS will help you navigate conflicts with care and understanding",
      features: [
        "Improve communication with your partner",
        "Manage conflict constructively",
        "Strengthen emotional intimacy",
        "Balance relationship and personal needs"
      ],
      nextSteps: [
        "Invite your partner to join sessions",
        "Set relationship goals together",
        "Try our communication exercises"
      ]
    },
    married_woman: {
      title: `Welcome, ${userName}` ,
      subtitle: "Your emotional well-being matters — let's restore balance and deeper understanding",
      features: [
        "Feel heard and understood",
        "Restore emotional intimacy",
        "Balance work-family stress",
        "Improve communication patterns"
      ],
      nextSteps: [
        "Schedule your first couples session",
        "Explore emotional connection exercises",
        "Set personal well-being boundaries"
      ]
    },
    recently_separated: {
      title: `You're not alone, ${userName}` ,
      subtitle: "Healing starts here. Let's take one gentle step at a time",
      features: [
        "Process grief and loss safely",
        "Rediscover your identity",
        "Rebuild positive mindset",
        "Prepare for healthy future relationships"
      ],
      nextSteps: [
        "Begin with healing exercises",
        "Set up your support system",
        "Explore self-discovery resources"
      ]
    }
  };

  const welcome = welcomeMessages[userType?.id] || welcomeMessages.single_man;

  const handleGetStarted = () => {
    console.log('Start Your Journey clicked');

    if (typeof onComplete === 'function') {
      console.log('Calling onComplete with data:', onboardingData);
      onComplete(onboardingData);
    } else {
      console.error('onComplete is not a function:', onComplete);
      // Fallback: Redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="welcome-icon">🎉</div>
          <h1>{welcome.title}</h1>
          <p className="welcome-subtitle">{welcome.subtitle}</p>
        </div>

        <div className="welcome-content">
          <div className="welcome-features">
            <h3>What's waiting for you:</h3>
            <ul className="features-list">
              {welcome.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="next-steps">
            <h3>Recommended next steps:</h3>
            <div className="steps-grid">
              {welcome.nextSteps.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="personalization-notice">
            <div className="notice-icon">🎯</div>
            <div className="notice-content">
              <h4>Personalized for You</h4>
              <p>
                Based on your profile as a <strong>{userType?.label}</strong>,
                we've customized your experience to focus on what matters most to you.
              </p>
            </div>
          </div>
        </div>

        <div className="welcome-actions">
          <button
            onClick={handleGetStarted}
            className="btn-primary large"
            id="start-journey-button"
          >
            Start Your Journey
          </button>
          <p className="welcome-note">
            You can always update your preferences in settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
