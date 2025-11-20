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
  People as PeopleIcon,
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  ModelTraining as ModelTrainingIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  FolderSpecial as FolderSpecialIcon,
  Settings as SettingsIcon,
  IntegrationInstructions as IntegrationIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { dashboardTheme } from '../constants/dashboardTheme';

const SuperAdminSidebar = ({ open, onClose, variant = 'persistent' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard/super-admin', badge: null },
    { text: 'Users & Roles', icon: PeopleIcon, path: '/dashboard/super-admin/users', badge: null },
    { text: 'Emotion Analysis', icon: PsychologyIcon, path: '/dashboard/super-admin/emotion-analysis', badge: 'Live' },
    { text: 'Sessions & Conversations', icon: ChatIcon, path: '/dashboard/super-admin/sessions', badge: '1.2K' },
    { text: 'Model Management', icon: ModelTrainingIcon, path: '/dashboard/super-admin/models', badge: '3' },
    { text: 'Security Center', icon: SecurityIcon, path: '/dashboard/super-admin/security', badge: 'Secure' },
    { text: 'Reports & Analytics', icon: AnalyticsIcon, path: '/dashboard/super-admin/analytics', badge: 'New' },
    { text: 'Data Governance', icon: FolderSpecialIcon, path: '/dashboard/super-admin/data-governance', badge: null },
    { text: 'Integrations', icon: IntegrationIcon, path: '/dashboard/super-admin/integrations', badge: '5' },
    { text: 'Settings', icon: SettingsIcon, path: '/dashboard/super-admin/settings', badge: null },
    { text: 'Support / Escalations', icon: SupportIcon, path: '/dashboard/super-admin/support', badge: '12' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard/super-admin') {
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
          <PsychologyIcon sx={{ color: dashboardTheme.colors.primary, fontSize: 28 }} />
          <Box>
            <Box sx={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2, color: dashboardTheme.colors.text.primary }}>
              MR.CREAMS
            </Box>
            <Box sx={{ fontSize: '12px', color: dashboardTheme.colors.text.secondary, lineHeight: 1 }}>
              Super Admin
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
                  backgroundColor: dashboardTheme.colors.primary + '15',
                  color: dashboardTheme.colors.primary,
                  '&:hover': {
                    backgroundColor: dashboardTheme.colors.primary + '25',
                  },
                  '& .MuiListItemIcon-root': {
                    color: dashboardTheme.colors.primary,
                  },
                },
                '&:hover': {
                  backgroundColor: dashboardTheme.colors.background,
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: isActive(item.path) ? dashboardTheme.colors.primary : dashboardTheme.colors.text.secondary
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
                          backgroundColor: dashboardTheme.colors.primary,
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

export default SuperAdminSidebar;
