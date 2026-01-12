import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';

const About = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          About
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Building emotionally intelligent technology for healthier relationships.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Mission
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Help couples and professionals understand emotions, resolve conflicts, and grow together.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Approach
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Combine AI insights with clinically informed guidance, respecting privacy and security.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
