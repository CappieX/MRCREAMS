import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const HarmonyScoreCard = ({ score = 85, trend = 'up' }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Harmony Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="div" sx={{ mr: 2, color: 'primary.main', fontWeight: 'bold' }}>
            {score}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: trend === 'up' ? 'success.main' : 'error.main' }}>
            {trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {trend === 'up' ? '+5%' : '-2%'} vs last week
            </Typography>
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={score} sx={{ height: 8, borderRadius: 4 }} />
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          Your relationship harmony is strong this week.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default HarmonyScoreCard;
