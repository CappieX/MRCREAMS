import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Tooltip
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  Insights as InsightsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const AdvancedAnalyticsSuite = ({ analyticsData, relationshipMetrics }) => {
  const [emotionalHealthScore, setEmotionalHealthScore] = useState(0);
  const [resolutionEffectiveness, setResolutionEffectiveness] = useState({});
  const [growthTrajectory, setGrowthTrajectory] = useState({});
  const [benchmarkComparison, setBenchmarkComparison] = useState({});
  const [milestoneAchievements, setMilestoneAchievements] = useState([]);

  useEffect(() => {
    calculateAdvancedAnalytics();
  }, [analyticsData, relationshipMetrics]);

  const calculateAdvancedAnalytics = () => {
    // Simulate advanced analytics calculations
    setEmotionalHealthScore(82);

    setResolutionEffectiveness({
      activeListening: { score: 85, trend: 'increasing', improvement: 12 },
      compromise: { score: 78, trend: 'stable', improvement: 5 },
      emotionalValidation: { score: 92, trend: 'increasing', improvement: 18 },
      conflictPrevention: { score: 70, trend: 'increasing', improvement: 8 },
      professionalHelp: { score: 95, trend: 'stable', improvement: 0 }
    });

    setGrowthTrajectory({
      current: 82,
      projected3Months: 88,
      projected6Months: 92,
      projected1Year: 95,
      growthRate: 15
    });

    setBenchmarkComparison({
      yourScore: 82,
      averageScore: 68,
      topPercentile: 90,
      improvement: 14,
      percentile: 78
    });

    setMilestoneAchievements([
      {
        id: 1,
        title: 'Emotional Intelligence Mastery',
        description: 'Achieved 80%+ emotional awareness score for 30 consecutive days',
        date: '2024-01-15',
        type: 'emotional',
        impact: 'high',
        icon: <PsychologyIcon />
      },
      {
        id: 2,
        title: 'Communication Breakthrough',
        description: 'Successfully resolved 5 major conflicts using new techniques',
        date: '2024-01-10',
        type: 'communication',
        impact: 'high',
        icon: <HeartIcon />
      },
      {
        id: 3,
        title: 'Harmony Streak',
        description: 'Maintained 90%+ relationship satisfaction for 2 weeks',
        date: '2024-01-05',
        type: 'relationship',
        impact: 'medium',
        icon: <CheckCircleIcon />
      },
      {
        id: 4,
        title: 'Conflict Prevention',
        description: 'Identified and prevented 3 potential conflicts',
        date: '2024-01-01',
        type: 'prevention',
        impact: 'medium',
        icon: <WarningIcon />
      }
    ]);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4ECDC4';
    if (score >= 80) return '#81C784';
    if (score >= 70) return '#FFB74D';
    if (score >= 60) return '#FF8A65';
    return '#FF6B6B';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getImpactColor = (impact) => {
    const colors = {
      high: '#4ECDC4',
      medium: '#FFB74D',
      low: '#FF6B6B'
    };
    return colors[impact] || '#95A5A6';
  };

  const getTypeColor = (type) => {
    const colors = {
      emotional: '#4ECDC4',
      communication: '#FF6B6B',
      relationship: '#8B5FBF',
      prevention: '#FFB74D'
    };
    return colors[type] || '#95A5A6';
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AnalyticsIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            Advanced Analytics Suite
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          Deep relationship intelligence powered by AI and machine learning
        </Typography>

        {/* Emotional Health Score */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
              {emotionalHealthScore}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Emotional Health Score
            </Typography>
            <LinearProgress
              variant="determinate"
              value={emotionalHealthScore}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getScoreColor(emotionalHealthScore),
                  borderRadius: 6
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Excellent emotional health with strong relationship foundation
            </Typography>
          </Box>
        </Paper>

        {/* Resolution Effectiveness */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Conflict Resolution Effectiveness
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(resolutionEffectiveness).map(([method, data]) => (
              <Grid item xs={12} sm={6} md={2.4} key={method}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    {data.score}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    {method.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="caption">
                      {getTrendIcon(data.trend)}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      +{data.improvement}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={data.score}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getScoreColor(data.score),
                        borderRadius: 2
                      }
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Growth Trajectory */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Relationship Growth Trajectory
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Current & Projected Scores
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Current Score"
                      secondary={`${growthTrajectory.current}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="3 Months Projection"
                      secondary={`${growthTrajectory.projected3Months}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="6 Months Projection"
                      secondary={`${growthTrajectory.projected6Months}%`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="1 Year Projection"
                      secondary={`${growthTrajectory.projected1Year}%`}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Growth Metrics
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    {growthTrajectory.growthRate}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                    Annual Growth Rate
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Your relationship is growing at an excellent pace, 
                    outpacing 85% of couples in similar situations.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Benchmark Comparison */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Comparative Analysis
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {benchmarkComparison.yourScore}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Your Score
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {benchmarkComparison.averageScore}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Average Score
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {benchmarkComparison.percentile}th
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Percentile
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ 
                p: 2, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  +{benchmarkComparison.improvement}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Above Average
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Milestone Achievements */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Milestone Achievements
          </Typography>
          <Grid container spacing={2}>
            {milestoneAchievements.map((milestone) => (
              <Grid item xs={12} md={6} key={milestone.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderLeft: `4px solid ${getTypeColor(milestone.type)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: getTypeColor(milestone.type),
                      mr: 2,
                      width: 40,
                      height: 40
                    }}>
                      {milestone.icon}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {new Date(milestone.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={milestone.impact}
                      size="small"
                      sx={{ 
                        bgcolor: getImpactColor(milestone.impact),
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {milestone.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalyticsSuite;
