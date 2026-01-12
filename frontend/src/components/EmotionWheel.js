import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const EmotionWheel = ({ currentEmotion = 'neutral' }) => {
  // Simplified visual representation
  return (
    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '50%', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', background: 'conic-gradient(#ff6b6b 0deg 60deg, #feca57 60deg 120deg, #48dbfb 120deg 180deg, #ff9ff3 180deg 240deg, #54a0ff 240deg 300deg, #1dd1a1 300deg 360deg)' }}>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: '50%', width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h6">Current Mood</Typography>
        <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>{currentEmotion}</Typography>
      </Box>
    </Paper>
  );
};

export default EmotionWheel;
