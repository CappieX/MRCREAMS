import React, { useState } from 'react';
import './UserTypeSelection.css';

const UserTypeSelection = ({ onComplete }) => {
  const [selectedType, setSelectedType] = useState(null);

  const userTypes = [
    {
      id: 'single_man',
      label: 'Single Man',
      description: 'Building emotional awareness and preparing for healthy relationships',
      icon: '👨',
      color: '#4A90E2'
    },
    {
      id: 'single_woman',
      label: 'Single Woman',
      description: 'Healing, self-discovery, and preparing for emotional intimacy',
      icon: '👩',
      color: '#8B5FBF'
    },
    {
      id: 'married_man',
      label: 'Married Man',
      description: 'Improving communication and strengthening your relationship',
      icon: '👰‍♂️',
      color: '#10B981'
    },
    {
      id: 'married_woman',
      label: 'Married Woman',
      description: 'Feeling heard and restoring emotional connection',
      icon: '👰‍♀️',
      color: '#F59E0B'
    },
    {
      id: 'recently_separated',
      label: 'Recently Separated',
      description: 'Healing and rebuilding after relationship changes',
      icon: '💔',
      color: '#EF4444'
    }
  ];

  const handleSelect = (userType) => {
    setSelectedType(userType);
    onComplete({ userType });
  };

  return (
    <div className="user-type-selection">
      <div className="onboarding-header">
        <h1>Welcome to MR.CREAMS</h1>
        <p>Let's start by understanding your relationship status</p>
      </div>

      <div className="user-types-grid">
        {userTypes.map(userType => (
          <div
            key={userType.id}
            className={`user-type-card ${selectedType?.id === userType.id ? 'selected' : ''}`}
            onClick={() => handleSelect(userType)}
          >
            <div className="user-type-icon" style={{ backgroundColor: userType.color }}>
              {userType.icon}
            </div>
            <h3>{userType.label}</h3>
            <p>{userType.description}</p>
            {selectedType?.id === userType.id && (
              <div className="selected-indicator">✓ Selected</div>
            )}
          </div>
        ))}
      </div>

      {selectedType && (
        <div className="selection-confirmation">
          <p>You've selected: <strong>{selectedType.label}</strong></p>
          <p className="confirmation-note">
            This helps us personalize your experience. You can change this later in settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTypeSelection;
