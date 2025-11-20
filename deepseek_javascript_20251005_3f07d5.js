import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/analytics`);
      setAnalytics(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Conflict Analytics</Typography>
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Conflict Analytics</Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchAnalytics}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!analytics || analytics.totalConflicts === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Conflict Analytics</Typography>
        <Alert severity="info">
          Not enough data available for analytics. Log some conflicts first to see insights.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Conflict Analytics
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Visual insights into your conflict patterns and trends.
      </Typography>

      <Grid container spacing={3}>
        {/* Conflicts by Reason - Pie Chart */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Conflicts by Reason
            </Typography>
            {analytics.conflictsByReason.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={analytics.conflictsByReason}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ conflict_reason, count, percent }) => 
                      `${conflict_reason}: ${count} (${(percent * 100).toFixed(1)}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="conflict_reason"
                  >
                    {analytics.conflictsByReason.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      value, 
                      props.payload.conflict_reason
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Weekly Trend - Line Chart */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Conflict Trend
            </Typography>
            {analytics.weeklyTrend.length > 1 ? (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={analytics.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Week of ${new Date(value).toLocaleDateString()}`}
                    formatter={(value, name) => {
                      if (name === 'conflict_count') return [value, 'Number of Conflicts'];
                      if (name === 'avg_intensity') return [value.toFixed(1), 'Average Intensity'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="conflict_count" 
                    stroke="#8884d8" 
                    name="Number of Conflicts"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avg_intensity" 
                    stroke="#82ca9d" 
                    name="Average Intensity"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">Not enough data for trend analysis</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Intensity Distribution - Bar Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Summary
            </Typography>
            {analytics.monthlySummary.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={analytics.monthlySummary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    labelFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year}`;
                    }}
                    formatter={(value, name) => {
                      if (name === 'conflict_count') return [value, 'Number of Conflicts'];
                      if (name === 'avg_intensity') return [value.toFixed(1), 'Average Intensity'];
                      if (name === 'avg_duration') return [value.toFixed(0), 'Average Duration (min)'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="conflict_count" 
                    fill="#8884d8" 
                    name="Number of Conflicts"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="avg_intensity" 
                    fill="#82ca9d" 
                    name="Average Intensity"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">No monthly data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}