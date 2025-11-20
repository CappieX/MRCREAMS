import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { initAccessibility } from './utils/accessibilityUtils';
import { initPerformanceTracking } from './utils/performanceMonitoring';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import HarmonyTracker from './pages/HarmonyTracker';
import RelationshipChallengeForm from './pages/RelationshipChallengeForm';
import EmotionInsightDashboard from './pages/EmotionInsightDashboard';
import HarmonyGuidance from './pages/HarmonyGuidance';
import Login from './pages/Login';
import SystemHarmonyAdmin from './pages/SystemHarmonyAdmin';
import LandingPage from './pages/LandingPage';
import UserTypeSelection from './pages/UserTypeSelection';
import ApplicationVerification from './pages/ApplicationVerification';
import EmotionCheckInPage from './pages/EmotionCheckInPage';
import ConflictInputPage from './pages/ConflictInputPage';
import ProfessionalLogin from './pages/ProfessionalLogin';

// Dashboard Components
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ITAdminDashboard from './pages/dashboard/ITAdminDashboard';
import SupportDashboard from './pages/dashboard/SupportDashboard';
import ExecutiveDashboard from './pages/dashboard/ExecutiveDashboard';
import TherapistDashboard from './pages/dashboard/TherapistDashboard';

// Super Admin Sub-pages
import SuperAdminHome from './pages/super-admin/SuperAdminHome';
import UsersManagement from './pages/super-admin/UsersManagement';
import EmotionAnalysis from './pages/super-admin/EmotionAnalysis';
import SessionsManagement from './pages/super-admin/SessionsManagement';
import ModelManagement from './pages/super-admin/ModelManagement';
import SecurityCenter from './pages/super-admin/SecurityCenter';
import ReportsAnalytics from './pages/super-admin/ReportsAnalytics';
import DataGovernance from './pages/super-admin/DataGovernance';
import IntegrationsManagement from './pages/super-admin/IntegrationsManagement';
import SystemSettings from './pages/super-admin/SystemSettings';
import SupportEscalations from './pages/super-admin/SupportEscalations';

import TherapistHome from './pages/therapist/TherapistHome';
import MySessions from './pages/therapist/MySessions';
import MyClients from './pages/therapist/MyClients';

// Support Sub-pages
import SupportHome from './pages/support/SupportHome';
import TicketDetail from './pages/support/TicketDetail';

// Import BackgroundDecoration and TicketSubmissionWidget
import BackgroundDecoration from './components/BackgroundDecoration';
import TicketSubmissionWidget from './components/TicketSubmissionWidget';

// Import onboarding components
import { useOnboarding } from './hooks/useOnboarding';
import OnboardingFlow from './components/onboarding/OnboardingFlow';

// Import unified registration component
import UnifiedRegistration from './components/auth/UnifiedRegistration';

const AuthenticatedLayout = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          mt: { xs: 7, sm: 8 },
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/super-admin" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }>
                <Route index element={<SuperAdminHome />} />
                <Route path="users" element={<UsersManagement />} />
                <Route path="emotion-analysis" element={<EmotionAnalysis />} />
                <Route path="sessions" element={<SessionsManagement />} />
                <Route path="models" element={<ModelManagement />} />
                <Route path="security" element={<SecurityCenter />} />
                <Route path="analytics" element={<ReportsAnalytics />} />
                <Route path="data-governance" element={<DataGovernance />} />
                <Route path="integrations" element={<IntegrationsManagement />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="support" element={<SupportEscalations />} />
              </Route>
              <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/it-admin" element={
                <ProtectedRoute allowedRoles={['it_admin']}>
                  <ITAdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/support" element={
                <ProtectedRoute allowedRoles={['support', 'super_admin', 'admin']}>
                  <SupportDashboard />
                </ProtectedRoute>
              }>
                <Route index element={<SupportHome />} />
                <Route path="tickets" element={<SupportHome />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
              </Route>
              <Route path="/dashboard/executive" element={
                <ProtectedRoute allowedRoles={['executive']}>
                  <ExecutiveDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/therapist" element={
                <ProtectedRoute allowedRoles={['therapist']}>
                  <TherapistDashboard />
                </ProtectedRoute>
              }>
                <Route index element={<TherapistHome />} />
                <Route path="sessions" element={<MySessions />} />
                <Route path="clients" element={<MyClients />} />
              </Route>
              <Route path="/harmony-hub" element={<HarmonyTracker />} />
              <Route path="/harmony-hub/new" element={<RelationshipChallengeForm />} />
              <Route path="/harmony-hub/edit/:id" element={<RelationshipChallengeForm />} />
              <Route path="/emotion-insights" element={<EmotionInsightDashboard />} />
              <Route path="/harmony-guidance" element={<HarmonyGuidance />} />
              <Route path="/emotion-checkin" element={<EmotionCheckInPage />} />
              <Route path="/conflict-input" element={<ConflictInputPage />} />
              <Route path="/system-harmony" element={
                <ProtectedRoute adminOnly={true}>
                  <SystemHarmonyAdmin />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </ErrorBoundary>
        </Container>
      </Box>
    </Box>
  );
};

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const { needsOnboarding, completeOnboarding } = useOnboarding();
  
  useEffect(() => {
    // Initialize accessibility features
    initAccessibility();
    // Initialize performance tracking
    initPerformanceTracking();
  }, []);

  const handleOnboardingComplete = async (onboardingData) => {
    try {
      // Mark onboarding as complete in user profile
      await completeOnboarding(onboardingData);

      // Force refresh to ensure all components get updated user data
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('There was an error completing your onboarding. Please try again.');
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BackgroundDecoration />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth-select" element={<UserTypeSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/professional" element={<ProfessionalLogin />} />
        <Route path="/pro-login" element={<ProfessionalLogin />} />

        {/* Unified registration - replaces all individual registration routes */}
        <Route path="/register" element={<UnifiedRegistration />} />

        {/* Redirect all old registration paths to unified system */}
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/register/user" element={<Navigate to="/register" replace />} />
        <Route path="/register/company" element={<Navigate to="/register" replace />} />
        <Route path="/therapist-registration" element={<Navigate to="/register" replace />} />

        <Route path="/verification" element={<ApplicationVerification />} />
        <Route path="/onboarding" element={
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        } />
        <Route path="/*" element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        } />
      </Routes>
      {/* Universal Ticket Submission Widget - Available on all authenticated pages */}
      <TicketSubmissionWidget />
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;