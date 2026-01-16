import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import Header from '../Header';
import Sidebar from '../Sidebar';
import ErrorBoundary from '../ErrorBoundary';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const professionalPrefixes = [
    '/dashboard/super-admin',
    '/dashboard/platform-admin',
    '/dashboard/admin',
    '/dashboard/support',
    '/dashboard/therapist',
    '/dashboard/executive'
  ];

  const isProfessionalDashboard = professionalPrefixes.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (isProfessionalDashboard) {
    return (
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: 7, sm: 8 },
          width: { sm: `calc(100% - 240px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
