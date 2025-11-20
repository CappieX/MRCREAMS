import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Paper,
  Avatar,
  Rating,
  Divider
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

const ResolutionRecommendationCard = ({ recommendations }) => {
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const defaultRecommendations = [
    {
      id: 1,
      title: 'Active Listening Practice',
      description: 'Practice reflective listening to understand your partner\'s perspective',
      category: 'Communication',
      difficulty: 'Easy',
      duration: '15 minutes',
      effectiveness: 4.5,
      icon: <ChatIcon />,
      color: '#4ECDC4',
      steps: [
        'Listen without interrupting',
        'Paraphrase what you heard',
        'Ask clarifying questions',
        'Validate their feelings'
      ]
    },
    {
      id: 2,
      title: 'Emotional Check-in Ritual',
      description: 'Create a daily ritual to share emotions and connect',
      category: 'Emotional Connection',
      difficulty: 'Medium',
      duration: '10 minutes',
      effectiveness: 4.8,
      icon: <HeartIcon />,
      color: '#FF6B6B',
      steps: [
        'Set aside dedicated time',
        'Share one emotion each',
        'Listen without judgment',
        'Express appreciation'
      ]
    },
    {
      id: 3,
      title: 'Conflict Resolution Framework',
      description: 'Use a structured approach to resolve disagreements',
      category: 'Conflict Resolution',
      difficulty: 'Medium',
      duration: '30 minutes',
      effectiveness: 4.3,
      icon: <PsychologyIcon />,
      color: '#81C784',
      steps: [
        'Identify the real issue',
        'Use "I" statements',
        'Find common ground',
        'Agree on next steps'
      ]
    },
    {
      id: 4,
      title: 'Gratitude Practice',
      description: 'Daily appreciation to strengthen your bond',
      category: 'Relationship Building',
      difficulty: 'Easy',
      duration: '5 minutes',
      effectiveness: 4.7,
      icon: <HeartIcon />,
      color: '#FFB74D',
      steps: [
        'Share 3 things you appreciate',
        'Be specific and genuine',
        'Listen to your partner\'s gratitude',
        'End with a hug or kiss'
      ]
    }
  ];

  const recommendationsToShow = recommendations || defaultRecommendations;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4ECDC4';
      case 'Medium': return '#FFB74D';
      case 'Hard': return '#F06292';
      default: return '#81C784';
    }
  };

  const handleStartRecommendation = (recommendation) => {
    setSelectedRecommendation(recommendation);
    // Here you would typically start a guided exercise or redirect to a detailed view
    console.log('Starting recommendation:', recommendation.title);
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LightbulbIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Personalized Harmony Guidance
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Based on your emotional patterns, here are personalized recommendations to strengthen your relationship
        </Typography>

        <Grid container spacing={3}>
          {recommendationsToShow.map((recommendation) => (
            <Grid item xs={12} md={6} key={recommendation.id}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: recommendation.color,
                    mr: 2,
                    width: 40,
                    height: 40
                  }}>
                    {recommendation.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {recommendation.title}
                    </Typography>
                    <Chip 
                      label={recommendation.category}
                      size="small"
                      sx={{ 
                        bgcolor: recommendation.color,
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {recommendation.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={recommendation.difficulty}
                    size="small"
                    sx={{ 
                      bgcolor: getDifficultyColor(recommendation.difficulty),
                      color: 'white',
                      mr: 1
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {recommendation.duration}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    value={recommendation.effectiveness} 
                    precision={0.1} 
                    size="small" 
                    readOnly 
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {recommendation.effectiveness}/5 effectiveness
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => handleStartRecommendation(recommendation)}
                  sx={{
                    bgcolor: recommendation.color,
                    color: 'white',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      bgcolor: recommendation.color,
                      opacity: 0.9,
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Start Exercise
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'rgba(78, 205, 196, 0.1)',
          borderRadius: 2,
          border: '1px solid rgba(78, 205, 196, 0.2)'
        }}>
          <Typography variant="body2" color="primary" fontWeight="medium">
            💡 Tip: Start with easier exercises and gradually work your way up. 
            Consistency is more important than perfection in building relationship harmony.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResolutionRecommendationCard;
