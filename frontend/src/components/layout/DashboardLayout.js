import React, { useState } from 'react';
import { Box, Container, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import Header from '../Header';
import Sidebar from '../Sidebar';
import ErrorBoundary from '../ErrorBoundary';

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
