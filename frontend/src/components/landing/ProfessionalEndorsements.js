import React from 'react';
import { Box, Typography, Paper, Avatar, Chip, Grid } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const endorsements = [
  {
    photo: '/path/to/therapist1.jpg', // Replace with actual path
    name: 'Dr. Elena Rodriguez, LMFT',
    quote: "I've reduced session prep time by 40% while improving client outcomes. The analytics provide insights I was missing.",
    logo: '/path/to/clinic-logo.png', // Replace with actual path
  },
  // Add more endorsements as needed
];

const ProfessionalEndorsements = () => {
  return (
    <Grid container spacing={4}>
      {endorsements.map((endorsement, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src={endorsement.photo} sx={{ width: 60, height: 60, mr: 2 }} />
              <Box>
                <Typography variant="h6">{endorsement.name}</Typography>
                <Chip
                  icon={<CheckCircle />}
                  label="Therapist Approved"
                  color="primary"
                  size="small"
                />
              </Box>
            </Box>
            <Typography variant="body1" sx={{ fontStyle: 'italic', flexGrow: 1, mb: 2 }}>
              "{endorsement.quote}"
            </Typography>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <img src={endorsement.logo} alt="Clinic Logo" style={{ height: '40px' }} />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfessionalEndorsements;
