import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

const featuredLogos = [
  '/path/to/logo1.png', // Replace with actual paths
  '/path/to/logo2.png',
  '/path/to/logo3.png',
];

const validationLogos = [
  '/path/to/validation-logo1.png', // Replace with actual paths
  '/path/to/validation-logo2.png',
];

const MediaMentions = () => {
  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '12px', backgroundColor: 'grey.100' }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Featured In
          </Typography>
          <Box display="flex" gap={4} flexWrap="wrap">
            {featuredLogos.map((logo, index) => (
              <img key={index} src={logo} alt="Featured Logo" style={{ height: '40px' }} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Clinically Validated By
          </Typography>
          <Box display="flex" gap={4} flexWrap="wrap">
            {validationLogos.map((logo, index) => (
              <img key={index} src={logo} alt="Validation Logo" style={{ height: '50px' }} />
            ))}
          </Box>
        </Grid>
      </Grid>
      <Box mt={4} textAlign="center">
        <Button
          variant="outlined"
          startIcon={<PictureAsPdf />}
          href="/path/to/clinical-study.pdf" // Replace with actual path
          target="_blank"
        >
          View Clinical Study Results (PDF)
        </Button>
      </Box>
    </Paper>
  );
};

export default MediaMentions;
