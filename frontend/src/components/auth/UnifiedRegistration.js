import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthPageShell, NotificationBanner } from '../custom/CustomUI';
import { BrandButton } from '../custom/Button';
import { BrandInput } from '../custom/Input';
import { BrandText } from '../custom/Typography';
import { BRAND_COLORS, BRAND_SPACING, BRAND_RADII } from '../../assets/brand';

const UnifiedRegistration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [userType, setUserType] = useState('individual'); // 'individual', 'company', 'therapist'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    // Common fields for all user types
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeToTerms: false,
    agreeToPrivacy: false,

    // Individual-specific fields
    relationshipStatus: '',
    age: '',

    // Company-specific fields
    companyName: '',
    companySize: '',
    industry: '',
    professionalRole: '',

    // Therapist-specific fields
    licenseNumber: '',
    yearsOfExperience: '',
    credentials: [],
    specializations: [],
    languages: []
  });

  // User type configuration
  const userTypes = [
    {
      id: 'individual',
      title: 'Individual / Couple',
      description: 'For personal relationship improvement',
      steps: ['Account Type', 'Basic Information', 'Relationship Context', 'Terms & Privacy'],
      icon: '👤'
    },
    {
      id: 'company',
      title: 'Company / Organization',
      description: 'For employee wellness programs',
      steps: ['Account Type', 'Company Information', 'Admin Account', 'Terms & Privacy'],
      icon: '🏢'
    },
    {
      id: 'therapist',
      title: 'Therapist / Professional',
      description: 'For licensed professionals',
      steps: ['Account Type', 'Professional Info', 'Credentials', 'Terms & Verification'],
      icon: '🧠'
    }
  ];

  const currentConfig = userTypes.find(type => type.id === userType) || userTypes[0];

  const relationshipStatuses = ['Single', 'Dating', 'Engaged', 'Married', 'Separated', 'Divorced'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Other'];
  const professionalRoles = ['Therapist', 'Counselor', 'Admin', 'Support', 'Executive', 'Other'];
  const credentials = ['LMFT', 'LCSW', 'LPC', 'PhD/PsyD', 'Relationship Coach', 'Other License'];
  const specializations = ['Couples Therapy', 'Family Therapy', 'Individual Counseling', 'Relationship Coaching'];

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleArrayChange = (field) => (item) => (event) => {
    const currentArray = formData[field] || [];
    if (event.target.checked) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, item]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter(i => i !== item)
      }));
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('an uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('a lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('a number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('a special character');
    }
    
    if (errors.length === 0) {
      return { isValid: true };
    }
    
    return {
      isValid: false,
      error: `Password must contain ${errors.join(', ')}`
    };
  };

  const validateStep = (step) => {
    setError('');

    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      // Validate password complexity (must match backend requirements)
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error);
        return false;
      }
    }

    if (step === 2) {
      if (userType === 'individual' && !formData.relationshipStatus) {
        setError('Please select your relationship status');
        return false;
      }
      if (userType === 'company' && (!formData.companyName || !formData.professionalRole)) {
        setError('Please fill in all required company information');
        return false;
      }
      if (userType === 'therapist' && (!formData.licenseNumber || !formData.yearsOfExperience)) {
        setError('Please fill in all required professional information');
        return false;
      }
    }

    if (step === 3 && (!formData.agreeToTerms || !formData.agreeToPrivacy)) {
      setError('Please agree to the terms and privacy policy');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Prepare data for database
      const userData = {
        email: formData.email,
        name: formData.fullName || formData.email.split('@')[0],
        userType: userType,
        onboardingCompleted: false,
        metadata: {}
      };

      // Add user-type specific data
      if (userType === 'individual') {
        userData.metadata = {
          relationshipStatus: formData.relationshipStatus,
          age: formData.age
        };
      } else if (userType === 'company') {
        userData.metadata = {
          companyName: formData.companyName,
          companySize: formData.companySize,
          industry: formData.industry,
          professionalRole: formData.professionalRole
        };
      } else if (userType === 'therapist') {
        userData.metadata = {
          licenseNumber: formData.licenseNumber,
          yearsOfExperience: formData.yearsOfExperience,
          credentials: formData.credentials,
          specializations: formData.specializations,
          languages: formData.languages,
          status: 'pending_verification'
        };
      }

      // Register user - this will save to database via AuthContext
      await register(formData.email, formData.password, userData);

      const tempPayload = {
        email: formData.email,
        name: formData.fullName || formData.email.split('@')[0],
        userType,
        relationshipStatus: formData.relationshipStatus,
        age: formData.age,
        companyName: formData.companyName,
        companySize: formData.companySize,
        industry: formData.industry,
        professionalRole: formData.professionalRole,
        licenseNumber: formData.licenseNumber,
        yearsOfExperience: formData.yearsOfExperience,
        credentials: formData.credentials,
        specializations: formData.specializations,
        languages: formData.languages
      };
      localStorage.setItem('onboarding_temp_data', JSON.stringify({ step: 0, data: tempPayload }));
      if (userType === 'therapist') {
        navigate('/onboarding/therapist');
      } else if (userType === 'company') {
        navigate('/onboarding/professional');
      } else {
        navigate('/onboarding/client');
      }

    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: BRAND_SPACING.sm
            }}
          >
            <BrandText variant="h4">
              How will you be using MR.CREAMS?
            </BrandText>
            <BrandText variant="body" tone="muted">
              Choose the option that best describes how you plan to use the platform.
            </BrandText>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: BRAND_SPACING.sm,
                marginTop: BRAND_SPACING.sm
              }}
            >
              {userTypes.map((type) => {
                const selected = userType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: BRAND_RADII.lg,
                      border: selected
                        ? `2px solid ${BRAND_COLORS.teal}`
                        : '1px solid rgba(10,37,64,0.14)',
                      backgroundColor: selected
                        ? 'rgba(0,180,216,0.06)'
                        : '#ffffff',
                      padding: BRAND_SPACING.md,
                      display: 'flex',
                      alignItems: 'center',
                      gap: BRAND_SPACING.sm,
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: BRAND_RADII.lg,
                        backgroundColor: 'rgba(0,180,216,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20
                      }}
                    >
                      {type.icon}
                    </div>
                    <div>
                      <BrandText
                        variant="h5"
                        style={{
                          marginBottom: 2
                        }}
                      >
                        {type.title}
                      </BrandText>
                      <BrandText variant="caption" tone="muted">
                        {type.description}
                      </BrandText>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: BRAND_SPACING.sm
            }}
          >
            <BrandInput
              label="Full name"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              hint="We will use this to personalize your experience."
            />
            <BrandInput
              label="Email address"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange('email')}
            />
            <div>
              <BrandInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange('password')}
              />
              <div
                style={{
                  marginTop: 6,
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <button
                  type="button"
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: 0.04,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    color: 'rgba(0,180,216,0.9)'
                  }}
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
              </div>
            </div>
            <BrandInput
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
            />
          </div>
        );

      case 2:
        if (userType === 'individual') {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: BRAND_SPACING.sm
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: 'rgba(10,37,64,0.85)'
                }}
              >
                <div
                  style={{
                    marginBottom: 4
                  }}
                >
                  Relationship status
                </div>
                <select
                  value={formData.relationshipStatus}
                  onChange={handleInputChange('relationshipStatus')}
                  style={{
                    width: '100%',
                    borderRadius: BRAND_RADII.lg,
                    border: '1px solid rgba(10,37,64,0.22)',
                    padding: '10px 12px',
                    fontSize: 14
                  }}
                >
                  <option value="">Select your status</option>
                  {relationshipStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <BrandInput
                label="Age (optional)"
                type="number"
                value={formData.age}
                onChange={handleInputChange('age')}
              />
            </div>
          );
        }

        if (userType === 'company') {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: BRAND_SPACING.sm
              }}
            >
              <BrandInput
                label="Company name"
                required
                value={formData.companyName}
                onChange={handleInputChange('companyName')}
              />
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: 'rgba(10,37,64,0.85)'
                }}
              >
                <div
                  style={{
                    marginBottom: 4
                  }}
                >
                  Company size
                </div>
                <select
                  value={formData.companySize}
                  onChange={handleInputChange('companySize')}
                  style={{
                    width: '100%',
                    borderRadius: BRAND_RADII.lg,
                    border: '1px solid rgba(10,37,64,0.22)',
                    padding: '10px 12px',
                    fontSize: 14
                  }}
                >
                  <option value="">Select a range</option>
                  {companySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: 'rgba(10,37,64,0.85)'
                }}
              >
                <div
                  style={{
                    marginBottom: 4
                  }}
                >
                  Industry
                </div>
                <select
                  value={formData.industry}
                  onChange={handleInputChange('industry')}
                  style={{
                    width: '100%',
                    borderRadius: BRAND_RADII.lg,
                    border: '1px solid rgba(10,37,64,0.22)',
                    padding: '10px 12px',
                    fontSize: 14
                  }}
                >
                  <option value="">Select an industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </label>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: 'rgba(10,37,64,0.85)'
                }}
              >
                <div
                  style={{
                    marginBottom: 4
                  }}
                >
                  Your role
                </div>
                <select
                  value={formData.professionalRole}
                  onChange={handleInputChange('professionalRole')}
                  style={{
                    width: '100%',
                    borderRadius: BRAND_RADII.lg,
                    border: '1px solid rgba(10,37,64,0.22)',
                    padding: '10px 12px',
                    fontSize: 14
                  }}
                >
                  <option value="">Select a role</option>
                  {professionalRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        }

        if (userType === 'therapist') {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: BRAND_SPACING.sm
              }}
            >
              <BrandInput
                label="License number"
                required
                value={formData.licenseNumber}
                onChange={handleInputChange('licenseNumber')}
              />
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: 'rgba(10,37,64,0.85)'
                }}
              >
                <div
                  style={{
                    marginBottom: 4
                  }}
                >
                  Years of experience
                </div>
                <select
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange('yearsOfExperience')}
                  style={{
                    width: '100%',
                    borderRadius: BRAND_RADII.lg,
                    border: '1px solid rgba(10,37,64,0.22)',
                    padding: '10px 12px',
                    fontSize: 14
                  }}
                >
                  <option value="">Select a range</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="16-20">16-20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </label>
              <div>
                <BrandText
                  variant="h6"
                  style={{
                    marginBottom: 6
                  }}
                >
                  Credentials
                </BrandText>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 8
                  }}
                >
                  {credentials.map((credential) => (
                    <label
                      key={credential}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={(formData.credentials || []).includes(credential)}
                        onChange={handleArrayChange('credentials')(credential)}
                      />
                      <span>{credential}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <BrandText
                  variant="h6"
                  style={{
                    marginBottom: 6
                  }}
                >
                  Specializations
                </BrandText>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 8
                  }}
                >
                  {specializations.map((specialization) => (
                    <label
                      key={specialization}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={(formData.specializations || []).includes(specialization)}
                        onChange={handleArrayChange('specializations')(specialization)}
                      />
                      <span>{specialization}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return null;

      case 3:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: BRAND_SPACING.sm
            }}
          >
            {userType === 'therapist' && (
              <NotificationBanner
                tone="blue"
                title="Verification required"
                message="Your professional account will be reviewed within 1-2 business days. You will receive an email once approved."
              />
            )}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 13,
                color: 'rgba(10,37,64,0.85)'
              }}
            >
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange('agreeToTerms')}
                style={{
                  marginTop: 3
                }}
              />
              <span>
                I agree to the Terms of Service and understand my responsibilities.
              </span>
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 13,
                color: 'rgba(10,37,64,0.85)'
              }}
            >
              <input
                type="checkbox"
                checked={formData.agreeToPrivacy}
                onChange={handleCheckboxChange('agreeToPrivacy')}
                style={{
                  marginTop: 3
                }}
              />
              <span>
                I agree to the Privacy Policy and understand how my data is protected.
              </span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepHeader = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: BRAND_SPACING.md
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        <BrandText variant="caption" tone="muted">
          Registration progress
        </BrandText>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          {currentConfig.steps.map((label, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    border: isActive || isCompleted
                      ? `1px solid ${BRAND_COLORS.teal}`
                      : '1px solid rgba(15,23,42,0.2)',
                    backgroundColor: isCompleted
                      ? BRAND_COLORS.teal
                      : isActive
                      ? 'rgba(0,180,216,0.08)'
                      : '#ffffff',
                    color: isCompleted ? '#ffffff' : 'rgba(15,23,42,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  {index + 1}
                </div>
                <BrandText
                  variant="caption"
                  tone={isActive ? 'soft' : 'muted'}
                >
                  {label}
                </BrandText>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const isLastStep = activeStep === currentConfig.steps.length - 1;

  return (
    <AuthPageShell
      title="Join MR.CREAMS"
      subtitle="Start your journey to better relationships."
      footer={
        <div
          style={{
            textAlign: 'center'
          }}
        >
          <BrandText variant="caption" tone="muted">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                border: 'none',
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
                color: 'rgba(15,23,42,0.9)',
                textDecoration: 'underline'
              }}
            >
              Sign in here
            </button>
          </BrandText>
        </div>
      }
    >
      {renderStepHeader()}
      {error && (
        <div
          style={{
            marginBottom: BRAND_SPACING.sm
          }}
        >
          <NotificationBanner
            tone="coral"
            title="Check your details"
            message={error}
          />
        </div>
      )}
      <div
        style={{
          marginBottom: BRAND_SPACING.md
        }}
      >
        {renderStepContent(activeStep)}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: BRAND_SPACING.sm
        }}
      >
        <BrandButton
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={activeStep === 0 || isSubmitting}
        >
          Back
        </BrandButton>
        <BrandButton
          type="button"
          onClick={isLastStep ? handleSubmit : handleNext}
          disabled={isSubmitting}
          style={{
            minWidth: 140
          }}
        >
          {isSubmitting
            ? 'Creating account...'
            : isLastStep
            ? 'Create account'
            : 'Next'}
        </BrandButton>
      </div>
    </AuthPageShell>
  );
};

export default UnifiedRegistration;
