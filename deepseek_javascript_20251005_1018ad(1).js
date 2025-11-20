import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Grid,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Warning, 
  Info, 
  Lightbulb, 
  TrendingUp, 
  Psychology,
  Refresh,
  CheckCircle,
  Error
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'info'
};

const priorityIcons = {
  high: Warning,
  medium: Info,
  low: Lightbulb
};

const generalTips = [
  "Schedule regular check-ins to discuss concerns before they escalate",
  "Practice active listening - paraphrase what you heard before responding",
  "Choose appropriate timing for important discussions (avoid late nights or stressful times)",
  "Use 'I feel' statements instead of 'You always' accusations",
  "Take breaks during heated discussions to cool down and regain perspective",
  "Focus on finding solutions rather than assigning blame",
  "Acknowledge each other's feelings and perspectives, even when you disagree",
  "Set clear boundaries and expectations to prevent misunderstandings",
  "Celebrate successful conflict resolutions to reinforce positive communication",
  "Consider couples counseling if patterns persist despite efforts"
];

export default function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/recommendations`);
      setData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Recommendations & Insights</Typography>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Analyzing your conflict patterns...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Recommendations & Insights</Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" startIcon={<Refresh />} onClick={fetchRecommendations}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Recommendations & Insights</Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />} 
          onClick={fetchRecommendations}
        >
          Refresh
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" paragraph>
        AI-powered insights and suggestions based on your conflict patterns.
      </Typography>

      {/* Current Trends */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp /> Current Trends
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="primary" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  {data.recentTrends.totalRecent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  conflicts in {data.recentTrends.recentTimeframe}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="warning.main" gutterBottom>
                  Average Intensity
                </Typography>
                <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                  {data.recentTrends.avgRecentIntensity.toFixed(1)}/10
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  recent conflict intensity
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Recommendations */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology /> Personalized Recommendations
        </Typography>
        
        {data.recommendations.length === 0 ? (
          <Alert severity="success" icon={<CheckCircle />}>
            <Typography variant="h6" gutterBottom>
              Excellent Communication Patterns!
            </Typography>
            <Typography>
              Your conflict data shows healthy communication habits. Keep focusing on constructive resolution 
              and timely communication.
            </Typography>
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.recommendations.map((rec, index) => {
              const IconComponent = priorityIcons[rec.priority];
              return (
                <Card 
                  key={index} 
                  variant="outlined"
                  sx={{
                    borderLeft: 4,
                    borderLeftColor: `${priorityColors[rec.priority]}.main`,
                    '&:hover': {
                      boxShadow: 1
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <IconComponent 
                        color={priorityColors[rec.priority]} 
                        sx={{ mt: 0.5 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h6" component="span">
                            {rec.title}
                          </Typography>
                          <Chip 
                            label={rec.priority.toUpperCase()} 
                            color={priorityColors[rec.priority]}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body1" paragraph>
                          {rec.message}
                        </Typography>
                        {rec.suggestion && (
                          <Alert 
                            severity="info" 
                            sx={{ mt: 1 }}
                            icon={<Lightbulb />}
                          >
                            <strong>Suggestion:</strong> {rec.suggestion}
                          </Alert>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Pattern Insights */}
      {data.patterns && data.patterns.topReasons.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pattern Insights
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Most Common Reasons
              </Typography>
              <List dense>
                {data.patterns.topReasons.slice(0, 3).map((reason, index) => (
                  <ListItem key={reason.conflict_reason}>
                    <ListItemIcon>
                      <Chip 
                        label={index + 1} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={reason.conflict_reason}
                      secondary={`${reason.count} occurrences, Avg intensity: ${reason.avg_intensity.toFixed(1)}/10`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Peak Conflict Times
              </Typography>
              <List dense>
                {data.patterns.peakTimes.slice(0, 3).map((time, index) => (
                  <ListItem key={time.hour}>
                    <ListItemIcon>
                      <Chip 
                        label={index + 1} 
                        size="small" 
                        color="secondary"
                        variant="outlined"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Around ${time.hour}:00`}
                      secondary={`${time.count} conflicts, Avg intensity: ${time.avg_intensity.toFixed(1)}/10`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* General Tips */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lightbulb /> General Relationship Tips
        </Typography>
        <Grid container spacing={2}>
          {generalTips.map((tip, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <CheckCircle color="success" sx={{ fontSize: 20, mt: 0.25 }} />
                    <Typography variant="body2">
                      {tip}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}