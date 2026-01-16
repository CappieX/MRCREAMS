import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import OnboardingLayout from '../components/OnboardingLayout';
import ProgressTracker from '../components/ProgressTracker';
import StepNavigation from '../components/StepNavigation';
import SaveProgressButton from '../components/SaveProgressButton';

const CLIENT_PRIMARY = '#00B4D8';
const CLIENT_SECONDARY = '#B3E9F3';

const emotionIcons = [
  { emotion: 'Calm', symbol: '😌' },
  { emotion: 'Hopeful', symbol: '🤞' },
  { emotion: 'Connected', symbol: '🤝' },
  { emotion: 'Grateful', symbol: '🙏' }
];

const testimonial = {
  name: 'Sarah & Michael',
  relationship: 'Married 3 years',
  quote:
    "MR.CREAMS helped us understand each other's emotions in ways we never could before. Our communication has transformed completely.",
  improvement: '85% better communication'
};

const ClientOnboarding = () => {
  const { updateProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    goals: [],
    relationshipStatus: '',
    relationshipDuration: '',
    hasChildren: false,
    emotionBaseline: '',
    privacySharing: 'standard',
    notificationEmail: true,
    notificationInApp: true
  });

  const steps = [
    'Welcome & Goals',
    'Relationship Profile',
    'Emotional Checkpoint',
    'Privacy Settings',
    'Success Setup',
    'Complete'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('onboarding_client');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.data) {
          setData(parsed.data);
        }
        if (typeof parsed.step === 'number') {
          setActiveStep(parsed.step);
        }
      } catch (e) {
      }
    }
  }, []);

  const persist = (nextStep, nextData) => {
    localStorage.setItem('onboarding_client', JSON.stringify({ step: nextStep, data: nextData }));
  };

  const handleFieldChange = (field) => (event) => {
    const value = field === 'hasChildren' || field.startsWith('notification')
      ? event.target.checked
      : event.target.value;
    setData((prev) => {
      const next = { ...prev, [field]: value };
      persist(activeStep, next);
      return next;
    });
  };

  const handleGoalsToggle = (goal) => () => {
    setData((prev) => {
      const current = prev.goals || [];
      const exists = current.includes(goal);
      const nextGoals = exists ? current.filter((g) => g !== goal) : [...current, goal];
      const next = { ...prev, goals: nextGoals };
      persist(activeStep, next);
      return next;
    });
  };

  const handleNext = () => {
    const nextStep = Math.min(activeStep + 1, steps.length - 1);
    setActiveStep(nextStep);
    persist(nextStep, data);
  };

  const handleBack = () => {
    const nextStep = Math.max(activeStep - 1, 0);
    setActiveStep(nextStep);
    persist(nextStep, data);
  };

  const handleSaveOnly = () => {
    persist(activeStep, data);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const payload = {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        onboardingStep: activeStep,
        relationshipContext: {
          status: data.relationshipStatus,
          duration: data.relationshipDuration,
          hasChildren: data.hasChildren
        },
        goalsPreferences: {
          goals: data.goals
        },
        emotionalSnapshot: {
          baselineEmotion: data.emotionBaseline
        },
        preferences: {
          notifications: {
            email: data.notificationEmail,
            inApp: data.notificationInApp
          },
          privacyLevel: data.privacySharing
        }
      };
      await updateProfile(payload);
      localStorage.removeItem('onboarding_client');
      window.location.href = '/dashboard';
    } catch (e) {
      setLoading(false);
      alert(e.message || 'Failed to complete onboarding');
    }
  };

  const goalsOptions = [
    'Improve communication',
    'Reduce conflicts',
    'Heal after conflict',
    'Strengthen emotional connection'
  ];

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Why are you here today?
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
            Choose what you would most like to improve in your relationship.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {goalsOptions.map((goal) => (
              <Chip
                key={goal}
                label={goal}
                onClick={handleGoalsToggle(goal)}
                color={data.goals.includes(goal) ? 'primary' : 'default'}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        </Box>
      );
    }
    if (activeStep === 1) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Relationship status"
              value={data.relationshipStatus}
              onChange={handleFieldChange('relationshipStatus')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="How long have you been together?"
              value={data.relationshipDuration}
              onChange={handleFieldChange('relationshipDuration')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.hasChildren}
                  onChange={handleFieldChange('hasChildren')}
                />
              }
              label="We have children together"
            />
          </Grid>
        </Grid>
      );
    }
    if (activeStep === 2) {
      return (
        <Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            In a few words, how are you feeling about your relationship right now?
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            value={data.emotionBaseline}
            onChange={handleFieldChange('emotionBaseline')}
          />
        </Box>
      );
    }
    if (activeStep === 3) {
      return (
        <Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Choose how much detail you want to share with therapists and future tools.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                SelectProps={{ native: true }}
                fullWidth
                label="Privacy level"
                value={data.privacySharing}
                onChange={handleFieldChange('privacySharing')}
              >
                <option value="standard">Standard sharing</option>
                <option value="minimal">Minimal data sharing</option>
                <option value="expanded">Expanded insights sharing</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.notificationEmail}
                    onChange={handleFieldChange('notificationEmail')}
                  />
                }
                label="Email notifications"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={data.notificationInApp}
                    onChange={handleFieldChange('notificationInApp')}
                  />
                }
                label="In-app notifications"
              />
            </Grid>
          </Grid>
        </Box>
      );
    }
    if (activeStep === 4) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Success setup
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            You are almost ready. We will use your answers to personalize your MR.CREAMS journey.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            You can update these settings anytime in your dashboard.
          </Typography>
        </Box>
      );
    }
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Welcome to your emotional wellness journey
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          {emotionIcons.map((icon) => (
            <Box key={icon.emotion} sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography variant="h3">{icon.symbol}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {icon.emotion}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            background: CLIENT_SECONDARY,
            padding: 3,
            borderRadius: 2,
            mb: 4
          }}
        >
          <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1.5 }}>
            "{testimonial.quote}"
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {testimonial.name}, {testimonial.relationship}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
            {testimonial.improvement}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          When you continue, we will take you to your dashboard where you can begin tracking
          emotions, sharing challenges, and exploring guidance tailored to you.
        </Typography>
      </Box>
    );
  };

  return (
    <OnboardingLayout
      title="Client Onboarding"
      subtitle="A gentle, guided start to your relationship healing journey."
      accentColor={CLIENT_PRIMARY}
      headerRight={<SaveProgressButton onClick={handleSaveOnly} disabled={loading} />}
    >
      <ProgressTracker
        steps={steps}
        activeStep={activeStep}
        primaryColor={CLIENT_PRIMARY}
        secondaryColor={CLIENT_SECONDARY}
      />
      {renderStep()}
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        onComplete={handleComplete}
        disableNext={false}
        isFirst={activeStep === 0}
        isLast={activeStep === steps.length - 1}
        loading={loading}
      />
    </OnboardingLayout>
  );
};

export default ClientOnboarding;
