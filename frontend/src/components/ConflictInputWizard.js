import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  Insights as InsightsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const ConflictInputWizard = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [conflictData, setConflictData] = useState({
    // Step 1: Basic Information
    title: '',
    description: '',
    category: '',
    
    // Step 2: Context
    when: '',
    where: '',
    who: '',
    trigger: '',
    
    // Step 3: Emotions
    emotions: [],
    intensity: 5,
    
    // Step 4: Impact
    impact: '',
    resolutionAttempts: '',
    desiredOutcome: ''
  });

  const steps = [
    'Describe the Situation',
    'Add Context',
    'Express Emotions',
    'Define Impact & Goals'
  ];

  const categories = [
    'Communication Issues',
    'Financial Disagreements',
    'Family Dynamics',
    'Intimacy & Connection',
    'Household Responsibilities',
    'Personal Boundaries',
    'Future Planning',
    'Trust Issues',
    'Other'
  ];

  const emotions = [
    { id: 'frustrated', label: 'Frustrated', color: '#FF6B6B' },
    { id: 'hurt', label: 'Hurt', color: '#4A90E2' },
    { id: 'angry', label: 'Angry', color: '#FF8A65' },
    { id: 'sad', label: 'Sad', color: '#8B5FBF' },
    { id: 'confused', label: 'Confused', color: '#FFB74D' },
    { id: 'disappointed', label: 'Disappointed', color: '#81C784' },
    { id: 'worried', label: 'Worried', color: '#4ECDC4' },
    { id: 'lonely', label: 'Lonely', color: '#9C27B0' }
  ];

  const impactLevels = [
    'Minor - Small disagreement',
    'Moderate - Affecting daily life',
    'Major - Significant relationship strain',
    'Critical - Threatening relationship stability'
  ];

  const handleInputChange = (field) => (event) => {
    setConflictData({
      ...conflictData,
      [field]: event.target.value
    });
  };

  const handleEmotionToggle = (emotion) => {
    const currentEmotions = conflictData.emotions;
    if (currentEmotions.includes(emotion.id)) {
      setConflictData({
        ...conflictData,
        emotions: currentEmotions.filter(e => e !== emotion.id)
      });
    } else {
      setConflictData({
        ...conflictData,
        emotions: [...currentEmotions, emotion.id]
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
    console.log('Conflict data submitted:', conflictData);
    // Here you would typically send the data to your backend
    alert('Conflict submitted successfully! You will receive AI analysis and recommendations soon.');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brief Title"
                value={conflictData.title}
                onChange={handleInputChange('title')}
                placeholder="e.g., Disagreement about household chores"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={conflictData.category}
                  onChange={handleInputChange('category')}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Describe the situation"
                value={conflictData.description}
                onChange={handleInputChange('description')}
                placeholder="Describe what happened in your own words. Be as specific as you feel comfortable..."
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="When did this happen?"
                value={conflictData.when}
                onChange={handleInputChange('when')}
                placeholder="e.g., Yesterday evening, Last week"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Where did this occur?"
                value={conflictData.where}
                onChange={handleInputChange('where')}
                placeholder="e.g., At home, In the car"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Who was involved?"
                value={conflictData.who}
                onChange={handleInputChange('who')}
                placeholder="e.g., Just me and my partner, Family members"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="What triggered this situation?"
                value={conflictData.trigger}
                onChange={handleInputChange('trigger')}
                placeholder="Describe what led to this conflict or disagreement..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                What emotions are you experiencing?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select all that apply - this helps us understand your emotional state
              </Typography>
              
              <Grid container spacing={2}>
                {emotions.map((emotion) => (
                  <Grid item xs={6} sm={4} md={3} key={emotion.id}>
                    <Chip
                      label={emotion.label}
                      onClick={() => handleEmotionToggle(emotion)}
                      variant={conflictData.emotions.includes(emotion.id) ? 'filled' : 'outlined'}
                      sx={{
                        width: '100%',
                        bgcolor: conflictData.emotions.includes(emotion.id) ? alpha(emotion.color, 0.1) : 'transparent',
                        borderColor: emotion.color,
                        color: conflictData.emotions.includes(emotion.id) ? emotion.color : 'text.secondary',
                        '&:hover': {
                          bgcolor: alpha(emotion.color, 0.1)
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                How intense are these feelings? (1-10)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <Button
                    key={value}
                    variant={conflictData.intensity === value ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setConflictData({ ...conflictData, intensity: value })}
                    sx={{
                      minWidth: 40,
                      bgcolor: conflictData.intensity === value ? '#4A90E2' : 'transparent',
                      borderColor: '#4A90E2',
                      color: conflictData.intensity === value ? 'white' : '#4A90E2'
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>How is this affecting your relationship?</InputLabel>
                <Select
                  value={conflictData.impact}
                  onChange={handleInputChange('impact')}
                  label="How is this affecting your relationship?"
                >
                  {impactLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Have you tried to resolve this before?"
                value={conflictData.resolutionAttempts}
                onChange={handleInputChange('resolutionAttempts')}
                placeholder="Describe any previous attempts to address this issue..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="What would you like to see happen?"
                value={conflictData.desiredOutcome}
                onChange={handleInputChange('desiredOutcome')}
                placeholder="Describe your ideal resolution or outcome..."
              />
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'text.primary', textAlign: 'center' }}>
        Share Your Relationship Challenge
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Help us understand your situation so we can provide personalized insights and recommendations.
      </Typography>

      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha('#4A90E2', 0.1)} 0%, ${alpha('#8B5FBF', 0.1)} 100%)`,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
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
                endIcon={<CheckCircleIcon />}
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
                Submit Challenge
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

      {/* Progress Indicator */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: alpha('#4ECDC4', 0.05) }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#4ECDC4' }}>
          What happens next?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PsychologyIcon sx={{ color: '#4ECDC4', mr: 1 }} />
          <Typography variant="body2">AI analyzes your emotional patterns and conflict dynamics</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InsightsIcon sx={{ color: '#4ECDC4', mr: 1 }} />
          <Typography variant="body2">Personalized recommendations are generated</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ChatIcon sx={{ color: '#4ECDC4', mr: 1 }} />
          <Typography variant="body2">You receive actionable steps for resolution</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConflictInputWizard;
