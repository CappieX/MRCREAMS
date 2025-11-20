import React, { useState } from 'react';
import './BasicInformation.css';

const BasicInformation = ({ onboardingData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    occupation: '',
    ...onboardingData.basicInfo
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.email) {
      onComplete({ basicInfo: formData });
    } else {
      alert('Please fill in your name and email to continue.');
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="basic-information">
      <div className="onboarding-header">
        <h1>Basic Information</h1>
        <p>Tell us a little about yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="basic-info-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange('dateOfBirth')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location (City, State/Country)</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={handleInputChange('location')}
              placeholder="e.g., New York, NY or London, UK"
            />
          </div>

          <div className="form-group">
            <label htmlFor="occupation">Occupation/Role</label>
            <input
              type="text"
              id="occupation"
              value={formData.occupation}
              onChange={handleInputChange('occupation')}
              placeholder="e.g., Software Engineer, Teacher, etc."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Privacy Note</h3>
          <p className="privacy-note">
            Your information is kept private and secure. We use it only to personalize your experience
            and provide relevant support. You can update or delete this information at any time.
          </p>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-secondary">
            Back
          </button>
          <button type="submit" className="btn-primary">
            Continue to Relationship Context
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicInformation;
