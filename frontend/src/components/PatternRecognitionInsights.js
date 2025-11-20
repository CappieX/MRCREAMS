import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

const PatternRecognitionInsights = ({ emotionalData, relationshipData }) => {
  const [patterns, setPatterns] = useState({
    emotionalTriggers: [],
    communicationPatterns: [],
    conflictEscalation: [],
    resolutionSuccess: [],
    emotionalCycles: []
  });

  const [aiInsights, setAIInsights] = useState([]);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    if (emotionalData && relationshipData) {
      analyzePatterns();
    }
  }, [emotionalData, relationshipData]);

  const analyzePatterns = () => {
    // Simulate AI pattern analysis
    const detectedPatterns = {
      emotionalTriggers: [
        { trigger: 'Stress at work', frequency: 85, impact: 'high', category: 'external' },
        { trigger: 'Financial discussions', frequency: 70, impact: 'medium', category: 'communication' },
        { trigger: 'Family obligations', frequency: 60, impact: 'medium', category: 'external' },
        { trigger: 'Feeling unheard', frequency: 90, impact: 'high', category: 'emotional' }
      ],
      communicationPatterns: [
        { pattern: 'Defensive responses', frequency: 75, trend: 'decreasing' },
        { pattern: 'Active listening', frequency: 65, trend: 'increasing' },
        { pattern: 'Emotional validation', frequency: 80, trend: 'stable' },
        { pattern: 'Solution-focused language', frequency: 70, trend: 'increasing' }
      ],
      conflictEscalation: [
        { stage: 'Initial tension', duration: '5-10 minutes', frequency: 80 },
        { stage: 'Emotional intensity', duration: '15-30 minutes', frequency: 60 },
        { stage: 'Resolution attempts', duration: '10-20 minutes', frequency: 70 },
        { stage: 'Cooling down', duration: '30-60 minutes', frequency: 85 }
      ],
      resolutionSuccess: [
        { method: 'Active listening', success: 85, frequency: 70 },
        { method: 'Taking breaks', success: 90, frequency: 60 },
        { method: 'Compromise', success: 75, frequency: 80 },
        { method: 'Professional help', success: 95, frequency: 20 }
      ],
      emotionalCycles: [
        { cycle: 'Weekly emotional check-ins', health: 80, consistency: 85 },
        { cycle: 'Conflict resolution timing', health: 70, consistency: 75 },
        { cycle: 'Intimacy and connection', health: 85, consistency: 90 }
      ]
    };

    setPatterns(detectedPatterns);
    generateAIInsights(detectedPatterns);
    generatePredictions(detectedPatterns);
  };

  const generateAIInsights = (patterns) => {
    const insights = [
      {
        type: 'strength',
        title: 'Communication Strength',
        message: 'Your active listening skills have improved by 15% over the past month. This is a strong foundation for resolving conflicts.',
        confidence: 92,
        action: 'continue_practice',
        icon: <CheckCircleIcon />
      },
      {
        type: 'opportunity',
        title: 'Growth Opportunity',
        message: 'I notice stress at work is a frequent trigger. Consider implementing stress-reduction techniques before difficult conversations.',
        confidence: 88,
        action: 'stress_management',
        icon: <WarningIcon />
      },
      {
        type: 'pattern',
        title: 'Emotional Pattern',
        message: 'Your emotional cycles show strong consistency in intimacy and connection. This suggests a healthy emotional foundation.',
        confidence: 85,
        action: 'maintain_connection',
        icon: <HeartIcon />
      },
      {
        type: 'prediction',
        title: 'Future Insight',
        message: 'Based on your patterns, you\'re likely to have a successful resolution if you address conflicts within the first 15 minutes.',
        confidence: 90,
        action: 'early_intervention',
        icon: <TrendingUpIcon />
      }
    ];

    setAIInsights(insights);
  };

  const generatePredictions = (patterns) => {
    setPredictions({
      nextConflictRisk: 25,
      resolutionSuccess: 85,
      emotionalStability: 78,
      relationshipGrowth: 82,
      communicationImprovement: 88
    });
  };

  const getPatternColor = (type) => {
    const colors = {
      strength: '#4ECDC4',
      opportunity: '#FFB74D',
      pattern: '#8B5FBF',
      prediction: '#FF6B6B',
      warning: '#F06292'
    };
    return colors[type] || '#95A5A6';
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFB74D';
      case 'low': return '#4ECDC4';
      default: return '#95A5A6';
    }
  };

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
            AI Pattern Recognition
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Advanced AI analysis of your emotional and relationship patterns
        </Typography>

        {/* AI Insights */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Intelligent Insights
          </Typography>
          <Grid container spacing={2}>
            {aiInsights.map((insight, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  border: `2px solid ${getPatternColor(insight.type)}`,
                  bgcolor: 'rgba(255,255,255,0.8)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: getPatternColor(insight.type),
                      mr: 2,
                      width: 32,
                      height: 32
                    }}>
                      {insight.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {insight.message}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={insight.type}
                      size="small"
                      sx={{ 
                        bgcolor: getPatternColor(insight.type),
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {insight.confidence}% confidence
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Emotional Triggers */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Emotional Triggers
          </Typography>
          <Grid container spacing={2}>
            {patterns.emotionalTriggers.map((trigger, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.8)' }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    {trigger.trigger}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      {trigger.frequency}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={trigger.frequency}
                      sx={{
                        flexGrow: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getImpactColor(trigger.impact),
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                  <Chip 
                    label={trigger.impact}
                    size="small"
                    sx={{ 
                      bgcolor: getImpactColor(trigger.impact),
                      color: 'white',
                      fontWeight: 'medium'
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Predictions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Predictive Analytics
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(predictions).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={2.4} key={key}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.8)'
                }}>
                  <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    {value}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Communication Patterns */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Communication Patterns
          </Typography>
          <List>
            {patterns.communicationPatterns.map((pattern, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <InsightsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={pattern.pattern}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Typography variant="body2">
                          Frequency: {pattern.frequency}%
                        </Typography>
                        <Chip 
                          label={pattern.trend}
                          size="small"
                          sx={{ 
                            bgcolor: pattern.trend === 'increasing' ? '#4ECDC4' : 
                                   pattern.trend === 'decreasing' ? '#FF6B6B' : '#FFB74D',
                            color: 'white'
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {index < patterns.communicationPatterns.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatternRecognitionInsights;
