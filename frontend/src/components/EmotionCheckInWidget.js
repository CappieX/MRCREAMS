import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Slider,
  Button,
  Chip,
  Grid,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  Mood as MoodIcon,
  Favorite as HeartIcon,
  Psychology as PsychologyIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
import axios from 'axios/dist/browser/axios.cjs';

const emotionOptions = [
  { label: 'Calm', value: 1, color: '#4ECDC4', icon: '😌' },
  { label: 'Content', value: 2, color: '#81C784', icon: '😊' },
  { label: 'Neutral', value: 3, color: '#FFB74D', icon: '😐' },
  { label: 'Stressed', value: 4, color: '#FF8A65', icon: '😰' },
  { label: 'Overwhelmed', value: 5, color: '#F06292', icon: '😵' }
];

const EmotionCheckInWidget = ({ onEmotionSubmit }) => {
  const [currentEmotion, setCurrentEmotion] = useState(3);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [relationshipSatisfaction, setRelationshipSatisfaction] = useState(5);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setCurrentEmotion(emotion.value);
  };

  const handleSubmit = async () => {
    if (onEmotionSubmit) {
      onEmotionSubmit({
        emotion: selectedEmotion,
        energyLevel,
        relationshipSatisfaction,
        timestamp: new Date()
      });
    }

    if (!selectedEmotion) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      return;
    }

    const label = selectedEmotion.label;
    let primaryEmotion = 'neutral';
    if (label === 'Calm') primaryEmotion = 'calm';
    else if (label === 'Content') primaryEmotion = 'joy';
    else if (label === 'Neutral') primaryEmotion = 'neutral';
    else if (label === 'Stressed') primaryEmotion = 'anxious';
    else if (label === 'Overwhelmed') primaryEmotion = 'anxious';

    const intensity = Math.round((energyLevel + relationshipSatisfaction) / 2);

    try {
      await axios.post(
        '/api/emotions/checkin',
        {
          primaryEmotion,
          secondaryEmotions: [],
          intensity,
          context: 'Dashboard quick check-in',
          triggers: [],
          copingStrategies: []
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Dashboard emotion check-in failed:', error);
    }
  };

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: 3,
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PsychologyIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            How are you feeling today?
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
          Take a moment to check in with your emotions. This helps us provide better guidance.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {emotionOptions.map((emotion) => (
            <Grid item xs={6} sm={4} key={emotion.value}>
              <Paper
                onClick={() => handleEmotionSelect(emotion)}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: selectedEmotion?.value === emotion.value ? emotion.color : 'rgba(255,255,255,0.1)',
                  border: selectedEmotion?.value === emotion.value ? `2px solid ${emotion.color}` : '2px solid transparent',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {emotion.icon}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {emotion.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Energy Level: {energyLevel}/10
          </Typography>
          <Slider
            value={energyLevel}
            onChange={(e, value) => setEnergyLevel(value)}
            min={1}
            max={10}
            sx={{
              color: '#4ECDC4',
              '& .MuiSlider-thumb': {
                bgcolor: '#4ECDC4',
                boxShadow: '0 0 0 8px rgba(78, 205, 196, 0.16)'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Relationship Satisfaction: {relationshipSatisfaction}/10
          </Typography>
          <Slider
            value={relationshipSatisfaction}
            onChange={(e, value) => setRelationshipSatisfaction(value)}
            min={1}
            max={10}
            sx={{
              color: '#FF6B6B',
              '& .MuiSlider-thumb': {
                bgcolor: '#FF6B6B',
                boxShadow: '0 0 0 8px rgba(255, 107, 107, 0.16)'
              }
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedEmotion}
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 2,
            px: 4,
            py: 1.5,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)'
            }
          }}
        >
          Complete Check-in
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionCheckInWidget;
