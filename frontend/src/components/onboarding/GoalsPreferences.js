import React, { useState } from 'react';
import './GoalsPreferences.css';

const GoalsPreferences = ({ userType, onboardingData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    goals: [],
    preferredSupport: '',
    sessionTone: '',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      weeklyDigest: true
    },
    language: 'en',
    ...onboardingData.goalsPreferences
  });

  // User-type specific goal options
  const goalOptions = {
    single_man: [
      "Learn emotional awareness",
      "Avoid past relationship mistakes",
      "Prepare for future healthy relationships",
      "Improve communication skills",
      "Build self-confidence",
      "Understand attachment patterns"
    ],
    single_woman: [
      "Build self-confidence",
      "Understand my attachment style",
      "Heal from past relationships",
      "Set healthy boundaries",
      "Prepare for emotional intimacy",
      "Develop self-love and acceptance"
    ],
    married_man: [
      "Manage conflict constructively",
      "Improve communication with partner",
      "Rebuild trust and connection",
      "Balance work and family life",
      "Express emotions more effectively",
      "Strengthen emotional intimacy"
    ],
    married_woman: [
      "Feel heard and understood",
      "Restore emotional intimacy",
      "Balance work-family stress",
      "Improve communication patterns",
      "Reignite romance and connection",
      "Set healthy relationship boundaries"
    ],
    recently_separated: [
      "Heal emotionally from the separation",
      "Rediscover my identity",
      "Rebuild positive mindset",
      "Process grief and loss",
      "Build independence and confidence",
      "Prepare for future relationships"
    ]
  };

  const supportTypes = [
    { id: 'ai', label: 'AI-Guided Support', description: '24/7 AI assistance with emotional insights' },
    { id: 'therapist', label: 'Therapist-Led', description: 'Professional therapist guidance' },
    { id: 'self_paced', label: 'Self-Paced Learning', description: 'Tools and resources at your own pace' },
    { id: 'mixed', label: 'Mixed Approach', description: 'Combine AI and professional support' }
  ];

  const toneOptions = [
    { id: 'empathetic', label: 'Empathetic & Gentle', description: 'Warm, understanding, and supportive' },
    { id: 'direct', label: 'Direct & Practical', description: 'Straightforward with clear guidance' },
    { id: 'motivational', label: 'Motivational & Energetic', description: 'Encouraging and action-oriented' },
    { id: 'balanced', label: 'Balanced Approach', description: 'Mix of empathy and directness' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }
  ];

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNotificationToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: !prev.notificationPreferences[type]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ goalsPreferences: formData });
  };

  const currentGoals = goalOptions[userType?.id] || [];

  return (
    <div className="goals-preferences">
      <div className="onboarding-header">
        <h1>Your Goals & Preferences</h1>
        <p>Personalize your MR.CREAMS experience based on what matters most to you</p>
      </div>

      <form onSubmit={handleSubmit} className="goals-form">
        {/* Goals Selection */}
        <div className="form-section">
          <h3>What are your main goals? (Select up to 3)</h3>
          <div className="goals-grid">
            {currentGoals.map((goal, index) => (
              <label key={index} className="goal-card">
                <input
                  type="checkbox"
                  checked={formData.goals.includes(goal)}
                  onChange={() => handleGoalToggle(goal)}
                  disabled={formData.goals.length >= 3 && !formData.goals.includes(goal)}
                />
                <span>{goal}</span>
              </label>
            ))}
          </div>
          <div className="selection-counter">
            {formData.goals.length}/3 goals selected
          </div>
        </div>

        {/* Support Type Preference */}
        <div className="form-section">
          <h3>Preferred Support Type</h3>
          <div className="option-grid">
            {supportTypes.map(support => (
              <label key={support.id} className="option-card large">
                <input
                  type="radio"
                  name="supportType"
                  value={support.id}
                  checked={formData.preferredSupport === support.id}
                  onChange={(e) => setFormData({...formData, preferredSupport: e.target.value})}
                />
                <div className="option-content">
                  <h4>{support.label}</h4>
                  <p>{support.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Session Tone Preference */}
        <div className="form-section">
          <h3>Preferred Session Tone</h3>
          <div className="option-grid">
            {toneOptions.map(tone => (
              <label key={tone.id} className="option-card">
                <input
                  type="radio"
                  name="sessionTone"
                  value={tone.id}
                  checked={formData.sessionTone === tone.id}
                  onChange={(e) => setFormData({...formData, sessionTone: e.target.value})}
                />
                <div className="option-content">
                  <h4>{tone.label}</h4>
                  <p>{tone.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="form-section">
          <h3>Notification Preferences</h3>
          <div className="notification-preferences">
            <label className="notification-option">
              <input
                type="checkbox"
                checked={formData.notificationPreferences.email}
                onChange={() => handleNotificationToggle('email')}
              />
              <span>Email Notifications</span>
            </label>
            <label className="notification-option">
              <input
                type="checkbox"
                checked={formData.notificationPreferences.push}
                onChange={() => handleNotificationToggle('push')}
              />
              <span>Push Notifications</span>
            </label>
            <label className="notification-option">
              <input
                type="checkbox"
                checked={formData.notificationPreferences.sms}
                onChange={() => handleNotificationToggle('sms')}
              />
              <span>SMS Alerts</span>
            </label>
            <label className="notification-option">
              <input
                type="checkbox"
                checked={formData.notificationPreferences.weeklyDigest}
                onChange={() => handleNotificationToggle('weeklyDigest')}
              />
              <span>Weekly Progress Digest</span>
            </label>
          </div>
        </div>

        {/* Language Preference */}
        <div className="form-section">
          <h3>Preferred Language</h3>
          <select
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
            className="language-select"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Optional Fields */}
        <div className="form-section">
          <h3>Additional Preferences (Optional)</h3>

          <div className="form-group">
            <label>Comfort Level with AI Emotional Analysis</label>
            <select
              value={formData.aiComfortLevel || 'medium'}
              onChange={(e) => setFormData({...formData, aiComfortLevel: e.target.value})}
            >
              <option value="low">Low - Minimal AI involvement</option>
              <option value="medium">Medium - Balanced AI assistance</option>
              <option value="high">High - Full AI emotional insights</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Therapist Gender (if applicable)</label>
            <select
              value={formData.preferredTherapistGender || 'no_preference'}
              onChange={(e) => setFormData({...formData, preferredTherapistGender: e.target.value})}
            >
              <option value="no_preference">No preference</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-binary</option>
            </select>
          </div>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={formData.researchConsent || false}
              onChange={(e) => setFormData({...formData, researchConsent: e.target.checked})}
            />
            <span>I consent to anonymous data being used for emotional insights research</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary">
            Continue to Emotional Snapshot
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalsPreferences;
