import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const LiveEmotionPulse = ({ realTimeData, onEmotionUpdate }) => {
  const [currentEmotions, setCurrentEmotions] = useState({
    primary: 'neutral',
    intensity: 5,
    secondary: [],
    trend: 'stable',
    confidence: 85
  });

  const [emotionalHistory, setEmotionalHistory] = useState([]);
  const [aiInsights, setAIInsights] = useState([]);

  useEffect(() => {
    if (realTimeData) {
      analyzeEmotionalState(realTimeData);
    }
  }, [realTimeData]);

  const analyzeEmotionalState = (data) => {
    // Simulate AI emotion analysis
    const emotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'];
    const primary = emotions[Math.floor(Math.random() * emotions.length)];
    const intensity = Math.floor(Math.random() * 10) + 1;
    const trend = ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)];
    
    const newEmotionState = {
      primary,
      intensity,
      secondary: emotions.filter(e => e !== primary).slice(0, 2),
      trend,
      confidence: Math.floor(Math.random() * 20) + 80,
      timestamp: new Date()
    };

    setCurrentEmotions(newEmotionState);
    setEmotionalHistory(prev => [...prev.slice(-9), newEmotionState]);
    
    generateAIInsights(newEmotionState);
    
    if (onEmotionUpdate) {
      onEmotionUpdate(newEmotionState);
    }
  };

  const generateAIInsights = (emotionState) => {
    const insights = [
      {
        type: 'pattern',
        message: `I notice you're feeling ${emotionState.primary} with ${emotionState.intensity}/10 intensity. This pattern suggests you might benefit from a calming exercise.`,
        confidence: emotionState.confidence,
        action: 'suggest_calming_exercise'
      },
      {
        type: 'trend',
        message: `Your emotional trend is ${emotionState.trend}. ${emotionState.trend === 'rising' ? 'Consider taking a moment to breathe and reflect.' : 'Great job maintaining emotional balance!'}`,
        confidence: 90,
        action: 'breathing_exercise'
      },
      {
        type: 'recommendation',
        message: `Based on your current emotional state, I recommend trying our "Emotional Regulation" exercise to help process these feelings.`,
        confidence: 85,
        action: 'emotional_regulation_exercise'
      }
    ];

    setAIInsights(insights.slice(0, 2));
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      joy: '#4ECDC4',
      sadness: '#4A90E2',
      anger: '#FF6B6B',
      fear: '#8B5FBF',
      surprise: '#FFB74D',
      disgust: '#81C784',
      neutral: '#95A5A6'
    };
    return colors[emotion] || '#95A5A6';
  };

  const getEmotionIcon = (emotion) => {
    const icons = {
      joy: '😊',
      sadness: '😢',
      anger: '😠',
      fear: '😨',
      surprise: '😲',
      disgust: '🤢',
      neutral: '😐'
    };
    return icons[emotion] || '😐';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Live Emotion Pulse
            </Typography>
          </Box>
          <IconButton 
            onClick={() => analyzeEmotionalState(realTimeData)}
            sx={{ color: 'white' }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          AI-powered real-time emotional state analysis and insights
        </Typography>

        {/* Current Emotional State */}
        <Paper sx={{ 
          p: 3, 
          mb: 3,
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                bgcolor: getEmotionColor(currentEmotions.primary),
                width: { xs: 60, sm: 80 },
                height: { xs: 60, sm: 80 },
                mx: 'auto',
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}>
                {getEmotionIcon(currentEmotions.primary)}
              </Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {currentEmotions.primary.charAt(0).toUpperCase() + currentEmotions.primary.slice(1)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Primary Emotion
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '2rem', sm: '3rem' } }}>
                  {currentEmotions.intensity}/10
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                  Intensity Level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={currentEmotions.intensity * 10}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getEmotionColor(currentEmotions.primary),
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                  {getTrendIcon(currentEmotions.trend)}
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {currentEmotions.trend.charAt(0).toUpperCase() + currentEmotions.trend.slice(1)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Emotional Trend
                </Typography>
                <Chip 
                  label={`${currentEmotions.confidence}% confidence`}
                  size="small"
                  sx={{ 
                    mt: 1,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Secondary Emotions */}
        {currentEmotions.secondary.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 2, opacity: 0.9 }}>
              Secondary Emotions:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentEmotions.secondary.map((emotion, index) => (
                <Chip
                  key={index}
                  label={`${getEmotionIcon(emotion)} ${emotion}`}
                  sx={{
                    bgcolor: getEmotionColor(emotion),
                    color: 'white',
                    fontWeight: 'medium'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* AI Insights */}
        <Box>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 2, opacity: 0.9 }}>
            AI Insights & Recommendations:
          </Typography>
          {aiInsights.map((insight, index) => (
            <Paper key={index} sx={{ 
              p: 2, 
              mb: 2,
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <InsightsIcon sx={{ mr: 1, mt: 0.5, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {insight.message}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={insight.type}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(78, 205, 196, 0.3)',
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {insight.confidence}% confidence
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiveEmotionPulse;
