import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Paper,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Mood as MoodIcon,
  SentimentSatisfied as HappyIcon,
  SentimentNeutral as NeutralIcon,
  SentimentDissatisfied as SadIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';

const EmotionCheckIn = () => {
  const theme = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionalIntensity, setEmotionalIntensity] = useState(5);
  const [context, setContext] = useState('');
  const [aiInsights, setAIInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const emotions = [
    { 
      id: 'joy', 
      label: 'Joy', 
      emoji: '😊', 
      color: '#4ECDC4',
      description: 'Feeling happy, content, and positive',
      icon: <HappyIcon />
    },
    { 
      id: 'calm', 
      label: 'Calm', 
      emoji: '😌', 
      color: '#81C784',
      description: 'Peaceful, relaxed, and centered',
      icon: <NeutralIcon />
    },
    { 
      id: 'anxious', 
      label: 'Anxious', 
      emoji: '😰', 
      color: '#FFB74D',
      description: 'Worried, nervous, or stressed',
      icon: <SadIcon />
    },
    { 
      id: 'sad', 
      label: 'Sad', 
      emoji: '😢', 
      color: '#4A90E2',
      description: 'Feeling down, melancholy, or blue',
      icon: <SadIcon />
    },
    { 
      id: 'angry', 
      label: 'Angry', 
      emoji: '😡', 
      color: '#FF6B6B',
      description: 'Frustrated, irritated, or mad',
      icon: <SadIcon />
    },
    { 
      id: 'excited', 
      label: 'Excited', 
      emoji: '🤩', 
      color: '#8B5FBF',
      description: 'Enthusiastic, energetic, and thrilled',
      icon: <HappyIcon />
    }
  ];

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setAIInsights(null);
  };

  const handleSubmit = async () => {
    if (!selectedEmotion) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = generateAIInsights(selectedEmotion, emotionalIntensity, context);
    setAIInsights(insights);
    setIsAnalyzing(false);
  };

  const generateAIInsights = (emotion, intensity, context) => {
    const insights = {
      primaryEmotion: emotion.label,
      intensity: intensity,
      analysis: '',
      recommendations: [],
      patterns: '',
      nextSteps: []
    };

    switch (emotion.id) {
      case 'joy':
        insights.analysis = "You're experiencing positive emotions! This is a great foundation for building connection and resolving conflicts.";
        insights.recommendations = [
          "Share this positive energy with your partner",
          "Use this moment to address any pending issues",
          "Practice gratitude together"
        ];
        insights.patterns = "Joyful moments often indicate healthy relationship dynamics.";
        insights.nextSteps = ["Consider what contributed to this positive state", "Plan activities that maintain this mood"];
        break;
        
      case 'calm':
        insights.analysis = "You're in a peaceful state - perfect for thoughtful communication and reflection.";
        insights.recommendations = [
          "Use this calm state for deep conversations",
          "Practice mindfulness together",
          "Reflect on relationship goals"
        ];
        insights.patterns = "Calm states often follow successful conflict resolution.";
        insights.nextSteps = ["Identify what brought you to this peaceful state", "Use this energy for productive discussions"];
        break;
        
      case 'anxious':
        insights.analysis = "Anxiety can impact communication. Let's address what's causing this stress.";
        insights.recommendations = [
          "Practice breathing exercises together",
          "Identify specific anxiety triggers",
          "Use 'I feel' statements when communicating"
        ];
        insights.patterns = "Anxiety often signals unresolved issues or unmet needs.";
        insights.nextSteps = ["Explore the root cause of anxiety", "Develop coping strategies together"];
        break;
        
      case 'sad':
        insights.analysis = "Sadness is a valid emotion. Let's work through this together with compassion.";
        insights.recommendations = [
          "Express your feelings openly",
          "Seek comfort and support from your partner",
          "Practice self-compassion"
        ];
        insights.patterns = "Sadness can indicate emotional needs that aren't being met.";
        insights.nextSteps = ["Identify what's causing sadness", "Develop emotional support strategies"];
        break;
        
      case 'angry':
        insights.analysis = "Anger often masks deeper emotions. Let's explore what's really going on.";
        insights.recommendations = [
          "Take a break before discussing issues",
          "Use 'I feel' instead of 'you always'",
          "Focus on the issue, not the person"
        ];
        insights.patterns = "Anger often indicates boundaries being crossed or needs not being met.";
        insights.nextSteps = ["Identify triggers", "Develop healthy expression techniques"];
        break;
        
      case 'excited':
        insights.analysis = "Excitement is contagious! Use this energy to strengthen your connection.";
        insights.recommendations = [
          "Share your excitement with your partner",
          "Plan something special together",
          "Use this energy for relationship building"
        ];
        insights.patterns = "Excitement often follows positive relationship developments.";
        insights.nextSteps = ["Channel this energy into relationship goals", "Celebrate together"];
        break;
    }

    return insights;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'text.primary', textAlign: 'center' }}>
        How are you feeling today?
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Take a moment to check in with your emotions. This helps us provide better insights and recommendations.
      </Typography>

      {/* Emotion Selection */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Select Your Primary Emotion
          </Typography>
          
          <Grid container spacing={2}>
            {emotions.map((emotion) => (
              <Grid item xs={6} sm={4} md={2} key={emotion.id}>
                <Button
                  fullWidth
                  variant={selectedEmotion?.id === emotion.id ? 'contained' : 'outlined'}
                  onClick={() => handleEmotionSelect(emotion)}
                  sx={{
                    p: 2,
                    height: 'auto',
                    borderRadius: 2,
                    borderColor: emotion.color,
                    bgcolor: selectedEmotion?.id === emotion.id ? emotion.color : 'transparent',
                    color: selectedEmotion?.id === emotion.id ? 'white' : emotion.color,
                    '&:hover': {
                      bgcolor: alpha(emotion.color, 0.1),
                      borderColor: emotion.color
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '2rem', mb: 1 }}>
                      {emotion.emoji}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {emotion.label}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
          
          {selectedEmotion && (
            <Box sx={{ mt: 3, p: 2, bgcolor: alpha(selectedEmotion.color, 0.1), borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedEmotion.description}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Intensity Slider */}
      {selectedEmotion && (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              How intense is this feeling?
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Intensity: {emotionalIntensity}/10
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(emotionalIntensity / 10) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(selectedEmotion.color, 0.2),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: selectedEmotion.color
                  }
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <Button
                  key={value}
                  variant={emotionalIntensity === value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setEmotionalIntensity(value)}
                  sx={{
                    minWidth: 40,
                    bgcolor: emotionalIntensity === value ? selectedEmotion.color : 'transparent',
                    borderColor: selectedEmotion.color,
                    color: emotionalIntensity === value ? 'white' : selectedEmotion.color
                  }}
                >
                  {value}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Context Input */}
      {selectedEmotion && (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              What's contributing to this feeling?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Share any context that might help us understand your emotional state better.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {[
                'Work stress', 'Relationship issue', 'Family matter', 'Health concern',
                'Financial worry', 'Social situation', 'Personal goal', 'Other'
              ].map((contextItem) => (
                <Chip
                  key={contextItem}
                  label={contextItem}
                  onClick={() => setContext(contextItem)}
                  variant={context === contextItem ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: context === contextItem ? alpha(selectedEmotion.color, 0.1) : 'transparent',
                    borderColor: selectedEmotion.color,
                    color: context === contextItem ? selectedEmotion.color : 'text.secondary'
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {selectedEmotion && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isAnalyzing}
            startIcon={isAnalyzing ? <LinearProgress /> : <PsychologyIcon />}
            sx={{
              bgcolor: selectedEmotion.color,
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                bgcolor: selectedEmotion.color,
                opacity: 0.9
              }
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Get AI Insights'}
          </Button>
        </Box>
      )}

      {/* AI Insights */}
      {aiInsights && (
        <Card sx={{ borderRadius: 3, bgcolor: alpha('#4A90E2', 0.05) }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: '#4A90E2', mr: 2 }}>
                <InsightsIcon />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A90E2' }}>
                AI Emotional Analysis
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              You're feeling {aiInsights.primaryEmotion} (Intensity: {aiInsights.intensity}/10)
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {aiInsights.analysis}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: '#8B5FBF' }}>
              Recommendations
            </Typography>
            <Box sx={{ mb: 3 }}>
              {aiInsights.recommendations.map((rec, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#8B5FBF', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">{rec}</Typography>
                </Box>
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ color: '#4ECDC4' }}>
              Pattern Recognition
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              {aiInsights.patterns}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: '#FF8A65' }}>
              Next Steps
            </Typography>
            <Box>
              {aiInsights.nextSteps.map((step, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: '#FF8A65',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontSize: '0.8rem',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body2">{step}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default EmotionCheckIn;
