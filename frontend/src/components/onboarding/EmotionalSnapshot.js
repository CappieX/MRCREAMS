import React, { useState } from 'react';
import './EmotionalSnapshot.css';

const EmotionalSnapshot = ({ onboardingData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    currentMood: 5,
    stressLevel: 5,
    hadTherapyBefore: '',
    currentTherapy: '',
    currentMedication: '',
    emotionalTriggers: '',
    attachmentStyle: '',
    ...onboardingData.emotionalSnapshot
  });

  const moodEmojis = ['😢', '😞', '😐', '🙂', '😊', '😄', '🤩'];
  const stressLabels = ['Very Calm', 'Calm', 'Neutral', 'Stressed', 'Very Stressed'];

  const attachmentStyles = [
    { id: 'secure', label: 'Secure', description: 'Comfortable with intimacy and independence' },
    { id: 'anxious', label: 'Anxious', description: 'Seeks high intimacy, worries about relationships' },
    { id: 'avoidant', label: 'Avoidant', description: 'Values independence, uncomfortable with closeness' },
    { id: 'anxious_avoidant', label: 'Anxious-Avoidant', description: 'Mixed feelings about intimacy' },
    { id: 'unsure', label: 'Not Sure', description: 'I don\'t know my attachment style' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ emotionalSnapshot: formData });
  };

  const handleSkip = () => {
    onComplete({ emotionalSnapshot: null });
  };

  return (
    <div className="emotional-snapshot">
      <div className="onboarding-header">
        <h1>Emotional Snapshot</h1>
        <p>Help us understand your current emotional state (all questions are optional)</p>
        <button type="button" onClick={handleSkip} className="skip-button">
          Skip this section
        </button>
      </div>

      <form onSubmit={handleSubmit} className="emotional-form">
        {/* Current Mood */}
        <div className="form-section">
          <h3>How are you feeling right now?</h3>
          <div className="mood-selector">
            <div className="mood-scale">
              {moodEmojis.map((emoji, index) => (
                <label key={index} className="mood-option">
                  <input
                    type="radio"
                    name="currentMood"
                    value={index + 1}
                    checked={formData.currentMood === index + 1}
                    onChange={(e) => setFormData({...formData, currentMood: parseInt(e.target.value)})}
                  />
                  <span className="mood-emoji">{emoji}</span>
                  <span className="mood-label">{index + 1}</span>
                </label>
              ))}
            </div>
            <div className="mood-indicator">
              Current: {formData.currentMood}/7 - {moodEmojis[formData.currentMood - 1]}
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div className="form-section">
          <h3>Current Stress Level</h3>
          <div className="stress-selector">
            <input
              type="range"
              min="1"
              max="5"
              value={formData.stressLevel}
              onChange={(e) => setFormData({...formData, stressLevel: parseInt(e.target.value)})}
              className="stress-slider"
            />
            <div className="stress-labels">
              {stressLabels.map((label, index) => (
                <span key={index} className={`stress-label ${formData.stressLevel === index + 1 ? 'active' : ''}` }>
                  {label}
                </span>
              ))}
            </div>
            <div className="stress-indicator">
              Level {formData.stressLevel}: {stressLabels[formData.stressLevel - 1]}
            </div>
          </div>
        </div>

        {/* Therapy History */}
        <div className="form-section">
          <h3>Therapy & Mental Health History</h3>

          <div className="form-group">
            <label>Have you had therapy before?</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="hadTherapyBefore"
                  value="yes"
                  checked={formData.hadTherapyBefore === 'yes'}
                  onChange={(e) => setFormData({...formData, hadTherapyBefore: e.target.value})}
                />
                <span>Yes</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="hadTherapyBefore"
                  value="no"
                  checked={formData.hadTherapyBefore === 'no'}
                  onChange={(e) => setFormData({...formData, hadTherapyBefore: e.target.value})}
                />
                <span>No</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="hadTherapyBefore"
                  value="prefer_not_to_say"
                  checked={formData.hadTherapyBefore === 'prefer_not_to_say'}
                  onChange={(e) => setFormData({...formData, hadTherapyBefore: e.target.value})}
                />
                <span>Prefer not to say</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Are you currently in therapy?</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="currentTherapy"
                  value="yes"
                  checked={formData.currentTherapy === 'yes'}
                  onChange={(e) => setFormData({...formData, currentTherapy: e.target.value})}
                />
                <span>Yes</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="currentTherapy"
                  value="no"
                  checked={formData.currentTherapy === 'no'}
                  onChange={(e) => setFormData({...formData, currentTherapy: e.target.value})}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Are you currently taking any medication for mental health?</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="currentMedication"
                  value="yes"
                  checked={formData.currentMedication === 'yes'}
                  onChange={(e) => setFormData({...formData, currentMedication: e.target.value})}
                />
                <span>Yes</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="currentMedication"
                  value="no"
                  checked={formData.currentMedication === 'no'}
                  onChange={(e) => setFormData({...formData, currentMedication: e.target.value})}
                />
                <span>No</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="currentMedication"
                  value="prefer_not_to_say"
                  checked={formData.currentMedication === 'prefer_not_to_say'}
                  onChange={(e) => setFormData({...formData, currentMedication: e.target.value})}
                />
                <span>Prefer not to say</span>
              </label>
            </div>
          </div>
        </div>

        {/* Emotional Triggers */}
        <div className="form-section">
          <h3>Emotional Triggers & Patterns</h3>
          <div className="form-group">
            <label>What situations or topics tend to trigger strong emotional responses for you?</label>
            <textarea
              value={formData.emotionalTriggers}
              onChange={(e) => setFormData({...formData, emotionalTriggers: e.target.value})}
              placeholder="e.g., conflict, rejection, feeling ignored, specific topics..."
              rows={3}
            />
          </div>
        </div>

        {/* Attachment Style */}
        <div className="form-section">
          <h3>Attachment Style (Optional)</h3>
          <p className="section-description">
            Understanding your attachment style can help personalize your experience.
            <a href="/attachment-style-quiz" target="_blank" rel="noopener noreferrer">
              Take our attachment style quiz
            </a>
          </p>

          <div className="attachment-options">
            {attachmentStyles.map(style => (
              <label key={style.id} className="option-card">
                <input
                  type="radio"
                  name="attachmentStyle"
                  value={style.id}
                  checked={formData.attachmentStyle === style.id}
                  onChange={(e) => setFormData({...formData, attachmentStyle: e.target.value})}
                />
                <div className="option-content">
                  <h4>{style.label}</h4>
                  <p>{style.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary">
            Continue to Terms & Privacy
          </button>
          <button type="button" onClick={handleSkip} className="btn-tertiary">
            Skip Emotional Snapshot
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmotionalSnapshot;
