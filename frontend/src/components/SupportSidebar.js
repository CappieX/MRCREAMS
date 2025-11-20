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
  ConfirmationNumber as TicketIcon,
  People as PeopleIcon,
  Assessment as AnalyticsIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  Speed as PerformanceIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { dashboardTheme } from '../constants/dashboardTheme';

const SupportSidebar = ({ open, onClose, variant = 'persistent', ticketStats = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard/support', badge: null },
    { text: 'All Tickets', icon: TicketIcon, path: '/dashboard/support/tickets', badge: ticketStats.total || null },
    { text: 'My Tickets', icon: TicketIcon, path: '/dashboard/support/my-tickets', badge: ticketStats.assigned || null },
    { text: 'Customers', icon: PeopleIcon, path: '/dashboard/support/customers', badge: null },
    { text: 'Analytics', icon: AnalyticsIcon, path: '/dashboard/support/analytics', badge: null },
    { text: 'Categories', icon: CategoryIcon, path: '/dashboard/support/categories', badge: null },
    { text: 'Performance', icon: PerformanceIcon, path: '/dashboard/support/performance', badge: null },
    { text: 'Settings', icon: SettingsIcon, path: '/dashboard/support/settings', badge: null }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard/support') {
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
          <NotificationsIcon sx={{ color: dashboardTheme.colors.chart.blue, fontSize: 28 }} />
          <Box>
            <Box sx={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2, color: dashboardTheme.colors.text.primary }}>
              MR.CREAMS
            </Box>
            <Box sx={{ fontSize: '12px', color: dashboardTheme.colors.text.secondary, lineHeight: 1 }}>
              Support Center
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
                  backgroundColor: dashboardTheme.colors.chart.blue + '15',
                  color: dashboardTheme.colors.chart.blue,
                  '&:hover': {
                    backgroundColor: dashboardTheme.colors.chart.blue + '25',
                  },
                  '& .MuiListItemIcon-root': {
                    color: dashboardTheme.colors.chart.blue,
                  },
                },
                '&:hover': {
                  backgroundColor: dashboardTheme.colors.background,
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: isActive(item.path) ? dashboardTheme.colors.chart.blue : dashboardTheme.colors.text.secondary
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
                          backgroundColor: dashboardTheme.colors.chart.blue,
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

export default SupportSidebar;
