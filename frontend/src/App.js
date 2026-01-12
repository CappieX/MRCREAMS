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
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import UserTypeSelection from './pages/UserTypeSelection';
import ApplicationVerification from './pages/ApplicationVerification';
import EmotionCheckInPage from './pages/EmotionCheckInPage';
import ConflictInputPage from './pages/ConflictInputPage';
import ProfessionalLogin from './pages/ProfessionalLogin';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import About from './pages/About';

// Dashboard Components
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import ITAdminDashboard from './pages/dashboard/ITAdminDashboard';
import SupportDashboard from './pages/dashboard/SupportDashboard';
import ExecutiveDashboard from './pages/dashboard/ExecutiveDashboard';
import TherapistDashboard from './pages/dashboard/TherapistDashboard';
import PlatformAdminDashboard from './pages/dashboard/PlatformAdminDashboard';

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

// Platform Admin Sub-pages
import PlatformAdminHome from './pages/platform-admin/PlatformAdminHome';
import SystemHealth from './pages/platform-admin/SystemHealth';
import AuditLogs from './pages/platform-admin/AuditLogs';
import Configuration from './pages/platform-admin/Configuration';
import UserManagement from './pages/platform-admin/UserManagement';
import ConflictsAdmin from './pages/platform-admin/ConflictsAdmin';
import Professionals from './pages/platform-admin/Professionals';
import AnalyticsHub from './pages/platform-admin/AnalyticsHub';
import NotificationCenter from './pages/platform-admin/NotificationCenter';

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

  return (
    <DashboardLayout>
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
              <Route path="/dashboard/platform-admin" element={
                <ProtectedRoute allowedRoles={['platform_admin']}>
                  <PlatformAdminDashboard />
                </ProtectedRoute>
              }>
                <Route index element={<PlatformAdminHome />} />
                <Route path="health" element={<SystemHealth />} />
                <Route path="logs" element={<AuditLogs />} />
                <Route path="config" element={<Configuration />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="conflicts" element={<ConflictsAdmin />} />
                <Route path="professionals" element={<Professionals />} />
                <Route path="analytics" element={<AnalyticsHub />} />
                <Route path="notifications" element={<NotificationCenter />} />
              </Route>
              <Route path="/dashboard/admin" element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin', 'it_admin']}>
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
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin', 'it_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/system-harmony" element={
                <ProtectedRoute adminOnly={true}>
                  <SystemHarmonyAdmin />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
    </DashboardLayout>
  );
};

const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  const { completeOnboarding } = useOnboarding();
  
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
        <Route path="/professional-login" element={<ProfessionalLogin />} />

        {/* Unified registration - replaces all individual registration routes */}
        <Route path="/register" element={<UnifiedRegistration />} />

        {/* Redirect all old registration paths to unified system */}
        <Route path="/signup" element={<Navigate to="/register" replace />} />
        <Route path="/register/user" element={<Navigate to="/register" replace />} />
        <Route path="/register/company" element={<Navigate to="/register" replace />} />
        <Route path="/therapist-registration" element={<Navigate to="/register" replace />} />
        
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

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
