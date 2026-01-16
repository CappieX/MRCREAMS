import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const OnboardingLayout = ({ title, subtitle, accentColor, children, headerRight }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1020', color: '#FFFFFF' }}>
      <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Container maxWidth="lg" sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: accentColor
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                MR.CREAMS
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                in partnership with Enum Technology
              </Typography>
            </Box>
          </Box>
          {headerRight}
        </Container>
      </Box>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box>{children}</Box>
      </Container>
    </Box>
  );
};

export default OnboardingLayout;

