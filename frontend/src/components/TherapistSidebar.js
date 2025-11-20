import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Divider,
  Box,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Psychology as PsychologyIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  SmartToy as AIIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { dashboardTheme } from '../constants/dashboardTheme';

const TherapistSidebar = ({ open, onClose, variant = 'persistent' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard/therapist', badge: null },
    { text: 'My Sessions', icon: ChatIcon, path: '/dashboard/therapist/sessions', badge: '3 Live' },
    { text: 'My Clients', icon: PeopleIcon, path: '/dashboard/therapist/clients', badge: '24' },
    { text: 'Emotion Insights', icon: PsychologyIcon, path: '/dashboard/therapist/insights', badge: 'New' },
    { text: 'Session Reports', icon: AssignmentIcon, path: '/dashboard/therapist/reports', badge: null },
    { text: 'My Calendar', icon: CalendarIcon, path: '/dashboard/therapist/calendar', badge: '5' },
    { text: 'AI Assistant', icon: AIIcon, path: '/dashboard/therapist/ai-assistant', badge: 'Beta' },
    { text: 'My Settings', icon: SettingsIcon, path: '/dashboard/therapist/settings', badge: null }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard/therapist') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: dashboardTheme.colors.surface,
          borderRight: `1px solid ${dashboardTheme.colors.background}`,
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <PsychologyIcon sx={{ color: dashboardTheme.colors.chart.purple, fontSize: 28 }} />
          <Box>
            <Box sx={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2, color: dashboardTheme.colors.text.primary }}>
              MR.CREAMS
            </Box>
            <Box sx={{ fontSize: '12px', color: dashboardTheme.colors.text.secondary, lineHeight: 1 }}>
              Therapist Portal
            </Box>
          </Box>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: dashboardTheme.colors.chart.purple + '15',
                  color: dashboardTheme.colors.chart.purple,
                  '&:hover': {
                    backgroundColor: dashboardTheme.colors.chart.purple + '25',
                  },
                  '& .MuiListItemIcon-root': {
                    color: dashboardTheme.colors.chart.purple,
                  },
                },
                '&:hover': {
                  backgroundColor: dashboardTheme.colors.background,
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: isActive(item.path) ? dashboardTheme.colors.chart.purple : dashboardTheme.colors.text.secondary
              }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.text}</span>
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '10px',
                          backgroundColor: dashboardTheme.colors.chart.purple,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default TherapistSidebar;
