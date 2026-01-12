import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  Add as AddIcon,
  BarChart as BarChartIcon,
  Lightbulb as LightbulbIcon,
  Mood as MoodIcon,
  Security as SecurityIcon,
  SupervisorAccount as AdminIcon,
  Support as SupportIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  HealthAndSafety as HealthIcon,
  Notifications as NotificationIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.user_type || user?.role || 'client'; // Default to client

  const isActive = (path) => location.pathname === path;

  const renderMenuItem = (to, icon, text) => (
    <ListItem 
      button 
      component={RouterLink} 
      to={to} 
      selected={isActive(to)}
      onClick={onClose} // Close drawer on mobile when item clicked
      sx={{
        '&.Mui-selected': {
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          '& .MuiListItemIcon-root': {
            color: 'primary.contrastText',
          },
          '&:hover': {
            backgroundColor: 'primary.main',
          },
        },
      }}
    >
      <ListItemIcon sx={{ color: isActive(to) ? 'inherit' : 'inherit' }}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );

  const getMenuForRole = () => {
    switch (role) {
      case 'super_admin':
        return (
          <>
            {renderMenuItem('/dashboard/super-admin', <DashboardIcon />, 'Dashboard')}
            {renderMenuItem('/dashboard/super-admin/users', <PeopleIcon />, 'User Management')}
            {renderMenuItem('/dashboard/super-admin/emotion-analysis', <PsychologyIcon />, 'Emotion Analysis')}
            {renderMenuItem('/dashboard/super-admin/sessions', <EventIcon />, 'Sessions')}
            {renderMenuItem('/dashboard/super-admin/models', <AssessmentIcon />, 'AI Models')}
            {renderMenuItem('/dashboard/super-admin/security', <SecurityIcon />, 'Security Center')}
            {renderMenuItem('/dashboard/super-admin/analytics', <BarChartIcon />, 'Reports & Analytics')}
            {renderMenuItem('/dashboard/super-admin/data-governance', <GavelIcon />, 'Data Governance')}
            {renderMenuItem('/dashboard/super-admin/integrations', <SettingsIcon />, 'Integrations')}
            {renderMenuItem('/dashboard/super-admin/settings', <SettingsIcon />, 'System Settings')}
            {renderMenuItem('/dashboard/super-admin/support', <SupportIcon />, 'Support Escalations')}
          </>
        );
      case 'platform_admin':
        return (
          <>
            {renderMenuItem('/dashboard/platform-admin', <DashboardIcon />, 'Dashboard')}
            {renderMenuItem('/dashboard/platform-admin/health', <HealthIcon />, 'System Health')}
            {renderMenuItem('/dashboard/platform-admin/logs', <ListIcon />, 'Audit Logs')}
            {renderMenuItem('/dashboard/platform-admin/config', <SettingsIcon />, 'Configuration')}
            {renderMenuItem('/dashboard/platform-admin/users', <PeopleIcon />, 'User Management')}
            {renderMenuItem('/dashboard/platform-admin/conflicts', <GavelIcon />, 'Conflicts Admin')}
            {renderMenuItem('/dashboard/platform-admin/professionals', <BusinessIcon />, 'Professionals')}
            {renderMenuItem('/dashboard/platform-admin/analytics', <BarChartIcon />, 'Analytics Hub')}
            {renderMenuItem('/dashboard/platform-admin/notifications', <NotificationIcon />, 'Notification Center')}
          </>
        );
      case 'therapist':
        return (
          <>
            {renderMenuItem('/dashboard/therapist', <DashboardIcon />, 'Dashboard')}
            {renderMenuItem('/dashboard/therapist/sessions', <EventIcon />, 'My Sessions')}
            {renderMenuItem('/dashboard/therapist/clients', <PeopleIcon />, 'My Clients')}
            {renderMenuItem('/emotion-insights', <BarChartIcon />, 'Emotion Insights')}
          </>
        );
      case 'support':
        return (
          <>
            {renderMenuItem('/dashboard/support', <DashboardIcon />, 'Dashboard')}
            {renderMenuItem('/dashboard/support/tickets', <ListIcon />, 'Tickets')}
          </>
        );
      case 'admin':
      case 'it_admin':
      case 'executive':
        // Basic dashboard for other admin roles for now
        return (
          <>
             {renderMenuItem(`/dashboard/${role === 'it_admin' ? 'it-admin' : role}`, <DashboardIcon />, 'Dashboard')}
          </>
        );
      default:
        // Client / End User
        return (
          <>
            {renderMenuItem('/dashboard', <DashboardIcon />, 'Dashboard')}
            {renderMenuItem('/harmony-hub', <ListIcon />, 'Harmony Tracker')}
            {renderMenuItem('/emotion-checkin', <MoodIcon />, 'Emotion Check-in')}
            {renderMenuItem('/conflict-input', <AddIcon />, 'Share Challenge')}
            <Divider />
            {renderMenuItem('/emotion-insights', <BarChartIcon />, 'Emotion Insights')}
            {renderMenuItem('/harmony-guidance', <LightbulbIcon />, 'Harmony Guidance')}
          </>
        );
    }
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {getMenuForRole()}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8, // Adjust based on Header height
            pb: 2,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;