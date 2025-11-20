import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

const EmotionalMapVisualization = ({ emotionData }) => {
  const [emotionalMetrics, setEmotionalMetrics] = useState({
    emotionalStability: 0,
    relationshipSatisfaction: 0,
    communicationEffectiveness: 0,
    conflictResolution: 0,
    trustLevel: 0,
    intimacyLevel: 0
  });

  useEffect(() => {
    if (emotionData) {
      // Simulate emotional analysis based on data
      setEmotionalMetrics({
        emotionalStability: Math.min(95, 60 + (emotionData.positiveEmotions || 0) * 5),
        relationshipSatisfaction: Math.min(90, 50 + (emotionData.satisfactionScore || 0) * 4),
        communicationEffectiveness: Math.min(88, 45 + (emotionData.communicationScore || 0) * 4.5),
        conflictResolution: Math.min(92, 40 + (emotionData.resolutionRate || 0) * 6),
        trustLevel: Math.min(85, 35 + (emotionData.trustScore || 0) * 5),
        intimacyLevel: Math.min(80, 30 + (emotionData.intimacyScore || 0) * 5)
      });
    }
  }, [emotionData]);

  const getEmotionalColor = (value) => {
    if (value >= 80) return '#4ECDC4'; // Calm teal
    if (value >= 60) return '#81C784'; // Soothing green
    if (value >= 40) return '#FFB74D'; // Warm orange
    return '#F06292'; // Gentle pink
  };

  const getEmotionalLabel = (value) => {
    if (value >= 80) return 'Excellent';
    if (value >= 60) return 'Good';
    if (value >= 40) return 'Developing';
    return 'Needs Attention';
  };

  const metrics = [
    {
      label: 'Emotional Stability',
      value: emotionalMetrics.emotionalStability,
      icon: <PsychologyIcon />,
      description: 'Your emotional regulation and stability'
    },
    {
      label: 'Relationship Satisfaction',
      value: emotionalMetrics.relationshipSatisfaction,
      icon: <HeartIcon />,
      description: 'Overall satisfaction with your relationship'
    },
    {
      label: 'Communication',
      value: emotionalMetrics.communicationEffectiveness,
      icon: <InsightsIcon />,
      description: 'Effectiveness of your communication patterns'
    },
    {
      label: 'Conflict Resolution',
      value: emotionalMetrics.conflictResolution,
      icon: <TrendingUpIcon />,
      description: 'Your ability to resolve challenges together'
    },
    {
      label: 'Trust Level',
      value: emotionalMetrics.trustLevel,
      icon: <HeartIcon />,
      description: 'Foundation of trust in your relationship'
    },
    {
      label: 'Intimacy',
      value: emotionalMetrics.intimacyLevel,
      icon: <HeartIcon />,
      description: 'Emotional and physical connection'
    }
  ];

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PsychologyIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Your Emotional Map
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Understanding your emotional patterns helps build stronger relationships
        </Typography>

        <Grid container spacing={3}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    color: getEmotionalColor(metric.value),
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {metric.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="medium">
                    {metric.label}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {metric.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ 
                    color: getEmotionalColor(metric.value),
                    mr: 2
                  }}>
                    {metric.value}%
                  </Typography>
                  <Chip 
                    label={getEmotionalLabel(metric.value)}
                    size="small"
                    sx={{ 
                      bgcolor: getEmotionalColor(metric.value),
                      color: 'white',
                      fontWeight: 'medium'
                    }}
                  />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getEmotionalColor(metric.value),
                      borderRadius: 4
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'rgba(78, 205, 196, 0.1)',
          borderRadius: 2,
          border: '1px solid rgba(78, 205, 196, 0.2)'
        }}>
          <Typography variant="body2" color="primary" fontWeight="medium">
            💡 Insight: Your emotional patterns show {emotionalMetrics.emotionalStability > 70 ? 'strong stability' : 'areas for growth'}. 
            Focus on {emotionalMetrics.communicationEffectiveness < 60 ? 'improving communication' : 'maintaining your connection'} 
            to enhance your relationship harmony.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmotionalMapVisualization;
