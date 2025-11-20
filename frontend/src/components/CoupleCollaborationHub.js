import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  Chat as ChatIcon,
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  TrendingUp as TrendingUpIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const CoupleCollaborationHub = ({ coupleData, onSyncUpdate }) => {
  const [sharedEmotions, setSharedEmotions] = useState([]);
  const [synchronizedProgress, setSynchronizedProgress] = useState({});
  const [collaborativeExercises, setCollaborativeExercises] = useState([]);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);

  useEffect(() => {
    initializeCollaboration();
  }, [coupleData]);

  const initializeCollaboration = () => {
    // Simulate real-time couple data
    setSharedEmotions([
      {
        id: 1,
        partner: 'Partner A',
        emotion: 'grateful',
        intensity: 8,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        message: 'Feeling grateful for our conversation this morning'
      },
      {
        id: 2,
        partner: 'Partner B',
        emotion: 'hopeful',
        intensity: 7,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        message: 'Hopeful about our relationship growth'
      }
    ]);

    setSynchronizedProgress({
      emotionalSync: 85,
      communicationSync: 78,
      goalAlignment: 92,
      conflictResolution: 80,
      intimacyLevel: 88
    });

    setCollaborativeExercises([
      {
        id: 1,
        title: 'Daily Emotional Check-in Together',
        description: 'Share your emotional state and listen to your partner',
        duration: '15 minutes',
        frequency: 'Daily',
        status: 'active',
        progress: 75,
        nextScheduled: 'Today at 7:00 PM'
      },
      {
        id: 2,
        title: 'Weekly Relationship Review',
        description: 'Reflect on the week together and plan for the next',
        duration: '30 minutes',
        frequency: 'Weekly',
        status: 'scheduled',
        progress: 0,
        nextScheduled: 'This Sunday at 2:00 PM'
      },
      {
        id: 3,
        title: 'Conflict Resolution Practice',
        description: 'Practice healthy conflict resolution techniques together',
        duration: '45 minutes',
        frequency: 'As needed',
        status: 'available',
        progress: 0,
        nextScheduled: 'Available anytime'
      }
    ]);

    setRealTimeUpdates([
      {
        id: 1,
        type: 'emotion',
        message: 'Partner A completed emotional check-in',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        icon: <PsychologyIcon />
      },
      {
        id: 2,
        type: 'exercise',
        message: 'Both partners completed Daily Check-in exercise',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
        icon: <CheckCircleIcon />
      },
      {
        id: 3,
        type: 'progress',
        message: 'Relationship harmony score increased by 5%',
        timestamp: new Date(Date.now() - 1000 * 30),
        icon: <TrendingUpIcon />
      }
    ]);
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      grateful: '#4ECDC4',
      hopeful: '#81C784',
      happy: '#FFB74D',
      calm: '#4A90E2',
      excited: '#FF6B6B',
      peaceful: '#8B5FBF'
    };
    return colors[emotion] || '#95A5A6';
  };

  const getEmotionIcon = (emotion) => {
    const icons = {
      grateful: '🙏',
      hopeful: '🌟',
      happy: '😊',
      calm: '😌',
      excited: '🎉',
      peaceful: '🕊️'
    };
    return icons[emotion] || '😐';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#4ECDC4',
      scheduled: '#FFB74D',
      available: '#8B5FBF',
      completed: '#81C784'
    };
    return colors[status] || '#95A5A6';
  };

  const handleStartExercise = (exercise) => {
    console.log('Starting collaborative exercise:', exercise.title);
    // Implement exercise start logic
  };

  const handleShareEmotion = (emotion) => {
    console.log('Sharing emotion:', emotion);
    // Implement emotion sharing logic
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PeopleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Couple Collaboration Hub
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Real-time emotional synchronization and collaborative relationship growth
        </Typography>

        {/* Real-time Updates */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: 'rgba(78, 205, 196, 0.1)',
          borderRadius: 2,
          border: '1px solid rgba(78, 205, 196, 0.2)'
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ mr: 1 }} />
            Live Updates
          </Typography>
          <List>
            {realTimeUpdates.map((update) => (
              <ListItem key={update.id} sx={{ py: 1 }}>
                <ListItemIcon>
                  {update.icon}
                </ListItemIcon>
                <ListItemText
                  primary={update.message}
                  secondary={update.timestamp.toLocaleTimeString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Synchronized Progress */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Synchronized Progress
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(synchronizedProgress).map(([key, value]) => (
              <Grid item xs={6} sm={4} md={2.4} key={key}>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.8)'
                }}>
                  <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                    {value}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: value > 80 ? '#4ECDC4' : value > 60 ? '#FFB74D' : '#FF6B6B',
                        borderRadius: 3
                      }
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Shared Emotions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Shared Emotional States
          </Typography>
          <Grid container spacing={2}>
            {sharedEmotions.map((emotion) => (
              <Grid item xs={12} md={6} key={emotion.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  border: `2px solid ${getEmotionColor(emotion.emotion)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: getEmotionColor(emotion.emotion),
                      mr: 2,
                      width: 40,
                      height: 40
                    }}>
                      {getEmotionIcon(emotion.emotion)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {emotion.partner}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {emotion.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${emotion.intensity}/10`}
                      size="small"
                      sx={{ 
                        bgcolor: getEmotionColor(emotion.emotion),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {emotion.message}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<HeartIcon />}
                    onClick={() => handleShareEmotion(emotion)}
                    sx={{ minHeight: 36 }}
                  >
                    Respond
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ShareIcon />}
                    sx={{ minHeight: 36 }}
                  >
                    Share
                  </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Collaborative Exercises */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Collaborative Exercises
          </Typography>
          <Grid container spacing={3}>
            {collaborativeExercises.map((exercise) => (
              <Grid item xs={12} md={4} key={exercise.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  border: `2px solid ${getStatusColor(exercise.status)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: getStatusColor(exercise.status),
                      mr: 2,
                      width: 40,
                      height: 40
                    }}>
                      <PsychologyIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {exercise.title}
                      </Typography>
                      <Chip 
                        label={exercise.status}
                        size="small"
                        sx={{ 
                          bgcolor: getStatusColor(exercise.status),
                          color: 'white',
                          fontWeight: 'medium'
                        }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {exercise.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Progress: {exercise.progress}%
                      </Typography>
                      <Typography variant="body2">
                        {exercise.duration}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={exercise.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getStatusColor(exercise.status),
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <ScheduleIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      {exercise.nextScheduled}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleStartExercise(exercise)}
                    disabled={exercise.status === 'completed'}
                    sx={{
                      bgcolor: getStatusColor(exercise.status),
                      color: 'white',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: getStatusColor(exercise.status),
                        opacity: 0.9
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(0,0,0,0.1)',
                        color: 'rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    {exercise.status === 'completed' ? 'Completed' : 'Start Exercise'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoupleCollaborationHub;
