import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Alert } from '@mui/material';
import axios from 'axios';

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/analytics');
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Emotion Insights
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Discover your emotional patterns and relationship dynamics through intelligent analysis and compassionate insights.
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          Not enough data available for emotion insights. Share some relationship challenges first to see your emotional patterns.
        </Alert>
      </Paper>
    </Box>
  );
}

export default Analytics;