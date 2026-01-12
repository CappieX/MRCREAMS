import React from 'react';
import {
  Box,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  ListItemIcon
} from '@mui/material';
import { 
  Lightbulb
} from '@mui/icons-material';
import useEmotionData from '../hooks/useEmotionData';
import EmotionWheel from '../components/EmotionWheel';

const generalTips = [
  "Schedule regular check-ins to discuss concerns before they escalate",
  "Practice active listening - paraphrase what you heard before responding",
  "Choose appropriate timing for important discussions (avoid late nights or stressful times)",
  "Use 'I feel' statements instead of 'You always' accusations",
  "Take breaks during heated discussions to cool down and regain perspective",
  "Focus on finding solutions rather than assigning blame",
  "Acknowledge each other's feelings and perspectives, even when you disagree",
  "Set clear boundaries and expectations to prevent misunderstandings",
  "Celebrate successful conflict resolutions to reinforce positive communication",
  "Consider couples counseling if patterns persist despite efforts"
];

const HarmonyGuidance = () => {
  const { currentEmotion } = useEmotionData();

  return (
      <Box>
        <Typography variant="h4" gutterBottom>Harmony Guidance</Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Personalized guidance for relationship harmony based on your emotional patterns and communication dynamics.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Current Emotional State</Typography>
                <EmotionWheel currentEmotion={currentEmotion?.emotion || 'neutral'} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Share more relationship challenges to receive personalized harmony guidance based on your emotional patterns.
            </Alert>
            <Typography variant="body1">
              Based on your recent check-ins, we recommend focusing on <strong>active listening</strong> this week.
            </Typography>
          </Grid>
        </Grid>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Harmony Building Strategies
        </Typography>
        
        <Grid container spacing={2}>
          {generalTips.map((tip, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Lightbulb color="primary" />
                    </ListItemIcon>
                    <Typography variant="body1">{tip}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default HarmonyGuidance;
