import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  Insights as InsightsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const HarmonyProgressChart = ({ progressData }) => {
  const [harmonyMetrics, setHarmonyMetrics] = useState({
    overallProgress: 0,
    emotionalGrowth: 0,
    communicationImprovement: 0,
    conflictResolution: 0,
    relationshipSatisfaction: 0,
    trustBuilding: 0
  });

  const [recentAchievements, setRecentAchievements] = useState([]);

  useEffect(() => {
    if (progressData) {
      setHarmonyMetrics({
        overallProgress: Math.min(95, 40 + (progressData.overallScore || 0) * 0.6),
        emotionalGrowth: Math.min(90, 35 + (progressData.emotionalGrowth || 0) * 0.7),
        communicationImprovement: Math.min(88, 30 + (progressData.communicationScore || 0) * 0.8),
        conflictResolution: Math.min(92, 25 + (progressData.resolutionRate || 0) * 0.9),
        relationshipSatisfaction: Math.min(85, 20 + (progressData.satisfactionScore || 0) * 0.8),
        trustBuilding: Math.min(80, 15 + (progressData.trustScore || 0) * 0.7)
      });

      setRecentAchievements([
        { id: 1, title: 'Completed 5 emotional check-ins', date: '2 days ago', type: 'emotional' },
        { id: 2, title: 'Improved communication score by 15%', date: '1 week ago', type: 'communication' },
        { id: 3, title: 'Resolved 3 relationship challenges', date: '2 weeks ago', type: 'resolution' },
        { id: 4, title: 'Reached 80% harmony score', date: '3 weeks ago', type: 'harmony' }
      ]);
    }
  }, [progressData]);

  const getProgressColor = (value) => {
    if (value >= 80) return '#4ECDC4'; // Calm teal
    if (value >= 60) return '#81C784'; // Soothing green
    if (value >= 40) return '#FFB74D'; // Warm orange
    return '#F06292'; // Gentle pink
  };

  const getProgressLabel = (value) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Developing';
    return 'Beginning';
  };

  const metrics = [
    {
      label: 'Overall Harmony',
      value: harmonyMetrics.overallProgress,
      icon: <HeartIcon />,
      description: 'Your overall relationship harmony score'
    },
    {
      label: 'Emotional Growth',
      value: harmonyMetrics.emotionalGrowth,
      icon: <PsychologyIcon />,
      description: 'Personal emotional development'
    },
    {
      label: 'Communication',
      value: harmonyMetrics.communicationImprovement,
      icon: <InsightsIcon />,
      description: 'Communication effectiveness'
    },
    {
      label: 'Conflict Resolution',
      value: harmonyMetrics.conflictResolution,
      icon: <TrendingUpIcon />,
      description: 'Ability to resolve challenges'
    },
    {
      label: 'Satisfaction',
      value: harmonyMetrics.relationshipSatisfaction,
      icon: <HeartIcon />,
      description: 'Relationship satisfaction level'
    },
    {
      label: 'Trust Building',
      value: harmonyMetrics.trustBuilding,
      icon: <CheckCircleIcon />,
      description: 'Trust and security in relationship'
    }
  ];

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUpIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            Your Harmony Progress
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          Track your relationship growth and celebrate your achievements
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    {metric.icon}
                  </Box>
                  <Typography variant="body2" fontWeight="medium">
                    {metric.label}
                  </Typography>
                </Box>

                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {metric.value}%
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getProgressColor(metric.value),
                      borderRadius: 3
                    }
                  }}
                />

                <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                  {metric.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          p: 2,
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Recent Achievements
          </Typography>
          
          <Grid container spacing={2}>
            {recentAchievements.map((achievement) => (
              <Grid item xs={12} sm={6} key={achievement.id}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.05)'
                }}>
                  <Avatar sx={{ 
                    bgcolor: getProgressColor(80),
                    width: 32,
                    height: 32,
                    mr: 2
                  }}>
                    <CheckCircleIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {achievement.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {achievement.date}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'rgba(78, 205, 196, 0.2)',
          borderRadius: 2,
          border: '1px solid rgba(78, 205, 196, 0.3)'
        }}>
          <Typography variant="body2" fontWeight="medium">
            🎉 Great progress! You're {harmonyMetrics.overallProgress > 70 ? 'exceeding' : 'meeting'} your harmony goals. 
            Keep focusing on {harmonyMetrics.communicationImprovement < 60 ? 'communication' : 'emotional connection'} 
            to continue growing together.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HarmonyProgressChart;
