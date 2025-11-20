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
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Favorite as HeartIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';

const HarmonyGamificationSystem = ({ userProgress, coupleData }) => {
  const [harmonyPoints, setHarmonyPoints] = useState(0);
  const [achievementBadges, setAchievementBadges] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [challenges, setChallenges] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);

  useEffect(() => {
    initializeGamification();
  }, [userProgress, coupleData]);

  const initializeGamification = () => {
    // Simulate user progress data
    setHarmonyPoints(2847);
    setCurrentStreak(12);
    setLevel(5);

    setAchievementBadges([
      {
        id: 1,
        name: 'Emotional Intelligence Master',
        description: 'Completed 30 emotional check-ins',
        icon: <PsychologyIcon />,
        rarity: 'legendary',
        earned: true,
        date: '2024-01-15'
      },
      {
        id: 2,
        name: 'Communication Champion',
        description: 'Successfully resolved 10 conflicts',
        icon: <HeartIcon />,
        rarity: 'epic',
        earned: true,
        date: '2024-01-10'
      },
      {
        id: 3,
        name: 'Harmony Builder',
        description: 'Maintained 7-day harmony streak',
        icon: <TrophyIcon />,
        rarity: 'rare',
        earned: true,
        date: '2024-01-08'
      },
      {
        id: 4,
        name: 'Reflection Guru',
        description: 'Completed 50 journal entries',
        icon: <StarIcon />,
        rarity: 'epic',
        earned: false,
        progress: 35
      },
      {
        id: 5,
        name: 'Couple Connection',
        description: 'Completed 5 collaborative exercises',
        icon: <HeartIcon />,
        rarity: 'rare',
        earned: false,
        progress: 60
      }
    ]);

    setChallenges([
      {
        id: 1,
        title: 'Daily Harmony Check-in',
        description: 'Complete your daily emotional check-in',
        type: 'daily',
        points: 50,
        progress: 100,
        completed: true,
        streak: 12
      },
      {
        id: 2,
        title: 'Weekly Reflection',
        description: 'Write 3 journal entries this week',
        type: 'weekly',
        points: 150,
        progress: 66,
        completed: false,
        streak: 0
      },
      {
        id: 3,
        title: 'Communication Practice',
        description: 'Complete 5 communication exercises',
        type: 'monthly',
        points: 300,
        progress: 40,
        completed: false,
        streak: 0
      },
      {
        id: 4,
        title: 'Couple Challenge',
        description: 'Complete a collaborative exercise with your partner',
        type: 'couple',
        points: 200,
        progress: 0,
        completed: false,
        streak: 0
      }
    ]);

    setRecentAchievements([
      {
        id: 1,
        title: 'Emotional Intelligence Master',
        points: 500,
        date: '2024-01-15',
        icon: <PsychologyIcon />
      },
      {
        id: 2,
        title: '12-Day Streak',
        points: 200,
        date: '2024-01-14',
        icon: <FireIcon />
      },
      {
        id: 3,
        title: 'Communication Breakthrough',
        points: 300,
        date: '2024-01-12',
        icon: <HeartIcon />
      }
    ]);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#95A5A6',
      rare: '#4ECDC4',
      epic: '#8B5FBF',
      legendary: '#FFB74D',
      mythic: '#FF6B6B'
    };
    return colors[rarity] || '#95A5A6';
  };

  const getRarityIcon = (rarity) => {
    const icons = {
      common: '⭐',
      rare: '💎',
      epic: '🏆',
      legendary: '👑',
      mythic: '🌟'
    };
    return icons[rarity] || '⭐';
  };

  const getTypeColor = (type) => {
    const colors = {
      daily: '#4ECDC4',
      weekly: '#FFB74D',
      monthly: '#8B5FBF',
      couple: '#FF6B6B'
    };
    return colors[type] || '#95A5A6';
  };

  const getLevelProgress = () => {
    const pointsInLevel = harmonyPoints % 1000;
    return (pointsInLevel / 1000) * 100;
  };

  const getNextLevelPoints = () => {
    return 1000 - (harmonyPoints % 1000);
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrophyIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Harmony Gamification
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Earn points, unlock achievements, and build your relationship skills through engaging challenges
        </Typography>

        {/* User Stats */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: 'rgba(78, 205, 196, 0.1)',
          borderRadius: 2,
          border: '1px solid rgba(78, 205, 196, 0.2)'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  {harmonyPoints.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Harmony Points
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  Level {level}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getLevelProgress()}
                  sx={{
                    mt: 1,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#4ECDC4',
                      borderRadius: 3
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {getNextLevelPoints()} points to next level
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  {currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Day Streak
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <FireIcon sx={{ color: '#FF6B6B', mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    On fire!
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                  {achievementBadges.filter(badge => badge.earned).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Achievements
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <TrophyIcon sx={{ color: '#FFB74D', mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {achievementBadges.length} total
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Current Challenges */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Active Challenges
          </Typography>
          <Grid container spacing={2}>
            {challenges.map((challenge) => (
              <Grid item xs={12} md={6} key={challenge.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  border: `2px solid ${getTypeColor(challenge.type)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: getTypeColor(challenge.type),
                      mr: 2,
                      width: 40,
                      height: 40
                    }}>
                      {challenge.type === 'daily' ? <ScheduleIcon /> :
                       challenge.type === 'weekly' ? <StarIcon /> :
                       challenge.type === 'monthly' ? <TrophyIcon /> : <HeartIcon />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {challenge.title}
                      </Typography>
                      <Chip 
                        label={challenge.type}
                        size="small"
                        sx={{ 
                          bgcolor: getTypeColor(challenge.type),
                          color: 'white',
                          fontWeight: 'medium'
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {challenge.points} pts
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {challenge.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Progress: {challenge.progress}%
                      </Typography>
                      {challenge.streak > 0 && (
                        <Typography variant="body2" color="primary">
                          {challenge.streak} day streak
                        </Typography>
                      )}
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={challenge.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getTypeColor(challenge.type),
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    disabled={challenge.completed}
                    fullWidth
                    sx={{
                      bgcolor: getTypeColor(challenge.type),
                      color: 'white',
                      borderRadius: 2,
                      py: 1.5,
                      minHeight: 48,
                      '&:hover': {
                        bgcolor: getTypeColor(challenge.type),
                        opacity: 0.9
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(0,0,0,0.1)',
                        color: 'rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    {challenge.completed ? 'Completed' : 'Continue Challenge'}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Achievement Badges */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Achievement Badges
          </Typography>
          <Grid container spacing={2}>
            {achievementBadges.map((badge) => (
              <Grid item xs={12} sm={6} md={4} key={badge.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: badge.earned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                  border: `2px solid ${getRarityColor(badge.rarity)}`,
                  opacity: badge.earned ? 1 : 0.7,
                  position: 'relative'
                }}>
                  {badge.earned && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      bgcolor: getRarityColor(badge.rarity),
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: getRarityColor(badge.rarity),
                      mr: 2,
                      width: 50,
                      height: 50
                    }}>
                      {badge.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {badge.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption">
                          {getRarityIcon(badge.rarity)}
                        </Typography>
                        <Chip 
                          label={badge.rarity}
                          size="small"
                          sx={{ 
                            bgcolor: getRarityColor(badge.rarity),
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {badge.description}
                  </Typography>

                  {!badge.earned && badge.progress && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          Progress: {badge.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={badge.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getRarityColor(badge.rarity),
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  )}

                  {badge.earned && (
                    <Typography variant="caption" color="text.secondary">
                      Earned on {new Date(badge.date).toLocaleDateString()}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent Achievements */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Recent Achievements
          </Typography>
          <List>
            {recentAchievements.map((achievement) => (
              <React.Fragment key={achievement.id}>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(78, 205, 196, 0.2)',
                      width: 40,
                      height: 40
                    }}>
                      {achievement.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={achievement.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(achievement.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="medium">
                          +{achievement.points} points
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HarmonyGamificationSystem;
