import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function SupportDashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Support Dashboard</Typography>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Open Tickets</Typography>
              <Typography variant="h4" color="error.main">23</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Resolved Today</Typography>
              <Typography variant="h4" color="success.main">15</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Avg. Response Time</Typography>
              <Typography variant="h5">12m 34s</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
