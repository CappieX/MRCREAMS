import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import { dashboardTheme } from '../../constants/dashboardTheme';

const ReportsAnalytics = () => {
  const revenueData = [
    { month: 'Jan', revenue: 45000, users: 1200, sessions: 3400 },
    { month: 'Feb', revenue: 52000, users: 1350, sessions: 3800 },
    { month: 'Mar', revenue: 48000, users: 1280, sessions: 3600 },
    { month: 'Apr', revenue: 61000, users: 1450, sessions: 4200 },
    { month: 'May', revenue: 55000, users: 1380, sessions: 3900 }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Reports & Analytics
        </Typography>
        <Button variant="contained" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>
          Export Report
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Monthly Revenue" value="$61K" change="+18%" changeType="increase" color={dashboardTheme.colors.success} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Users" value="1,450" change="+12%" changeType="increase" color={dashboardTheme.colors.chart.blue} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Sessions" value="4,200" change="+15%" changeType="increase" color={dashboardTheme.colors.chart.purple} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Avg Session Value" value="$14.52" change="+3%" changeType="increase" color={dashboardTheme.colors.chart.teal} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DashboardCard title="Revenue & Growth Trends" subtitle="Last 6 months">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke={dashboardTheme.colors.text.secondary} />
                <YAxis stroke={dashboardTheme.colors.text.secondary} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke={dashboardTheme.colors.success} strokeWidth={3} name="Revenue ($)" />
                <Line type="monotone" dataKey="users" stroke={dashboardTheme.colors.chart.blue} strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="sessions" stroke={dashboardTheme.colors.chart.purple} strokeWidth={2} name="Sessions" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsAnalytics;
