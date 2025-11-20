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
  StepLabel
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  People as PeopleIcon,
  Favorite as HeartIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

const UserRegistration = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    
    // Step 2: Relationship Context
    userType: 'individual', // individual, couple
    relationshipStatus: '',
    partnerName: '',
    partnerEmail: '',
    
    // Step 3: Goals & Preferences
    goals: [],
    communicationStyle: '',
    timezone: '',
    
    // Step 4: Terms & Privacy
    agreeToTerms: false,
    agreeToPrivacy: false,
    marketingEmails: false
  });

  const steps = [
    'Basic Information',
    'Relationship Context', 
    'Goals & Preferences',
    'Terms & Privacy'
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

  const handleGoalsChange = (goal) => (event) => {
    if (event.target.checked) {
      setFormData({
        ...formData,
        goals: [...formData.goals, goal]
      });
    } else {
      setFormData({
        ...formData,
        goals: formData.goals.filter(g => g !== goal)
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
    console.log('Registration data:', formData);
    
    // For now, just navigate to dashboard
    navigate('/dashboard');
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
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
              />
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
              <FormControl fullWidth>
                <InputLabel>I am registering as</InputLabel>
                <Select
                  value={formData.userType}
                  onChange={handleInputChange('userType')}
                  label="I am registering as"
                >
                  <MenuItem value="individual">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon sx={{ fontSize: 20 }} />
                      Individual (Single or Dating)
                    </Box>
                  </MenuItem>
                  <MenuItem value="couple">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HeartIcon sx={{ fontSize: 20 }} />
                      Couple (Together)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {formData.userType === 'couple' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Partner's Name"
                    value={formData.partnerName}
                    onChange={handleInputChange('partnerName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Partner's Email (Optional)"
                    type="email"
                    value={formData.partnerEmail}
                    onChange={handleInputChange('partnerEmail')}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Relationship Status</InputLabel>
                <Select
                  value={formData.relationshipStatus}
                  onChange={handleInputChange('relationshipStatus')}
                  label="Relationship Status"
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="dating">Dating</MenuItem>
                  <MenuItem value="engaged">Engaged</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                  <MenuItem value="committed">In a Committed Relationship</MenuItem>
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
                What are your relationship goals?
              </Typography>
              <Grid container spacing={2}>
                {[
                  'Improve communication',
                  'Resolve conflicts better',
                  'Increase emotional intimacy',
                  'Build trust',
                  'Enhance understanding',
                  'Strengthen connection',
                  'Learn conflict resolution',
                  'Develop empathy'
                ].map((goal) => (
                  <Grid item xs={12} sm={6} key={goal}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.goals.includes(goal)}
                          onChange={handleGoalsChange(goal)}
                        />
                      }
                      label={goal}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Communication Style</InputLabel>
                <Select
                  value={formData.communicationStyle}
                  onChange={handleInputChange('communicationStyle')}
                  label="Communication Style"
                >
                  <MenuItem value="direct">Direct and straightforward</MenuItem>
                  <MenuItem value="gentle">Gentle and considerate</MenuItem>
                  <MenuItem value="analytical">Analytical and logical</MenuItem>
                  <MenuItem value="emotional">Emotional and expressive</MenuItem>
                  <MenuItem value="mixed">Mixed approach</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Terms & Privacy
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
                        Terms of Service
                      </Button>
                      {' '}and understand how MR.CREAMS works
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
                      {' '}and understand how my data is protected
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
                      I'd like to receive helpful relationship tips and updates via email (optional)
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
          background: `linear-gradient(135deg, ${alpha('#4A90E2', 0.1)} 0%, ${alpha('#8B5FBF', 0.1)} 100%)`,
          borderBottom: `1px solid ${alpha('#4A90E2', 0.1)}`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/auth-select')}
              sx={{ color: '#4A90E2' }}
            >
              Back
            </Button>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A90E2' }}>
              Create Your Account
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
              background: `linear-gradient(135deg, ${alpha('#4A90E2', 0.1)} 0%, ${alpha('#8B5FBF', 0.1)} 100%)`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
              Join MR.CREAMS
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Let's get to know you and your relationship goals
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
                sx={{ color: '#4A90E2' }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  endIcon={<PsychologyIcon />}
                  disabled={!formData.agreeToTerms || !formData.agreeToPrivacy}
                  sx={{
                    bgcolor: '#4A90E2',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#357ABD'
                    }
                  }}
                >
                  Complete Registration
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#4A90E2',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#357ABD'
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
            Already have an account?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/login')}
              sx={{ color: '#4A90E2' }}
            >
              Sign in here
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default UserRegistration;
