import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import OnboardingLayout from '../components/OnboardingLayout';
import ProgressTracker from '../components/ProgressTracker';
import StepNavigation from '../components/StepNavigation';
import SaveProgressButton from '../components/SaveProgressButton';

const THERAPIST_PRIMARY = '#0A2540';
const THERAPIST_SECONDARY = '#8DA2B7';

const TherapistOnboarding = () => {
  const { updateProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    licenseNumber: '',
    licenseState: '',
    yearsExperience: '',
    specialties: [],
    modalities: [],
    availability: '',
    sessionTypes: [],
    pricingNotes: '',
    agreesHipaa: false,
    clientPortalName: '',
    trainingCompleted: false
  });

  const steps = [
    'Credential Verification',
    'Specialty Selection',
    'Practice Setup',
    'HIPAA Compliance',
    'Platform Training',
    'Complete'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('onboarding_therapist');
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
    localStorage.setItem('onboarding_therapist', JSON.stringify({ step: nextStep, data: nextData }));
  };

  const handleFieldChange = (field) => (event) => {
    const value =
      field === 'agreesHipaa' || field === 'trainingCompleted'
        ? event.target.checked
        : event.target.value;
    setData((prev) => {
      const next = { ...prev, [field]: value };
      persist(activeStep, next);
      return next;
    });
  };

  const toggleArrayField = (field, value) => () => {
    setData((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(value);
      const nextArray = exists ? current.filter((v) => v !== value) : [...current, value];
      const next = { ...prev, [field]: nextArray };
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
    if (!data.agreesHipaa) {
      alert('You must confirm HIPAA compliance to continue.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        onboardingStep: activeStep,
        onboardingData: {
          therapistProfile: {
            licenseNumber: data.licenseNumber,
            licenseState: data.licenseState,
            yearsExperience: data.yearsExperience,
            specialties: data.specialties,
            modalities: data.modalities
          },
          practiceSetup: {
            availability: data.availability,
            sessionTypes: data.sessionTypes,
            pricingNotes: data.pricingNotes
          },
          compliance: {
            hipaaAccepted: data.agreesHipaa
          },
          clientPortal: {
            name: data.clientPortalName,
            trainingCompleted: data.trainingCompleted
          }
        }
      };
      await updateProfile(payload);
      localStorage.removeItem('onboarding_therapist');
      window.location.href = '/dashboards/therapist';
    } catch (e) {
      setLoading(false);
      alert(e.message || 'Failed to complete onboarding');
    }
  };

  const specialtyOptions = [
    'Couples therapy',
    'Family therapy',
    'Individual counseling',
    'Premarital counseling'
  ];

  const modalityOptions = ['CBT', 'Emotionally Focused', 'Narrative', 'Integrative'];
  const sessionTypeOptions = ['In-person', 'Video', 'Phone', 'Hybrid'];

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="License number"
              value={data.licenseNumber}
              onChange={handleFieldChange('licenseNumber')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="License state or country"
              value={data.licenseState}
              onChange={handleFieldChange('licenseState')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Years of experience"
              value={data.yearsExperience}
              onChange={handleFieldChange('yearsExperience')}
            />
          </Grid>
        </Grid>
      );
    }
    if (activeStep === 1) {
      return (
        <Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Select your primary client focus areas and modalities.
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Specializations
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {specialtyOptions.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  onClick={toggleArrayField('specialties', s)}
                  color={data.specialties.includes(s) ? 'primary' : 'default'}
                  sx={{ borderRadius: 3 }}
                />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Modalities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {modalityOptions.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  onClick={toggleArrayField('modalities', m)}
                  color={data.modalities.includes(m) ? 'primary' : 'default'}
                  sx={{ borderRadius: 3 }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      );
    }
    if (activeStep === 2) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Availability overview"
              helperText="For example: weekdays 10am–6pm, no Fridays"
              value={data.availability}
              onChange={handleFieldChange('availability')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Session types
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {sessionTypeOptions.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  onClick={toggleArrayField('sessionTypes', t)}
                  color={data.sessionTypes.includes(t) ? 'primary' : 'default'}
                  sx={{ borderRadius: 3 }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Pricing notes (optional)"
              value={data.pricingNotes}
              onChange={handleFieldChange('pricingNotes')}
            />
          </Grid>
        </Grid>
      );
    }
    if (activeStep === 3) {
      return (
        <Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            MR.CREAMS is designed to support HIPAA-aligned workflows. Confirm that you will use the
            platform in accordance with your professional, legal, and ethical obligations.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.agreesHipaa}
                onChange={handleFieldChange('agreesHipaa')}
              />
            }
            label="I understand and agree to follow HIPAA and local privacy regulations when using MR.CREAMS."
          />
        </Box>
      );
    }
    if (activeStep === 4) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Client portal name"
              helperText="What clients will see, for example: Dr. Smith Relationship Clinic"
              value={data.clientPortalName}
              onChange={handleFieldChange('clientPortalName')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.trainingCompleted}
                  onChange={handleFieldChange('trainingCompleted')}
                />
              }
              label="I have completed the quick platform walkthrough."
            />
          </Grid>
        </Grid>
      );
    }
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          You are ready to accept clients
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Your professional profile, availability, and compliance preferences are saved. When you
          continue, you will be taken to your therapist dashboard.
        </Typography>
      </Box>
    );
  };

  return (
    <OnboardingLayout
      title="Therapist Onboarding"
      subtitle="Set up a secure, professional space for your clients."
      accentColor={THERAPIST_PRIMARY}
      headerRight={<SaveProgressButton onClick={handleSaveOnly} disabled={loading} />}
    >
      <ProgressTracker
        steps={steps}
        activeStep={activeStep}
        primaryColor={THERAPIST_PRIMARY}
        secondaryColor={THERAPIST_SECONDARY}
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

export default TherapistOnboarding;

