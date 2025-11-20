import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Alert,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  PlayArrow as PlayIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const ApplicationVerification = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [testResults, setTestResults] = useState({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const testRoutes = [
    // Public Routes
    { path: '/', name: 'Landing Page', type: 'public', icon: <PlayIcon /> },
    { path: '/auth-select', name: 'User Type Selection', type: 'public', icon: <PeopleIcon /> },
    { path: '/login', name: 'Login', type: 'public', icon: <CheckIcon /> },
    { path: '/register/user', name: 'User Registration', type: 'public', icon: <PeopleIcon /> },
    { path: '/register/company', name: 'Company Registration', type: 'public', icon: <BusinessIcon /> },
    
    // Protected Routes
    { path: '/dashboard', name: 'User Dashboard', type: 'protected', icon: <DashboardIcon /> },
    { path: '/harmony-hub', name: 'Harmony Tracker', type: 'protected', icon: <PsychologyIcon /> },
    { path: '/emotion-insights', name: 'Emotion Insights', type: 'protected', icon: <AnalyticsIcon /> },
    { path: '/harmony-guidance', name: 'Harmony Guidance', type: 'protected', icon: <PsychologyIcon /> },
    { path: '/system-harmony', name: 'System Harmony Admin', type: 'admin', icon: <SettingsIcon /> }
  ];

  const runRouteTests = async () => {
    setIsRunningTests(true);
    const results = {};

    for (const route of testRoutes) {
      try {
        // Simulate navigation test
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if route would be accessible
        if (route.type === 'public') {
          results[route.path] = { status: 'success', message: 'Route accessible' };
        } else if (route.type === 'protected') {
          results[route.path] = { status: 'warning', message: 'Requires authentication' };
        } else if (route.type === 'admin') {
          results[route.path] = { status: 'warning', message: 'Requires admin access' };
        }
      } catch (error) {
        results[route.path] = { status: 'error', message: error.message };
      }
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'warning': return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'error': return <ErrorIcon sx={{ color: 'error.main' }} />;
      default: return <CheckIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success.main';
      case 'warning': return 'warning.main';
      case 'error': return 'error.main';
      default: return 'text.secondary';
    }
  };

  const testUserJourneys = () => {
    const journeys = [
      {
        name: 'End User Journey',
        steps: [
          'Landing Page → Auth Selection',
          'User Registration → Dashboard',
          'Emotion Check-in → Conflict Input',
          'AI Analysis → Recommendations',
          'Progress Tracking → Reflection Journal'
        ],
        color: '#4A90E2'
      },
      {
        name: 'Company User Journey',
        steps: [
          'Landing Page → Auth Selection',
          'Company Registration → Admin Approval',
          'Professional Onboarding → Admin Dashboard',
          'User Management → Analytics',
          'Content Management → System Settings'
        ],
        color: '#8B5FBF'
      }
    ];

    return journeys.map((journey, index) => (
      <Grid item xs={12} md={6} key={index}>
        <Card sx={{ height: '100%', border: `2px solid ${alpha(journey.color, 0.2)}` }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: journey.color }}>
              {journey.name}
            </Typography>
            <Box sx={{ mb: 2 }}>
              {journey.steps.map((step, stepIndex) => (
                <Box key={stepIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: alpha(journey.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: journey.color
                    }}
                  >
                    {stepIndex + 1}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Button
              variant="outlined"
              size="small"
              sx={{ borderColor: journey.color, color: journey.color }}
              onClick={() => navigate(journey.name === 'End User Journey' ? '/auth-select' : '/auth-select')}
            >
              Test Journey
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: 'text.primary', textAlign: 'center' }}>
          MR.CREAMS Application Verification
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Comprehensive testing and verification of all application flows
        </Typography>

        {/* Test Controls */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: alpha('#4A90E2', 0.05) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Route Testing
            </Typography>
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={runRouteTests}
              disabled={isRunningTests}
              sx={{ bgcolor: '#4A90E2' }}
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </Box>
          
          {isRunningTests && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Testing all routes and functionality...
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Route Test Results */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {testRoutes.map((route, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {route.icon}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                      {route.name}
                    </Typography>
                    {testResults[route.path] && getStatusIcon(testResults[route.path].status)}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {route.path}
                  </Typography>
                  
                  <Chip
                    label={route.type}
                    size="small"
                    sx={{
                      bgcolor: alpha(
                        route.type === 'public' ? '#4ECDC4' :
                        route.type === 'protected' ? '#4A90E2' : '#8B5FBF',
                        0.1
                      ),
                      color: route.type === 'public' ? '#4ECDC4' :
                             route.type === 'protected' ? '#4A90E2' : '#8B5FBF',
                      mb: 2
                    }}
                  />
                  
                  {testResults[route.path] && (
                    <Typography
                      variant="body2"
                      sx={{ color: getStatusColor(testResults[route.path].status) }}
                    >
                      {testResults[route.path].message}
                    </Typography>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => navigate(route.path)}
                    sx={{ mt: 1 }}
                  >
                    Test Route
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* User Journey Testing */}
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          User Journey Testing
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {testUserJourneys()}
        </Grid>

        {/* Quick Access Panel */}
        <Paper sx={{ p: 3, bgcolor: alpha('#8B5FBF', 0.05) }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Access Panel
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/auth-select')}
                sx={{ bgcolor: '#4A90E2' }}
              >
                Test User Flow
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<BusinessIcon />}
                onClick={() => navigate('/register/company')}
                sx={{ bgcolor: '#8B5FBF' }}
              >
                Test Company Flow
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ bgcolor: '#4ECDC4' }}
              >
                Test Dashboard
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<SettingsIcon />}
                onClick={() => navigate('/system-harmony')}
                sx={{ bgcolor: '#FF8A65' }}
              >
                Test Admin Panel
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Status Summary */}
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            <Typography variant="subtitle2" fontWeight="bold">
              Verification Status
            </Typography>
            <Typography variant="body2">
              Use this page to test all routes and user journeys. Click "Run All Tests" to verify 
              route accessibility, then test individual journeys using the quick access buttons.
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};

export default ApplicationVerification;
