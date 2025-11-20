import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  Chip,
  Avatar,
  Rating,
  LinearProgress,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Favorite as HeartIcon,
  PlayArrow as PlayIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const AdvancedRecommendationEngine = ({ userProfile, emotionalState, relationshipData }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [personalizedExercises, setPersonalizedExercises] = useState([]);
  const [therapistMatches, setTherapistMatches] = useState([]);
  const [successPredictions, setSuccessPredictions] = useState({});

  useEffect(() => {
    generateRecommendations();
  }, [userProfile, emotionalState, relationshipData]);

  const generateRecommendations = () => {
    // Simulate AI-powered recommendation generation
    const aiRecommendations = [
      {
        id: 1,
        title: 'Emotional Regulation Mastery',
        description: 'Advanced techniques for managing intense emotions during conflicts',
        category: 'Emotional Intelligence',
        difficulty: 'Advanced',
        duration: '45 minutes',
        effectiveness: 4.8,
        successRate: 92,
        personalizedFor: 'High emotional intensity patterns',
        aiConfidence: 95,
        exercises: [
          'Breathing meditation with emotional awareness',
          'Progressive muscle relaxation',
          'Cognitive reframing techniques',
          'Emotional validation practice'
        ],
        prerequisites: ['Basic emotional awareness', 'Meditation experience'],
        expectedOutcome: 'Reduced emotional reactivity by 40%',
        icon: <PsychologyIcon />,
        color: '#4ECDC4'
      },
      {
        id: 2,
        title: 'Conflict Resolution Framework',
        description: 'Structured approach to resolving relationship challenges',
        category: 'Communication',
        difficulty: 'Intermediate',
        duration: '30 minutes',
        effectiveness: 4.6,
        successRate: 88,
        personalizedFor: 'Communication pattern analysis',
        aiConfidence: 90,
        exercises: [
          'Active listening practice',
          'I-statement formulation',
          'Compromise identification',
          'Resolution planning'
        ],
        prerequisites: ['Basic communication skills'],
        expectedOutcome: 'Improved resolution success by 35%',
        icon: <HeartIcon />,
        color: '#FF6B6B'
      },
      {
        id: 3,
        title: 'Intimacy Building Workshop',
        description: 'Deep connection exercises for relationship growth',
        category: 'Intimacy',
        difficulty: 'Beginner',
        duration: '60 minutes',
        effectiveness: 4.9,
        successRate: 95,
        personalizedFor: 'Relationship satisfaction patterns',
        aiConfidence: 88,
        exercises: [
          'Emotional vulnerability sharing',
          'Love language discovery',
          'Physical connection exercises',
          'Future visioning together'
        ],
        prerequisites: ['Open communication', 'Trust foundation'],
        expectedOutcome: 'Increased intimacy satisfaction by 50%',
        icon: <HeartIcon />,
        color: '#8B5FBF'
      },
      {
        id: 4,
        title: 'Stress Management for Couples',
        description: 'Coping strategies for external stress affecting relationships',
        category: 'Stress Management',
        difficulty: 'Intermediate',
        duration: '40 minutes',
        effectiveness: 4.4,
        successRate: 85,
        personalizedFor: 'External stress trigger patterns',
        aiConfidence: 90,
        exercises: [
          'Stress identification and communication',
          'Coping strategy development',
          'Support system building',
          'Boundary setting practice'
        ],
        prerequisites: ['Self-awareness', 'Communication skills'],
        expectedOutcome: 'Reduced stress impact on relationship by 45%',
        icon: <TrendingUpIcon />,
        color: '#FFB74D'
      }
    ];

    setRecommendations(aiRecommendations);

    // Generate personalized exercises based on AI analysis
    const personalizedExercises = [
      {
        id: 1,
        name: 'Daily Emotional Check-in',
        frequency: 'Daily',
        duration: '10 minutes',
        aiRecommendation: 'Based on your emotional pattern analysis',
        successProbability: 85
      },
      {
        id: 2,
        name: 'Weekly Relationship Review',
        frequency: 'Weekly',
        duration: '30 minutes',
        aiRecommendation: 'Optimized for your communication style',
        successProbability: 90
      },
      {
        id: 3,
        name: 'Conflict Prevention Practice',
        frequency: 'As needed',
        duration: '15 minutes',
        aiRecommendation: 'Triggered by your stress indicators',
        successProbability: 80
      }
    ];

    setPersonalizedExercises(personalizedExercises);

    // Generate therapist matches
    const therapistMatches = [
      {
        id: 1,
        name: 'Dr. Sarah Chen',
        specialization: 'Couples Therapy & Emotional Intelligence',
        experience: '12 years',
        matchScore: 95,
        approach: 'Cognitive-Behavioral with Emotion Focus',
        availability: 'Available this week',
        rating: 4.9,
        price: '$150/session',
        specialties: ['Conflict Resolution', 'Emotional Regulation', 'Communication']
      },
      {
        id: 2,
        name: 'Michael Rodriguez, LMFT',
        specialization: 'Relationship Dynamics & Communication',
        experience: '8 years',
        matchScore: 88,
        approach: 'Gottman Method & Emotionally Focused Therapy',
        availability: 'Available next week',
        rating: 4.8,
        price: '$120/session',
        specialties: ['Intimacy Building', 'Trust Repair', 'Family Dynamics']
      }
    ];

    setTherapistMatches(therapistMatches);

    // Generate success predictions
    setSuccessPredictions({
      overallSuccess: 87,
      emotionalGrowth: 82,
      communicationImprovement: 90,
      relationshipSatisfaction: 85,
      conflictResolution: 88
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#4ECDC4',
      'Intermediate': '#FFB74D',
      'Advanced': '#FF6B6B',
      'Expert': '#8B5FBF'
    };
    return colors[difficulty] || '#95A5A6';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Emotional Intelligence': '#4ECDC4',
      'Communication': '#FF6B6B',
      'Intimacy': '#8B5FBF',
      'Stress Management': '#FFB74D'
    };
    return colors[category] || '#95A5A6';
  };

  const handleStartExercise = (recommendation) => {
    console.log('Starting exercise:', recommendation.title);
    // Implement exercise start logic
  };

  const handleBookmark = (recommendation) => {
    console.log('Bookmarking:', recommendation.title);
    // Implement bookmark logic
  };

  const handleShare = (recommendation) => {
    console.log('Sharing:', recommendation.title);
    // Implement share logic
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
          <LightbulbIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            AI-Powered Recommendations
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          Personalized guidance powered by machine learning and emotional pattern analysis
        </Typography>

        {/* Success Predictions */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Success Predictions
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(successPredictions).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={2.4} key={key}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    {value}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={value}
                    sx={{
                      mt: 1,
                      height: 4,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: value > 80 ? '#4ECDC4' : value > 60 ? '#FFB74D' : '#FF6B6B',
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* AI Recommendations */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Personalized Recommendations
          </Typography>
          <Grid container spacing={2}>
            {recommendations.map((recommendation) => (
              <Grid item xs={12} sm={6} md={6} key={recommendation.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
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
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {recommendation.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip 
                          label={recommendation.category}
                          size="small"
                          sx={{ 
                            bgcolor: getCategoryColor(recommendation.category),
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                        />
                        <Chip 
                          label={recommendation.difficulty}
                          size="small"
                          sx={{ 
                            bgcolor: getDifficultyColor(recommendation.difficulty),
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleBookmark(recommendation)} size="small">
                        <BookmarkIcon />
                      </IconButton>
                      <IconButton onClick={() => handleShare(recommendation)} size="small">
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    {recommendation.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      AI Analysis:
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      {recommendation.personalizedFor}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating 
                        value={recommendation.effectiveness} 
                        precision={0.1} 
                        size="small" 
                        readOnly 
                      />
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {recommendation.effectiveness}/5 effectiveness
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {recommendation.successRate}% success rate
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      Expected Outcome:
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {recommendation.expectedOutcome}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleStartExercise(recommendation)}
                    startIcon={<PlayIcon />}
                    fullWidth
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: 2,
                      py: 1.5,
                      minHeight: 48,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.3)',
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
        </Box>

        {/* Therapist Matches */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            AI-Matched Therapists
          </Typography>
          <Grid container spacing={2}>
            {therapistMatches.map((therapist) => (
              <Grid item xs={12} md={6} key={therapist.id}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(78, 205, 196, 0.3)',
                      mr: 2,
                      width: 50,
                      height: 50
                    }}>
                      {therapist.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {therapist.name}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {therapist.specialization}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Rating value={therapist.rating} size="small" readOnly />
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {therapist.rating}/5 ({therapist.experience})
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={`${therapist.matchScore}% match`}
                      sx={{ 
                        bgcolor: 'rgba(78, 205, 196, 0.3)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    {therapist.approach}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      Specialties:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {therapist.specialties.map((specialty, index) => (
                        <Chip 
                          key={index}
                          label={specialty}
                          size="small"
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'medium'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {therapist.availability} • {therapist.price}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.5)'
                        }
                      }}
                    >
                      Connect
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedRecommendationEngine;
