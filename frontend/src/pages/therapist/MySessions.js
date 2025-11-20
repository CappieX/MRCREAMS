import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip, Avatar,
  Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, IconButton, Badge
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Videocam as VideoIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  FiberManualRecord as RecordIcon,
  Psychology as EmotionIcon,
  Message as MessageIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { dashboardTheme } from '../../constants/dashboardTheme';

const MySessions = () => {
  const [activeTab, setActiveTab] = useState(0);

  const liveSessions = [
    { id: 1, client: 'Sarah & John M.', duration: '00:45:32', status: 'live', emotion: 'Calm', intensity: 'low', avatar: 'SJ' },
    { id: 2, client: 'David & Lisa K.', duration: '00:12:15', status: 'live', emotion: 'Anger', intensity: 'high', avatar: 'DL' }
  ];

  const scheduledSessions = [
    { id: 3, client: 'Emily R.', time: '11:30 AM', type: 'Individual', status: 'upcoming', avatar: 'ER' },
    { id: 4, client: 'Michael T.', time: '3:30 PM', type: 'Follow-up', status: 'upcoming', avatar: 'MT' }
  ];

  const completedSessions = [
    { id: 5, client: 'Anna & Tom W.', date: 'Yesterday', duration: '60 min', emotion: 'Joy', progress: 85, avatar: 'AT' },
    { id: 6, client: 'Sarah & John M.', date: '2 days ago', duration: '55 min', emotion: 'Calm', progress: 82, avatar: 'SJ' }
  ];

  const getEmotionColor = (emotion) => {
    const colors = {
      'Joy': dashboardTheme.colors.success,
      'Calm': dashboardTheme.colors.chart.teal,
      'Sadness': dashboardTheme.colors.chart.blue,
      'Anger': dashboardTheme.colors.error,
      'Fear': dashboardTheme.colors.chart.purple
    };
    return colors[emotion] || dashboardTheme.colors.text.secondary;
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return dashboardTheme.colors.error;
      case 'medium': return dashboardTheme.colors.warning;
      case 'low': return dashboardTheme.colors.success;
      default: return dashboardTheme.colors.text.secondary;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          My Sessions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage live, scheduled, and completed therapy sessions
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={liveSessions.length} color="error">
                <span>Live Sessions</span>
              </Badge>
            } 
          />
          <Tab label={`Scheduled (${scheduledSessions.length})`} />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      {/* Live Sessions Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {liveSessions.map((session) => (
            <Grid item xs={12} key={session.id}>
              <Card sx={{ 
                border: `2px solid ${dashboardTheme.colors.error}`,
                boxShadow: `0 4px 12px ${dashboardTheme.colors.error}30`
              }}>
                <CardContent>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 56, height: 56, backgroundColor: dashboardTheme.colors.chart.purple }}>
                          {session.avatar}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {session.client}
                            </Typography>
                            <Chip 
                              icon={<RecordIcon sx={{ fontSize: 12 }} />}
                              label="LIVE" 
                              size="small" 
                              color="error"
                              sx={{ animation: 'pulse 2s infinite' }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Duration: {session.duration}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Current Emotion
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <EmotionIcon sx={{ color: getEmotionColor(session.emotion), fontSize: 20 }} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {session.emotion}
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Intensity
                          </Typography>
                          <Chip 
                            label={session.intensity.toUpperCase()} 
                            size="small"
                            sx={{ 
                              mt: 0.5,
                              backgroundColor: `${getIntensityColor(session.intensity)}20`,
                              color: getIntensityColor(session.intensity),
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={<VideoIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          Join Session
                        </Button>
                        <IconButton color="primary">
                          <PauseIcon />
                        </IconButton>
                        <IconButton color="error">
                          <StopIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {liveSessions.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No live sessions at the moment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your scheduled sessions will appear here when they start
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Scheduled Sessions Tab */}
      {activeTab === 1 && (
        <DashboardCard title="Upcoming Sessions" subtitle="Today's schedule">
          <List>
            {scheduledSessions.map((session) => (
              <ListItem
                key={session.id}
                sx={{
                  mb: 1,
                  backgroundColor: dashboardTheme.colors.background,
                  borderRadius: 2
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<StartIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Start Session
                    </Button>
                    <IconButton size="small">
                      <MessageIcon />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVertIcon />
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
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {session.client}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {session.time} • {session.type}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DashboardCard>
      )}

      {/* Completed Sessions Tab */}
      {activeTab === 2 && (
        <DashboardCard title="Recent Sessions" subtitle="Session history">
          <List>
            {completedSessions.map((session) => (
              <ListItem
                key={session.id}
                sx={{
                  mb: 1,
                  backgroundColor: dashboardTheme.colors.background,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: dashboardTheme.colors.surface }
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={`${session.progress}%`} 
                      size="small"
                      sx={{ 
                        backgroundColor: `${dashboardTheme.colors.success}20`,
                        color: dashboardTheme.colors.success,
                        fontWeight: 600
                      }}
                    />
                    <Button size="small" variant="outlined">
                      View Report
                    </Button>
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
                      <Chip 
                        label={session.emotion} 
                        size="small"
                        sx={{ 
                          backgroundColor: `${getEmotionColor(session.emotion)}20`,
                          color: getEmotionColor(session.emotion),
                          fontSize: '11px',
                          height: 20
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {session.date} • {session.duration}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DashboardCard>
      )}
    </Box>
  );
};

export default MySessions;
