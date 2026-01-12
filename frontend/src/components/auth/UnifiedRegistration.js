import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  FormControlLabel,
  Checkbox,
  Paper,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Alert,
  RadioGroup,
  Radio,
  FormLabel,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

const UnifiedRegistration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
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
      icon: <PersonIcon />
    },
    {
      id: 'company',
      title: 'Company / Organization',
      description: 'For employee wellness programs',
      steps: ['Account Type', 'Company Information', 'Admin Account', 'Terms & Privacy'],
      icon: <BusinessIcon />
    },
    {
      id: 'therapist',
      title: 'Therapist / Professional',
      description: 'For licensed professionals',
      steps: ['Account Type', 'Professional Info', 'Credentials', 'Terms & Verification'],
      icon: <PsychologyIcon />
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

      // User will be automatically redirected to appropriate onboarding
      // based on userType and onboardingCompleted status

    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Account Type Selection
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold' }}>
                  How will you be using MR.CREAMS?
                </FormLabel>
                <RadioGroup
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  {userTypes.map((type) => (
                    <FormControlLabel
                      key={type.id}
                      value={type.id}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                          <Box sx={{ color: theme.palette.primary.main }}>
                            {type.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {type.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        border: `2px solid ${
                          userType === type.id
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                        borderRadius: 2,
                        mb: 2,
                        '&.Mui-checked': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.04)
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1: // Basic Information (Common)
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={handleInputChange('fullName')}
                helperText="We'll use this to personalize your experience"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
              />
            </Grid>
          </Grid>
        );

      case 2: // User Type Specific Information
        if (userType === 'individual') {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Relationship Status</InputLabel>
                  <Select
                    value={formData.relationshipStatus}
                    onChange={handleInputChange('relationshipStatus')}
                    label="Relationship Status"
                  >
                    {relationshipStatuses.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Age (Optional)"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange('age')}
                />
              </Grid>
            </Grid>
          );
        } else if (userType === 'company') {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange('companyName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Company Size</InputLabel>
                  <Select
                    value={formData.companySize}
                    onChange={handleInputChange('companySize')}
                    label="Company Size"
                  >
                    {companySizes.map(size => (
                      <MenuItem key={size} value={size}>{size}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={formData.industry}
                    onChange={handleInputChange('industry')}
                    label="Industry"
                  >
                    {industries.map(industry => (
                      <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Your Role</InputLabel>
                  <Select
                    value={formData.professionalRole}
                    onChange={handleInputChange('professionalRole')}
                    label="Your Role"
                  >
                    {professionalRoles.map(role => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          );
        } else if (userType === 'therapist') {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="License Number"
                  value={formData.licenseNumber}
                  onChange={handleInputChange('licenseNumber')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Years of Experience</InputLabel>
                  <Select
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange('yearsOfExperience')}
                    label="Years of Experience"
                  >
                    <MenuItem value="0-1">0-1 years</MenuItem>
                    <MenuItem value="2-5">2-5 years</MenuItem>
                    <MenuItem value="6-10">6-10 years</MenuItem>
                    <MenuItem value="11-15">11-15 years</MenuItem>
                    <MenuItem value="16-20">16-20 years</MenuItem>
                    <MenuItem value="20+">20+ years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Credentials
                </Typography>
                <Grid container spacing={1}>
                  {credentials.map(credential => (
                    <Grid item xs={12} sm={6} key={credential}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={(formData.credentials || []).includes(credential)}
                            onChange={handleArrayChange('credentials')(credential)}
                          />
                        }
                        label={credential}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Specializations
                </Typography>
                <Grid container spacing={1}>
                  {specializations.map(specialization => (
                    <Grid item xs={12} sm={6} key={specialization}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={(formData.specializations || []).includes(specialization)}
                            onChange={handleArrayChange('specializations')(specialization)}
                          />
                        }
                        label={specialization}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          );
        }
        return null;

      case 3: // Terms & Privacy (Common)
        return (
          <Grid container spacing={3}>
            {userType === 'therapist' && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="subtitle2" fontWeight="bold">
                    Verification Required
                  </Typography>
                  <Typography variant="body2">
                    Your professional account will be reviewed within 1-2 business days.
                    You'll receive email notification once approved.
                  </Typography>
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange('agreeToTerms')}
                  />
                }
                label="I agree to the Terms of Service and understand my responsibilities"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeToPrivacy}
                    onChange={handleCheckboxChange('agreeToPrivacy')}
                  />
                }
                label="I agree to the Privacy Policy and understand how data is protected"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)` ,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Join MR.CREAMS
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start your journey to better relationships
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {currentConfig.steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>

              {activeStep === currentConfig.steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Next
                </Button>
              )}
            </Box>

            {/* Login Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  Sign in here
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default UnifiedRegistration;
