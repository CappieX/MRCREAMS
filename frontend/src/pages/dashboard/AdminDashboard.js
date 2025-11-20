import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard - User Management</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">User Statistics</Typography>
              <Typography>Active Users: 324</Typography>
              <Typography>Pending Approvals: 15</Typography>
              <Typography>New This Week: 28</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Quick Actions</Typography>
              <Typography>Manage Users</Typography>
              <Typography>View Reports</Typography>
              <Typography>System Settings</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
