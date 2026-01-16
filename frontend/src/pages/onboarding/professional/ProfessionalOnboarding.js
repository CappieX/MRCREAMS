import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import OnboardingLayout from '../components/OnboardingLayout';
import ProgressTracker from '../components/ProgressTracker';
import StepNavigation from '../components/StepNavigation';
import SaveProgressButton from '../components/SaveProgressButton';

const PRO_PRIMARY = '#6C757D';
const PRO_SECONDARY = '#E9ECEF';

const ProfessionalOnboarding = () => {
  const { updateProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    organizationName: '',
    teamSize: '',
    department: '',
    roleAssignments: '',
    billingEmail: '',
    billingContact: '',
    subscriptionTier: '',
    inviteList: '',
    integrateCalendar: false,
    integrateCommunication: false,
    integrateEhr: false,
    complianceOwner: '',
    reportingCadence: ''
  });

  const steps = [
    'Organization Setup',
    'Role Assignment',
    'Billing Setup',
    'Team Onboarding',
    'Integration Setup',
    'Compliance',
    'Complete'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('onboarding_professional');
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
    localStorage.setItem('onboarding_professional', JSON.stringify({ step: nextStep, data: nextData }));
  };

  const handleFieldChange = (field) => (event) => {
    const booleanFields = ['integrateCalendar', 'integrateCommunication', 'integrateEhr'];
    const value = booleanFields.includes(field) ? event.target.checked : event.target.value;
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
          organization: {
            name: data.organizationName,
            teamSize: data.teamSize,
            department: data.department
          },
          roles: {
            assignments: data.roleAssignments
          },
          billing: {
            email: data.billingEmail,
            contact: data.billingContact,
            subscriptionTier: data.subscriptionTier
          },
          teamOnboarding: {
            inviteList: data.inviteList
          },
          integrations: {
            calendar: data.integrateCalendar,
            communication: data.integrateCommunication,
            ehr: data.integrateEhr
          },
          compliance: {
            owner: data.complianceOwner,
            reportingCadence: data.reportingCadence
          }
        }
      };
      await updateProfile(payload);
      localStorage.removeItem('onboarding_professional');
      window.location.href = '/dashboards/organization';
    } catch (e) {
      setLoading(false);
      alert(e.message || 'Failed to complete onboarding');
    }
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Organization name"
              value={data.organizationName}
              onChange={handleFieldChange('organizationName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Team size"
              value={data.teamSize}
              onChange={handleFieldChange('teamSize')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primary department or program"
              value={data.department}
              onChange={handleFieldChange('department')}
            />
          </Grid>
        </Grid>
      );
    }
    if (activeStep === 1) {
      return (
        <Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Describe who will be admins, support agents, and executives in the system.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Role assignment plan"
            value={data.roleAssignments}
            onChange={handleFieldChange('roleAssignments')}
          />
        </Box>
      );
    }
    if (activeStep === 2) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Billing email"
              value={data.billingEmail}
              onChange={handleFieldChange('billingEmail')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Billing contact name"
              value={data.billingContact}
              onChange={handleFieldChange('billingContact')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subscription plan"
              value={data.subscriptionTier}
              onChange={handleFieldChange('subscriptionTier')}
            />
          </Grid>
        </Grid>
      );
    }
    if (activeStep === 3) {
      return (
        <Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Paste or list the email addresses of colleagues you would like to invite.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Invite list"
            value={data.inviteList}
            onChange={handleFieldChange('inviteList')}
          />
        </Box>
      );
    }
    if (activeStep === 4) {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.integrateCalendar}
                  onChange={handleFieldChange('integrateCalendar')}
                />
              }
              label="Connect calendar tools"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.integrateCommunication}
                  onChange={handleFieldChange('integrateCommunication')}
                />
              }
              label="Connect communication tools"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.integrateEhr}
                  onChange={handleFieldChange('integrateEhr')}
                />
              }
              label="Connect EHR or health record tools"
            />
          </Grid>
        </Grid>
      );
    }
    if (activeStep === 5) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Data governance owner"
              value={data.complianceOwner}
              onChange={handleFieldChange('complianceOwner')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Reporting cadence"
              helperText="For example: monthly wellness reporting"
              value={data.reportingCadence}
              onChange={handleFieldChange('reportingCadence')}
            />
          </Grid>
        </Grid>
      );
    }
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your organization workspace is ready
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          When you continue, you will be taken to the organization dashboard where you can invite
          your team and configure advanced analytics.
        </Typography>
      </Box>
    );
  };

  return (
    <OnboardingLayout
      title="Organization Onboarding"
      subtitle="Configure your MR.CREAMS workspace for teams and leaders."
      accentColor={PRO_PRIMARY}
      headerRight={<SaveProgressButton onClick={handleSaveOnly} disabled={loading} />}
    >
      <ProgressTracker
        steps={steps}
        activeStep={activeStep}
        primaryColor={PRO_PRIMARY}
        secondaryColor={PRO_SECONDARY}
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

export default ProfessionalOnboarding;

