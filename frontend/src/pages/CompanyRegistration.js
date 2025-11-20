import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  Support as SupportIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Professional Information
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    professionalRole: '',
    
    // Step 2: Organization Details
    organizationName: '',
    organizationType: '',
    licenseNumber: '',
    yearsOfExperience: '',
    
    // Step 3: Professional Credentials
    credentials: [],
    specializations: [],
    languages: [],
    
    // Step 4: Terms & Verification
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToVerification: false,
    marketingEmails: false
  });

  const steps = [
    'Professional Information',
    'Organization Details',
    'Credentials & Specializations',
    'Terms & Verification'
  ];

  const professionalRoles = [
    { value: 'therapist', label: 'Licensed Therapist', icon: <PsychologyIcon /> },
    { value: 'counselor', label: 'Relationship Counselor', icon: <PsychologyIcon /> },
    { value: 'admin', label: 'System Administrator', icon: <AdminIcon /> },
    { value: 'support', label: 'Customer Support', icon: <SupportIcon /> },
    { value: 'executive', label: 'Executive/Management', icon: <BusinessIcon /> },
    { value: 'other', label: 'Other Professional Role', icon: <BusinessIcon /> }
  ];

  const organizationTypes = [
    'Private Practice',
    'Mental Health Clinic',
    'Counseling Center',
    'Hospital/Medical Center',
    'Educational Institution',
    'Corporate Organization',
    'Non-Profit Organization',
    'Government Agency',
    'Other'
  ];

  const availableCredentials = [
    'Licensed Marriage and Family Therapist (LMFT)',
    'Licensed Clinical Social Worker (LCSW)',
    'Licensed Professional Counselor (LPC)',
    'Licensed Psychologist (PhD/PsyD)',
    'Certified Relationship Coach',
    'Certified Family Therapist',
    'Other Professional License'
  ];

  const specializations = [
    'Couples Therapy',
    'Family Therapy',
    'Individual Counseling',
    'Marriage Counseling',
    'Relationship Coaching',
    'Conflict Resolution',
    'Communication Skills',
    'Emotional Intelligence',
    'Trauma Therapy',
    'Addiction Counseling',
    'Premarital Counseling',
    'Divorce Mediation'
  ];

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.checked
    });
  };

  const handleArrayChange = (field) => (item) => (event) => {
    if (event.target.checked) {
      setFormData({
        ...formData,
        [field]: [...formData[field], item]
      });
    } else {
      setFormData({
        ...formData,
        [field]: formData[field].filter(i => i !== item)
      });
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Company registration data:', formData);
    
    // For now, show pending approval message
    navigate('/registration-pending');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                helperText="Use your professional email address"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Professional Role</InputLabel>
                <Select
                  value={formData.professionalRole}
                  onChange={handleInputChange('professionalRole')}
                  label="Professional Role"
                >
                  {professionalRoles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {role.icon}
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization Name"
                value={formData.organizationName}
                onChange={handleInputChange('organizationName')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Organization Type</InputLabel>
                <Select
                  value={formData.organizationType}
                  onChange={handleInputChange('organizationType')}
                  label="Organization Type"
                >
                  {organizationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Professional License Number"
                value={formData.licenseNumber}
                onChange={handleInputChange('licenseNumber')}
                helperText="If applicable"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Professional Credentials
              </Typography>
              <Grid container spacing={2}>
                {availableCredentials.map((credential) => (
                  <Grid item xs={12} sm={6} key={credential}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.credentials.includes(credential)}
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
                Areas of Specialization
              </Typography>
              <Grid container spacing={2}>
                {specializations.map((specialization) => (
                  <Grid item xs={12} sm={6} key={specialization}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.specializations.includes(specialization)}
                          onChange={handleArrayChange('specializations')(specialization)}
                        />
                      }
                      label={specialization}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Languages Spoken (comma-separated)"
                value={formData.languages.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  languages: e.target.value.split(',').map(lang => lang.trim()).filter(lang => lang)
                })}
                helperText="e.g., English, Spanish, French"
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Verification Process
                </Typography>
                <Typography variant="body2">
                  Your professional account will be reviewed by our team within 1-2 business days. 
                  You'll receive an email notification once your account is approved.
                </Typography>
              </Alert>
              
              <Typography variant="h6" gutterBottom>
                Terms & Verification
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onChange={handleCheckboxChange('agreeToTerms')}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                        Professional Terms of Service
                      </Button>
                      {' '}and understand my responsibilities as a professional user
                    </Typography>
                  }
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeToPrivacy}
                      onChange={handleCheckboxChange('agreeToPrivacy')}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Button variant="text" size="small" sx={{ p: 0, minWidth: 'auto' }}>
                        Privacy Policy
                      </Button>
                      {' '}and understand how client data is protected
                    </Typography>
                  }
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeToVerification}
                      onChange={handleCheckboxChange('agreeToVerification')}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I understand that my professional credentials will be verified before account approval
                    </Typography>
                  }
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.marketingEmails}
                      onChange={handleCheckboxChange('marketingEmails')}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I'd like to receive professional updates and training opportunities via email (optional)
                    </Typography>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          py: 3,
          background: `linear-gradient(135deg, ${alpha('#8B5FBF', 0.1)} 0%, ${alpha('#4A90E2', 0.1)} 100%)`,
          borderBottom: `1px solid ${alpha('#8B5FBF', 0.1)}`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/auth-select')}
              sx={{ color: '#8B5FBF' }}
            >
              Back
            </Button>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#8B5FBF' }}>
              Professional Registration
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha('#8B5FBF', 0.1)} 0%, ${alpha('#4A90E2', 0.1)} 100%)`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
              Join MR.CREAMS Professional
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Help others build stronger relationships with our professional tools
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{ color: '#8B5FBF' }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  endIcon={<BusinessIcon />}
                  disabled={!formData.agreeToTerms || !formData.agreeToPrivacy || !formData.agreeToVerification}
                  sx={{
                    bgcolor: '#8B5FBF',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#7B4F9F'
                    }
                  }}
                >
                  Submit for Review
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#8B5FBF',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#7B4F9F'
                    }
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have a professional account?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/login')}
              sx={{ color: '#8B5FBF' }}
            >
              Sign in here
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyRegistration;
