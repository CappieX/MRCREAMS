import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { 
  Lightbulb, 
  Psychology,
  CheckCircle
} from '@mui/icons-material';

const API_BASE_URL = '/api';

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

function Recommendations() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Harmony Guidance</Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Personalized guidance for relationship harmony based on your emotional patterns and communication dynamics.
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Share more relationship challenges to receive personalized harmony guidance based on your emotional patterns.
      </Alert>
      
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
}

export default Recommendations;
