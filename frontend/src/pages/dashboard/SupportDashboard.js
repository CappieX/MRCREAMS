import React, { useState } from 'react';
import {
  Box,
  Toolbar,
  IconButton,
  AppBar,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import SupportSidebar from '../../components/SupportSidebar';
import { Outlet, useLocation } from 'react-router-dom';

const SupportDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get current page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/tickets/') && path.split('/').length > 4) return 'Ticket Details';
    if (path.includes('/tickets')) return 'All Tickets';
    if (path.includes('/my-tickets')) return 'My Tickets';
    if (path.includes('/customers')) return 'Customers';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/categories')) return 'Categories';
    if (path.includes('/performance')) return 'Performance';
    if (path.includes('/settings')) return 'Settings';
    return 'Support Dashboard';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleSidebarToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <SupportSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant={isMobile ? 'temporary' : 'persistent'}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${sidebarOpen && !isMobile ? 280 : 0}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Outlet /> {/* This renders the nested routes */}
      </Box>
    </Box>
  );
};

export default SupportDashboard;
