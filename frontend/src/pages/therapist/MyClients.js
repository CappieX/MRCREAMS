import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Chip, Button,
  LinearProgress, TextField, InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Message as MessageIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { dashboardTheme } from '../../constants/dashboardTheme';

const MyClients = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const clients = [
    { 
      id: 1, 
      name: 'Sarah & John M.', 
      avatar: 'SJ', 
      progress: 82, 
      trend: 'up',
      sessions: 12, 
      lastSession: '2 days ago',
      status: 'excellent',
      nextSession: 'Tomorrow, 10:00 AM',
      primaryEmotion: 'Joy',
      notes: 'Making great progress with communication'
    },
    { 
      id: 2, 
      name: 'Emily R.', 
      avatar: 'ER', 
      progress: 68, 
      trend: 'up',
      sessions: 8, 
      lastSession: '1 week ago',
      status: 'good',
      nextSession: 'Today, 11:30 AM',
      primaryEmotion: 'Calm',
      notes: 'Working on anxiety management'
    },
    { 
      id: 3, 
      name: 'David & Lisa K.', 
      avatar: 'DL', 
      progress: 45, 
      trend: 'down',
      sessions: 4, 
      lastSession: '3 days ago',
      status: 'needs-attention',
      nextSession: 'Today, 2:00 PM',
      primaryEmotion: 'Anger',
      notes: 'High conflict - requires intervention'
    },
    { 
      id: 4, 
      name: 'Michael T.', 
      avatar: 'MT', 
      progress: 91, 
      trend: 'up',
      sessions: 15, 
      lastSession: '1 day ago',
      status: 'excellent',
      nextSession: 'Friday, 3:30 PM',
      primaryEmotion: 'Joy',
      notes: 'Ready for maintenance phase'
    },
    { 
      id: 5, 
      name: 'Anna & Tom W.', 
      avatar: 'AW', 
      progress: 75, 
      trend: 'up',
      sessions: 10, 
      lastSession: '4 days ago',
      status: 'good',
      nextSession: 'Next week',
      primaryEmotion: 'Calm',
      notes: 'Steady improvement in trust building'
    }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 80) return dashboardTheme.colors.success;
    if (progress >= 60) return dashboardTheme.colors.chart.teal;
    if (progress >= 40) return dashboardTheme.colors.warning;
    return dashboardTheme.colors.error;
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'excellent': return { label: 'Excellent', color: 'success' };
      case 'good': return { label: 'Good Progress', color: 'info' };
      case 'needs-attention': return { label: 'Needs Attention', color: 'error' };
      default: return { label: status, color: 'default' };
    }
  };

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

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            My Clients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {clients.length} active clients • {clients.filter(c => c.status === 'needs-attention').length} need attention
          </Typography>
        </Box>
        <Button variant="contained" sx={{ textTransform: 'none' }}>
          Add New Client
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search clients by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Client Cards */}
      <Grid container spacing={3}>
        {filteredClients.map((client) => {
          const statusInfo = getStatusLabel(client.status);
          return (
            <Grid item xs={12} md={6} lg={4} key={client.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: client.status === 'needs-attention' ? `2px solid ${dashboardTheme.colors.error}` : 'none',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        backgroundColor: dashboardTheme.colors.chart.purple,
                        fontSize: 20,
                        fontWeight: 600
                      }}
                    >
                      {client.avatar}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {client.name}
                      </Typography>
                      <Chip 
                        label={statusInfo.label} 
                        size="small" 
                        color={statusInfo.color}
                        sx={{ height: 20, fontSize: '11px' }}
                      />
                    </Box>
                  </Box>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Overall Progress
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {client.trend === 'up' ? (
                          <TrendingUpIcon sx={{ fontSize: 16, color: dashboardTheme.colors.success }} />
                        ) : (
                          <TrendingDownIcon sx={{ fontSize: 16, color: dashboardTheme.colors.error }} />
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {client.progress}%
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={client.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${getProgressColor(client.progress)}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProgressColor(client.progress),
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  {/* Stats */}
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Sessions
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {client.sessions} completed
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Primary Emotion
                      </Typography>
                      <Chip 
                        label={client.primaryEmotion} 
                        size="small"
                        sx={{ 
                          height: 20,
                          fontSize: '11px',
                          backgroundColor: `${getEmotionColor(client.primaryEmotion)}20`,
                          color: getEmotionColor(client.primaryEmotion),
                          fontWeight: 600
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Notes */}
                  <Box sx={{ mb: 2, p: 1.5, backgroundColor: dashboardTheme.colors.background, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Latest Notes
                    </Typography>
                    <Typography variant="body2">
                      {client.notes}
                    </Typography>
                  </Box>

                  {/* Next Session */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Next Session
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {client.nextSession}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Send Message">
                      <IconButton size="small" sx={{ backgroundColor: dashboardTheme.colors.background }}>
                        <MessageIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Schedule Session">
                      <IconButton size="small" sx={{ backgroundColor: dashboardTheme.colors.background }}>
                        <EventIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Reports">
                      <IconButton size="small" sx={{ backgroundColor: dashboardTheme.colors.background }}>
                        <AssessmentIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      sx={{ ml: 1, textTransform: 'none' }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredClients.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No clients found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MyClients;
