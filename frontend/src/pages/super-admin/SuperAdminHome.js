import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  LinearProgress, Chip, Alert, IconButton, Tooltip, Divider, Badge
} from '@mui/material';
import {
  People as PeopleIcon,
  Psychology as PsychologyIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import { dashboardTheme } from '../../constants/dashboardTheme';
import { useNavigate } from 'react-router-dom';

// Professional Color Palette
const COLORS = {
  primary: '#6366F1', // Indigo
  secondary: '#8B5CF6', // Purple
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Red
  info: '#3B82F6', // Blue
  
  // Emotion Colors (Intuitive & Vibrant)
  joy: '#FCD34D', // Warm Yellow
  anger: '#EF4444', // Red
  calm: '#10B981', // Green
  sadness: '#3B82F6', // Blue
  fear: '#8B5CF6', // Purple
  
  // Neutrals
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
};

const SuperAdminHome = () => {
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Emotion Trends Data with Intuitive Colors
  const emotionTrends = [
    { time: '00:00', joy: 65, anger: 15, calm: 70, sadness: 25, fear: 20 },
    { time: '04:00', joy: 58, anger: 12, calm: 65, sadness: 22, fear: 18 },
    { time: '08:00', joy: 72, anger: 18, calm: 75, sadness: 28, fear: 22 },
    { time: '12:00', joy: 78, anger: 10, calm: 80, sadness: 20, fear: 15 },
    { time: '16:00', joy: 82, anger: 8, calm: 85, sadness: 18, fear: 12 },
    { time: '20:00', joy: 75, anger: 12, calm: 78, sadness: 22, fear: 16 }
  ];

  // High-Risk Alerts (Priority Widget)
  const highRiskAlerts = [
    { id: 1, client: 'Client A & Partner', therapist: 'Dr. Johnson', score: 9.2, issue: 'Severe Conflict Escalation', time: '15 min ago' },
    { id: 2, client: 'Client B', therapist: 'Dr. Smith', score: 8.8, issue: 'High Anxiety Levels', time: '1 hour ago' },
    { id: 3, client: 'Client C & Partner', therapist: 'Dr. Chen', score: 8.5, issue: 'Communication Breakdown', time: '2 hours ago' }
  ];

  // Model Health Data (70% to 90% trend)
  const modelHealth = [
    { version: 'v3.0', accuracy: 70, confidence: 68 },
    { version: 'v3.1', accuracy: 82, confidence: 80 },
    { version: 'v3.2', accuracy: 90, confidence: 88 }
  ];

  // Conflict Types Distribution
  const conflictTypes = [
    { name: 'Communication', value: 35, color: COLORS.info },
    { name: 'Trust Issues', value: 28, color: COLORS.danger },
    { name: 'Financial', value: 18, color: COLORS.warning },
    { name: 'Intimacy', value: 12, color: COLORS.secondary },
    { name: 'Other', value: 7, color: COLORS.gray300 }
  ];

  const getRiskColor = (score) => {
    if (score >= 8.5) return COLORS.danger;
    if (score >= 7.0) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <Box sx={{ backgroundColor: COLORS.gray50, minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.gray900, mb: 0.5 }}>
            AI Emotion Analysis Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: COLORS.gray600 }}>
              Real-time monitoring • Last updated: {lastUpdate.toLocaleTimeString()}
            </Typography>
            <Chip 
              label="Model v3.2" 
              size="small" 
              sx={{ 
                backgroundColor: COLORS.success, 
                color: 'white', 
                fontWeight: 600,
                fontSize: '11px'
              }} 
            />
          </Box>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton 
            onClick={() => setLastUpdate(new Date())} 
            sx={{ 
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              '&:hover': { backgroundColor: COLORS.gray100 }
            }}
          >
            <RefreshIcon sx={{ color: COLORS.primary }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Key Metrics - Updated Values */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: COLORS.gray600, fontWeight: 500, mb: 0.5 }}>
                    Active Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                    56
                  </Typography>
                </Box>
                <PeopleIcon sx={{ color: COLORS.info, fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="caption" sx={{ color: COLORS.success, fontWeight: 600 }}>
                ↑ 12% from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: COLORS.gray600, fontWeight: 500, mb: 0.5 }}>
                    Active Organizations
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                    12
                  </Typography>
                </Box>
                <BusinessIcon sx={{ color: COLORS.secondary, fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="caption" sx={{ color: COLORS.success, fontWeight: 600 }}>
                ↑ 2 new this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: COLORS.gray600, fontWeight: 500, mb: 0.5 }}>
                    Sessions Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                    28
                  </Typography>
                </Box>
                <TimelineIcon sx={{ color: COLORS.success, fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="caption" sx={{ color: COLORS.success, fontWeight: 600 }}>
                ↑ 8 in progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: COLORS.gray600, fontWeight: 500, mb: 0.5 }}>
                    Emotion Analysis
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                    134
                  </Typography>
                </Box>
                <PsychologyIcon sx={{ color: COLORS.primary, fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="caption" sx={{ color: COLORS.success, fontWeight: 600 }}>
                ↑ Requests processed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 3-Column Grid Layout - Main Content */}
      <Grid container spacing={3}>
        {/* Column 1: High-Risk Alerts (Priority Widget) */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)', 
            borderRadius: 2,
            border: `2px solid ${COLORS.danger}20`,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon sx={{ color: COLORS.danger, fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                    High-Risk Alerts
                  </Typography>
                </Box>
                <Badge badgeContent={highRiskAlerts.length} color="error" />
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {highRiskAlerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    sx={{ 
                      backgroundColor: COLORS.gray50,
                      border: `1px solid ${getRiskColor(alert.score)}30`,
                      borderLeft: `4px solid ${getRiskColor(alert.score)}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                          {alert.client}
                        </Typography>
                        <Chip 
                          label={alert.score.toFixed(1)} 
                          size="small"
                          sx={{ 
                            backgroundColor: getRiskColor(alert.score),
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '12px',
                            height: 24
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: COLORS.danger, fontWeight: 600, mb: 0.5 }}>
                        {alert.issue}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: COLORS.gray600 }}>
                          Therapist: {alert.therapist}
                        </Typography>
                        <Typography variant="caption" sx={{ color: COLORS.gray600 }}>
                          {alert.time}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ 
                  mt: 2, 
                  borderColor: COLORS.danger,
                  color: COLORS.danger,
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: COLORS.danger,
                    backgroundColor: `${COLORS.danger}10`
                  }
                }}
                onClick={() => navigate('/dashboard/super-admin/sessions')}
              >
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Column 2: Emotion Trends */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <InsightsIcon sx={{ color: COLORS.primary, fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                  Emotion Trends
                </Typography>
              </Box>
              
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={emotionTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray200} />
                  <XAxis 
                    dataKey="time" 
                    stroke={COLORS.gray600}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke={COLORS.gray600}
                    style={{ fontSize: '12px' }}
                  />
                  <ChartTooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: `1px solid ${COLORS.gray200}`,
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="joy" 
                    stroke={COLORS.joy} 
                    strokeWidth={3}
                    name="Joy"
                    dot={{ fill: COLORS.joy, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calm" 
                    stroke={COLORS.calm} 
                    strokeWidth={3}
                    name="Calm"
                    dot={{ fill: COLORS.calm, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sadness" 
                    stroke={COLORS.sadness} 
                    strokeWidth={2}
                    name="Sadness"
                    dot={{ fill: COLORS.sadness, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="anger" 
                    stroke={COLORS.anger} 
                    strokeWidth={2}
                    name="Anger"
                    dot={{ fill: COLORS.anger, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fear" 
                    stroke={COLORS.fear} 
                    strokeWidth={2}
                    name="Fear"
                    dot={{ fill: COLORS.fear, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ 
                  mt: 2,
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: COLORS.primary,
                    backgroundColor: `${COLORS.primary}10`
                  }
                }}
                onClick={() => navigate('/dashboard/super-admin/emotion-analysis')}
              >
                View Detailed Analysis
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Column 3: Conflict Types & Model Health */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Conflict Types */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.gray900, mb: 2 }}>
                    Conflict Types
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={conflictTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {conflictTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {conflictTypes.map((type, index) => (
                      <Chip
                        key={index}
                        label={`${type.name} ${type.value}%`}
                        size="small"
                        sx={{
                          backgroundColor: `${type.color}20`,
                          color: type.color,
                          fontWeight: 600,
                          fontSize: '11px'
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Model Health */}
            <Grid item xs={12}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.gray900 }}>
                      Model Health
                    </Typography>
                    <Chip 
                      label="90% Accuracy" 
                      size="small"
                      icon={<CheckCircleIcon />}
                      sx={{ 
                        backgroundColor: COLORS.success,
                        color: 'white',
                        fontWeight: 700
                      }}
                    />
                  </Box>
                  
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={modelHealth}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gray200} />
                      <XAxis 
                        dataKey="version" 
                        stroke={COLORS.gray600}
                        style={{ fontSize: '11px' }}
                      />
                      <YAxis 
                        stroke={COLORS.gray600}
                        style={{ fontSize: '11px' }}
                        domain={[60, 100]}
                      />
                      <ChartTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke={COLORS.success} 
                        strokeWidth={3}
                        name="Accuracy"
                        dot={{ fill: COLORS.success, r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="confidence" 
                        stroke={COLORS.info} 
                        strokeWidth={2}
                        name="Confidence"
                        dot={{ fill: COLORS.info, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  <Box sx={{ mt: 2, p: 2, backgroundColor: COLORS.gray50, borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: COLORS.gray700, fontWeight: 600 }}>
                      Positive Trend: 70% → 90% (+20% improvement)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminHome;
