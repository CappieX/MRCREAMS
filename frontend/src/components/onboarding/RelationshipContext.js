import React, { useState } from 'react';
import './RelationshipContext.css';

const RelationshipContext = ({ userType, onboardingData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    relationshipDuration: '',
    relationshipStatus: '',
    previousRelationships: '',
    childrenCount: '',
    livingArrangement: '',
    currentChallenges: [],
    relationshipGoals: [],
    ...onboardingData.relationshipContext
  });

  // Dynamic options based on user type
  const getRelationshipDurationOptions = () => {
    if (userType?.id === 'single_man' || userType?.id === 'single_woman') {
      return [
        'Less than 6 months',
        '6 months to 1 year',
        '1-2 years',
        '2-5 years',
        '5+ years',
        'Not currently in a relationship'
      ];
    }
    return [
      'Less than 1 year',
      '1-3 years',
      '3-5 years',
      '5-10 years',
      '10-20 years',
      '20+ years'
    ];
  };

  const getRelationshipStatusOptions = () => {
    if (userType?.id === 'single_man' || userType?.id === 'single_woman') {
      return [
        'Single and looking',
        'Single and not looking',
        'Casually dating',
        'Recently single',
        'Taking time for myself'
      ];
    }
    return [
      'Very happy and connected',
      'Generally good with some challenges',
      'Struggling but committed',
      'Considering separation',
      'Recently reconciled'
    ];
  };

  const challengeOptions = {
    single_man: [
      'Building emotional awareness',
      'Understanding past relationship patterns',
      'Developing communication skills',
      'Building self-confidence',
      'Managing loneliness',
      'Setting healthy boundaries'
    ],
    single_woman: [
      'Healing from past relationships',
      'Building self-confidence',
      'Setting healthy boundaries',
      'Understanding attachment patterns',
      'Managing loneliness',
      'Preparing for emotional intimacy'
    ],
    married_man: [
      'Communication breakdown',
      'Emotional distance',
      'Work-life balance',
      'Financial disagreements',
      'Intimacy issues',
      'Parenting conflicts',
      'Extended family issues'
    ],
    married_woman: [
      'Feeling unheard',
      'Emotional disconnection',
      'Work-family stress',
      'Financial disagreements',
      'Intimacy issues',
      'Parenting conflicts',
      'Extended family issues'
    ],
    recently_separated: [
      'Processing grief and loss',
      'Co-parenting challenges',
      'Financial adjustments',
      'Social isolation',
      'Identity rediscovery',
      'Legal proceedings',
      'Emotional healing'
    ]
  };

  const goalOptions = {
    single_man: [
      'Learn emotional intelligence',
      'Prepare for healthy relationships',
      'Build self-awareness',
      'Develop communication skills',
      'Understand attachment patterns'
    ],
    single_woman: [
      'Heal from past relationships',
      'Build self-confidence',
      'Understand my needs',
      'Prepare for emotional intimacy',
      'Develop healthy boundaries'
    ],
    married_man: [
      'Improve communication',
      'Rebuild emotional connection',
      'Manage conflict better',
      'Balance work and family',
      'Express emotions effectively'
    ],
    married_woman: [
      'Feel heard and understood',
      'Restore emotional intimacy',
      'Improve communication',
      'Balance work and family',
      'Set healthy boundaries'
    ],
    recently_separated: [
      'Heal emotionally',
      'Rediscover my identity',
      'Process the separation',
      'Prepare for future relationships',
      'Build support system'
    ]
  };

  const handleChallengeToggle = (challenge) => {
    setFormData(prev => ({
      ...prev,
      currentChallenges: prev.currentChallenges.includes(challenge)
        ? prev.currentChallenges.filter(c => c !== challenge)
        : [...prev.currentChallenges, challenge]
    }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      relationshipGoals: prev.relationshipGoals.includes(goal)
        ? prev.relationshipGoals.filter(g => g !== goal)
        : [...prev.relationshipGoals, goal]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ relationshipContext: formData });
  };

  const currentChallenges = challengeOptions[userType?.id] || [];
  const currentGoals = goalOptions[userType?.id] || [];

  return (
    <div className="relationship-context">
      <div className="onboarding-header">
        <h1>Relationship Context</h1>
        <p>Help us understand your current situation</p>
      </div>

      <form onSubmit={handleSubmit} className="context-form">
        {/* Relationship Duration */}
        <div className="form-section">
          <h3>How long have you been in your current relationship?</h3>
          <select
            value={formData.relationshipDuration}
            onChange={(e) => setFormData({...formData, relationshipDuration: e.target.value})}
            className="form-select"
          >
            <option value="">Select duration</option>
            {getRelationshipDurationOptions().map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Relationship Status */}
        <div className="form-section">
          <h3>How would you describe your current relationship status?</h3>
          <div className="radio-grid">
            {getRelationshipStatusOptions().map(status => (
              <label key={status} className="radio-card">
                <input
                  type="radio"
                  name="relationshipStatus"
                  value={status}
                  checked={formData.relationshipStatus === status}
                  onChange={(e) => setFormData({...formData, relationshipStatus: e.target.value})}
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Current Challenges */}
        <div className="form-section">
          <h3>What are your current challenges? (Select all that apply)</h3>
          <div className="challenges-grid">
            {currentChallenges.map((challenge, index) => (
              <label key={index} className="challenge-card">
                <input
                  type="checkbox"
                  checked={formData.currentChallenges.includes(challenge)}
                  onChange={() => handleChallengeToggle(challenge)}
                />
                <span>{challenge}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Relationship Goals */}
        <div className="form-section">
          <h3>What are your relationship goals? (Select up to 3)</h3>
          <div className="goals-grid">
            {currentGoals.map((goal, index) => (
              <label key={index} className="goal-card">
                <input
                  type="checkbox"
                  checked={formData.relationshipGoals.includes(goal)}
                  onChange={() => handleGoalToggle(goal)}
                  disabled={formData.relationshipGoals.length >= 3 && !formData.relationshipGoals.includes(goal)}
                />
                <span>{goal}</span>
              </label>
            ))}
          </div>
          <div className="selection-counter">
            {formData.relationshipGoals.length}/3 goals selected
          </div>
        </div>

        {/* Children */}
        <div className="form-section">
          <h3>Children</h3>
          <select
            value={formData.childrenCount}
            onChange={(e) => setFormData({...formData, childrenCount: e.target.value})}
            className="form-select"
          >
            <option value="">Do you have children?</option>
            <option value="0">No children</option>
            <option value="1">1 child</option>
            <option value="2">2 children</option>
            <option value="3">3 children</option>
            <option value="4+">4 or more children</option>
          </select>
        </div>

        {/* Living Arrangement */}
        <div className="form-section">
          <h3>Living Arrangement</h3>
          <div className="radio-grid">
            {['Living together', 'Living separately', 'Long distance', 'Other'].map(arrangement => (
              <label key={arrangement} className="radio-card">
                <input
                  type="radio"
                  name="livingArrangement"
                  value={arrangement}
                  checked={formData.livingArrangement === arrangement}
                  onChange={(e) => setFormData({...formData, livingArrangement: e.target.value})}
                />
                <span>{arrangement}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Previous Relationships */}
        <div className="form-section">
          <h3>Previous Relationship Experience</h3>
          <select
            value={formData.previousRelationships}
            onChange={(e) => setFormData({...formData, previousRelationships: e.target.value})}
            className="form-select"
          >
            <option value="">How many serious relationships have you had?</option>
            <option value="0">No previous serious relationships</option>
            <option value="1-2">1-2 previous relationships</option>
            <option value="3-5">3-5 previous relationships</option>
            <option value="6+">6 or more previous relationships</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary">
            Continue to Goals & Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default RelationshipContext;
