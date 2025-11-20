import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';
import {
  SentimentSatisfied as HappyIcon,
  SentimentDissatisfied as SadIcon,
  SentimentNeutral as NeutralIcon,
  Favorite as LoveIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import { dashboardTheme } from '../../constants/dashboardTheme';

const EmotionAnalysis = () => {
  const emotionTrends = [
    { date: 'Jan 1', joy: 65, sadness: 25, anger: 15, fear: 20, love: 70 },
    { date: 'Jan 5', joy: 68, sadness: 22, anger: 12, fear: 18, love: 72 },
    { date: 'Jan 10', joy: 72, sadness: 20, anger: 10, fear: 15, love: 75 },
    { date: 'Jan 15', joy: 75, sadness: 18, anger: 8, fear: 12, love: 78 },
    { date: 'Jan 18', joy: 78, sadness: 15, anger: 7, fear: 10, love: 82 }
  ];

  const emotionDistribution = [
    { emotion: 'Joy', value: 78, color: dashboardTheme.colors.success },
    { emotion: 'Love', value: 82, color: dashboardTheme.colors.chart.pink },
    { emotion: 'Neutral', value: 45, color: dashboardTheme.colors.text.secondary },
    { emotion: 'Sadness', value: 15, color: dashboardTheme.colors.chart.blue },
    { emotion: 'Anger', value: 7, color: dashboardTheme.colors.error }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Emotion Analysis Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Overall Happiness"
            value="78%"
            change="+5%"
            changeType="increase"
            icon={HappyIcon}
            color={dashboardTheme.colors.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Love Index"
            value="82%"
            change="+8%"
            changeType="increase"
            icon={LoveIcon}
            color={dashboardTheme.colors.chart.pink}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Conflict Level"
            value="7%"
            change="-3%"
            changeType="increase"
            icon={SadIcon}
            color={dashboardTheme.colors.error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Neutral State"
            value="45%"
            change="Stable"
            changeType="stable"
            icon={NeutralIcon}
            color={dashboardTheme.colors.text.secondary}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <DashboardCard title="Emotion Trends Over Time" subtitle="Last 30 days">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={emotionTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke={dashboardTheme.colors.text.secondary} />
                <YAxis stroke={dashboardTheme.colors.text.secondary} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="joy" stroke={dashboardTheme.colors.success} strokeWidth={2} name="Joy" />
                <Line type="monotone" dataKey="love" stroke={dashboardTheme.colors.chart.pink} strokeWidth={2} name="Love" />
                <Line type="monotone" dataKey="sadness" stroke={dashboardTheme.colors.chart.blue} strokeWidth={2} name="Sadness" />
                <Line type="monotone" dataKey="anger" stroke={dashboardTheme.colors.error} strokeWidth={2} name="Anger" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DashboardCard title="Current Emotion Distribution">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={emotionDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke={dashboardTheme.colors.text.secondary} />
                <YAxis type="category" dataKey="emotion" stroke={dashboardTheme.colors.text.secondary} />
                <Tooltip />
                <Bar dataKey="value" fill={dashboardTheme.colors.chart.purple} />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmotionAnalysis;
