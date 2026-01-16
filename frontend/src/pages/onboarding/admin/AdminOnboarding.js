import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import OnboardingLayout from '../components/OnboardingLayout';
import ProgressTracker from '../components/ProgressTracker';
import StepNavigation from '../components/StepNavigation';
import SaveProgressButton from '../components/SaveProgressButton';

const ADMIN_PRIMARY = '#6C757D';
const ADMIN_SECONDARY = '#E9ECEF';

const AdminOnboarding = () => {
  const { updateProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    systemName: '',
    defaultPolicies: '',
    escalationRules: ''
  });

  const steps = ['System Configuration', 'Policies', 'Complete'];

  useEffect(() => {
    const stored = localStorage.getItem('onboarding_admin');
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
    localStorage.setItem('onboarding_admin', JSON.stringify({ step: nextStep, data: nextData }));
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setData((prev) => {
      const next = { ...prev, [field]: value };
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
        onboardingData: {
          adminSettings: {
            systemName: data.systemName,
            defaultPolicies: data.defaultPolicies,
            escalationRules: data.escalationRules
          }
        }
      };
      await updateProfile(payload);
      localStorage.removeItem('onboarding_admin');
      window.location.href = '/dashboards/admin';
    } catch (e) {
      setLoading(false);
      alert(e.message || 'Failed to complete onboarding');
    }
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="System name"
              helperText="For example: Enum Technology MR.CREAMS deployment"
              value={data.systemName}
              onChange={handleFieldChange('systemName')}
            />
          </Grid>
        </Grid>
      );
    }
    if (activeStep === 1) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Default policies"
              helperText="Summarize key usage and data policies for your organization."
              value={data.defaultPolicies}
              onChange={handleFieldChange('defaultPolicies')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Escalation rules"
              helperText="How urgent tickets and safety concerns should be routed."
              value={data.escalationRules}
              onChange={handleFieldChange('escalationRules')}
            />
          </Grid>
        </Grid>
      );
    }
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Admin workspace ready
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          When you continue, you will be taken to the admin dashboard where you can manage users,
          permissions, and monitoring tools.
        </Typography>
      </Box>
    );
  };

  return (
    <OnboardingLayout
      title="Admin Onboarding"
      subtitle="Configure MR.CREAMS for safe, reliable operations."
      accentColor={ADMIN_PRIMARY}
      headerRight={<SaveProgressButton onClick={handleSaveOnly} disabled={loading} />}
    >
      <ProgressTracker
        steps={steps}
        activeStep={activeStep}
        primaryColor={ADMIN_PRIMARY}
        secondaryColor={ADMIN_SECONDARY}
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

export default AdminOnboarding;

