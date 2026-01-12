import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';

const StatItem = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}20`, color: color, mr: 2 }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Paper>
);

const QuickStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatItem {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickStats;
