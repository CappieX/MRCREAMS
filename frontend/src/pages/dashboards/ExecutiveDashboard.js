import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function ExecutiveDashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Executive Dashboard</Typography>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
              <Typography variant="h5">$125,430</Typography>
              <Typography variant="body2" color="success.main">↑ 12% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Users</Typography>
              <Typography variant="h5">2,845</Typography>
              <Typography variant="body2" color="success.main">↑ 8% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>User Growth</Typography>
              <Typography variant="h5" color="success.main">28%</Typography>
              <Typography variant="body2" color="text.secondary">Quarter over quarter</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Avg. Session</Typography>
              <Typography variant="h5">4m 23s</Typography>
              <Typography variant="body2" color="error.main">↓ 2% from last month</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
