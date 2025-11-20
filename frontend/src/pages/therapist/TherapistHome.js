import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Chip, Button,
  LinearProgress, List, ListItem, ListItemAvatar, ListItemText, IconButton, Tooltip, Badge
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as StartIcon,
  MoreVert as MoreVertIcon,
  Videocam as VideoIcon,
  Message as MessageIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import { dashboardTheme } from '../../constants/dashboardTheme';
import { useNavigate } from 'react-router-dom';

const TherapistHome = () => {
  const navigate = useNavigate();

  // Client progress data
  const clientProgressData = [
    { week: 'Week 1', emotional: 45, communication: 50, overall: 45 },
    { week: 'Week 2', emotional: 52, communication: 58, overall: 53 },
    { week: 'Week 3', emotional: 61, communication: 65, overall: 60 },
    { week: 'Week 4', emotional: 68, communication: 72, overall: 68 },
    { week: 'Week 5', emotional: 75, communication: 78, overall: 74 },
    { week: 'Week 6', emotional: 82, communication: 85, overall: 82 }
  ];

  // Today's sessions
  const upcomingSessions = [
    { id: 1, client: 'Sarah & John M.', time: '10:00 AM', type: 'Couples Therapy', status: 'starting-soon', priority: 'high', avatar: 'SJ' },
    { id: 2, client: 'Emily R.', time: '11:30 AM', type: 'Individual Session', status: 'confirmed', priority: 'normal', avatar: 'ER' },
    { id: 3, client: 'David & Lisa K.', time: '2:00 PM', type: 'Conflict Resolution', status: 'confirmed', priority: 'high', avatar: 'DL' },
    { id: 4, client: 'Michael T.', time: '3:30 PM', type: 'Follow-up', status: 'confirmed', priority: 'normal', avatar: 'MT' }
  ];

  // Active clients needing attention
  const clientsNeedingAttention = [
    { id: 1, name: 'David & Lisa K.', issue: 'High conflict intensity', progress: 45, sessions: 4, lastEmotion: 'Anger', avatar: 'DL' },
    { id: 2, name: 'Anna W.', issue: 'Missed last session', progress: 62, sessions: 7, lastEmotion: 'Sadness', avatar: 'AW' }
  ];

  // Emotion distribution this week
  const emotionDistribution = [
    { emotion: 'Joy', count: 145, color: dashboardTheme.colors.success },
    { emotion: 'Calm', count: 132, color: dashboardTheme.colors.chart.teal },
    { emotion: 'Sadness', count: 78, color: dashboardTheme.colors.chart.blue },
    { emotion: 'Anger', count: 45, color: dashboardTheme.colors.error },
    { emotion: 'Fear', count: 32, color: dashboardTheme.colors.chart.purple }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'starting-soon': return 'error';
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return dashboardTheme.colors.success;
    if (progress >= 60) return dashboardTheme.colors.chart.teal;
    if (progress >= 40) return dashboardTheme.colors.warning;
    return dashboardTheme.colors.error;
  };

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Welcome back, Dr. Johnson
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You have 4 sessions scheduled today • 2 clients need attention
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Clients"
            value="24"
            change="+3 this month"
            changeType="increase"
            icon={PeopleIcon}
            color={dashboardTheme.colors.chart.purple}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Sessions Today"
            value="4"
            change="1 starting soon"
            changeType="warning"
            icon={EventNoteIcon}
            color={dashboardTheme.colors.chart.blue}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Progress"
            value="78%"
            change="+5% this week"
            changeType="increase"
            icon={TrendingUpIcon}
            color={dashboardTheme.colors.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Emotion Analysis"
            value="432"
            change="This week"
            changeType="stable"
            icon={PsychologyIcon}
            color={dashboardTheme.colors.chart.teal}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Sessions */}
        <Grid item xs={12} lg={8}>
          <DashboardCard 
            title="Today's Sessions" 
            subtitle="Upcoming appointments"
            action={
              <Button 
                size="small" 
                onClick={() => navigate('/dashboard/therapist/calendar')}
              >
                View Calendar
              </Button>
            }
          >
            <List>
              {upcomingSessions.map((session) => (
                <ListItem
                  key={session.id}
                  sx={{
                    mb: 1,
                    backgroundColor: dashboardTheme.colors.background,
                    borderRadius: 2,
                    border: session.status === 'starting-soon' ? `2px solid ${dashboardTheme.colors.error}` : 'none'
                  }}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {session.status === 'starting-soon' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<StartIcon />}
                          sx={{ textTransform: 'none' }}
                          onClick={() => navigate('/dashboard/therapist/sessions')}
                        >
                          Start Session
                        </Button>
                      )}
                      <IconButton size="small">
                        <VideoIcon />
                      </IconButton>
                      <IconButton size="small">
                        <MessageIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: dashboardTheme.colors.chart.purple }}>
                      {session.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {session.client}
                        </Typography>
                        {session.status === 'starting-soon' && (
                          <Chip label="Starting Soon" size="small" color="error" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {session.time} • {session.type}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DashboardCard>

          {/* Client Progress Chart */}
          <Box sx={{ mt: 3 }}>
            <DashboardCard title="Overall Client Progress" subtitle="Last 6 weeks average">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clientProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke={dashboardTheme.colors.text.secondary} />
                  <YAxis stroke={dashboardTheme.colors.text.secondary} />
                  <ChartTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    stroke={dashboardTheme.colors.chart.purple} 
                    strokeWidth={3}
                    name="Overall Progress"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emotional" 
                    stroke={dashboardTheme.colors.chart.blue} 
                    strokeWidth={2}
                    name="Emotional Health"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="communication" 
                    stroke={dashboardTheme.colors.chart.teal} 
                    strokeWidth={2}
                    name="Communication"
                  />
                </LineChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Clients Needing Attention */}
          <DashboardCard 
            title="Clients Needing Attention" 
            subtitle="Priority follow-ups"
            action={
              <Badge badgeContent={clientsNeedingAttention.length} color="error">
                <WarningIcon color="action" />
              </Badge>
            }
          >
            <List>
              {clientsNeedingAttention.map((client) => (
                <Card 
                  key={client.id}
                  sx={{ 
                    mb: 2, 
                    backgroundColor: dashboardTheme.colors.background,
                    border: `1px solid ${dashboardTheme.colors.error}30`,
                    borderLeft: `4px solid ${dashboardTheme.colors.error}`,
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 2 }
                  }}
                  onClick={() => navigate('/dashboard/therapist/clients')}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {client.avatar}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {client.name}
                        </Typography>
                        <Typography variant="caption" color="error">
                          {client.issue}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {client.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={client.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: `${getProgressColor(client.progress)}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getProgressColor(client.progress)
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {client.sessions} sessions
                      </Typography>
                      <Chip 
                        label={client.lastEmotion} 
                        size="small" 
                        sx={{ height: 18, fontSize: '10px' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/dashboard/therapist/clients')}
            >
              View All Clients
            </Button>
          </DashboardCard>

          {/* Emotion Distribution */}
          <Box sx={{ mt: 3 }}>
            <DashboardCard title="Emotion Distribution" subtitle="This week">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={emotionDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke={dashboardTheme.colors.text.secondary} />
                  <YAxis type="category" dataKey="emotion" stroke={dashboardTheme.colors.text.secondary} />
                  <ChartTooltip />
                  <Bar dataKey="count" fill={dashboardTheme.colors.chart.purple} />
                </BarChart>
              </ResponsiveContainer>
            </DashboardCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TherapistHome;
