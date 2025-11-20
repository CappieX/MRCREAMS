import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function SuperAdminDashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Super Admin Dashboard</Typography>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Users</Typography>
              <Typography variant="h5">1,248</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>System Health</Typography>
              <Typography variant="h5" color="success.main">98%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Admins</Typography>
              <Typography variant="h5">12</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>API Requests</Typography>
              <Typography variant="h5">45,782</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
