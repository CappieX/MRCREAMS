import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Card, CardContent, TextField, LinearProgress, Grid, IconButton, useTheme } from '@mui/material';
import { Mic as MicIcon, Upload as UploadIcon, PlayArrow as PlayIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmotionAnalysisDemo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotions, setEmotions] = useState([
    { name: 'Joy', intensity: 0, color: '#FFD700' },
    { name: 'Trust', intensity: 0, color: '#4CAF50' },
    { name: 'Fear', intensity: 0, color: '#FF5722' },
    { name: 'Surprise', intensity: 0, color: '#FF9800' },
    { name: 'Sadness', intensity: 0, color: '#2196F3' },
    { name: 'Disgust', intensity: 0, color: '#795548' },
    { name: 'Anger', intensity: 0, color: '#F44336' },
    { name: 'Anticipation', intensity: 0, color: '#9C27B0' },
    { name: 'Love', intensity: 0, color: '#E91E63' },
    { name: 'Serenity', intensity: 0, color: '#607D8B' },
    { name: 'Interest', intensity: 0, color: '#00BCD4' },
    { name: 'Apprehension', intensity: 0, color: '#673AB7' }
  ]);
  const [dominantEmotion, setDominantEmotion] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [couplesStat, setCouplesStat] = useState(0);
  const [therapistsStat, setTherapistsStat] = useState(0);

  const sampleConversations = [
    "I feel like we don't communicate anymore. You're always on your phone.",
    "I appreciate how you listened to me yesterday. It really helped.",
    "I'm worried about our future together. Things feel uncertain.",
    "Thank you for being patient with me during this difficult time."
  ];

  const aiInsights = [
    {
      insight: "Pattern suggests communication breakdown with underlying emotional disconnection",
      recommendation: "Try our 'Active Listening' exercise →"
    },
    {
      insight: "Emotional vulnerability detected with positive receptivity indicators",
      recommendation: "Explore our 'Emotional Safety' module →"
    },
    {
      insight: "Anxiety patterns with trust-building opportunities identified",
      recommendation: "Start with 'Trust Rebuilding' exercises →"
    },
    {
      insight: "Gratitude expression with emotional bonding potential",
      recommendation: "Deepen connection with 'Appreciation Practices' →"
    }
  ];

  // Animated counters for stats
  useEffect(() => {
    const animateCounter = (target, setter, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    animateCounter(94, setCouplesStat);
    animateCounter(56, setTherapistsStat);
  }, []);

  const handleSampleConversation = () => {
    const randomSample = sampleConversations[Math.floor(Math.random() * sampleConversations.length)];
    setInputText(randomSample);
    analyzeEmotion(randomSample);
  };

  const analyzeEmotion = (text) => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with random variations
    setTimeout(() => {
      const newEmotions = emotions.map(emotion => ({
        ...emotion,
        intensity: Math.floor(Math.random() * 100)
      }));
      
      setEmotions(newEmotions);
      
      // Find dominant emotion
      const dominant = newEmotions.reduce((prev, current) => 
        prev.intensity > current.intensity ? prev : current
      );
      setDominantEmotion(dominant);
      
      // Set AI insight
      const randomInsight = aiInsights[Math.floor(Math.random() * aiInsights.length)];
      setAiInsight(randomInsight.insight);
      setAiRecommendation(randomInsight.recommendation);
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleInputSubmit = () => {
    analyzeEmotion(inputText);
  };

  const handleVoiceInput = () => {
    // Simulate voice input
    const voiceSample = "I feel unheard when you interrupt me during our conversations.";
    setInputText(voiceSample);
    analyzeEmotion(voiceSample);
  };

  const EmotionWheel = ({ emotions, dominantEmotion }) => {
    return (
      <Box sx={{ position: 'relative', width: 200, height: 200, mx: 'auto' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {emotions.map((emotion, index) => {
            const angle = (index * 360) / emotions.length;
            const radius = 80;
            const x = 100 + radius * Math.cos((angle - 90) * Math.PI / 180);
            const y = 100 + radius * Math.sin((angle - 90) * Math.PI / 180);
            const isDominant = emotion.name === dominantEmotion?.name;
            
            return (
              <g key={emotion.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={isDominant ? 12 : 8}
                  fill={emotion.color}
                  opacity={emotion.intensity / 100}
                  stroke={isDominant ? '#fff' : 'none'}
                  strokeWidth={isDominant ? 3 : 0}
                />
                <text
                  x={x}
                  y={y + 25}
                  textAnchor="middle"
                  fill="#333"
                  fontSize="10"
                  fontWeight={isDominant ? 'bold' : 'normal'}
                >
                  {emotion.name}
                </text>
              </g>
            );
          })}
          <circle
            cx="100"
            cy="100"
            r="30"
            fill="white"
            stroke="#ddd"
            strokeWidth="2"
          />
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fill="#333"
            fontSize="12"
            fontWeight="bold"
          >
            {dominantEmotion?.name || 'Analyzing'}
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            fill="#666"
            fontSize="14"
            fontWeight="bold"
          >
            {dominantEmotion?.intensity ? `${dominantEmotion.intensity}%` : ''}
          </text>
        </svg>
      </Box>
    );
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
          sx={{ mb: 6, color: 'text.primary' }}
        >
          Experience AI-Powered Emotion Analysis
        </Typography>

        <Grid container spacing={6}>
          {/* Input Area */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Input Conversation
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type a conversation snippet or upload audio..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PlayIcon />}
                    onClick={handleSampleConversation}
                    fullWidth
                  >
                    Try sample conversation
                  </Button>
                  
                  <IconButton
                    onClick={handleVoiceInput}
                    sx={{ 
                      border: '1px solid #ddd',
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                  
                  <IconButton
                    sx={{ 
                      border: '1px solid #ddd',
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
                    }}
                  >
                    <UploadIcon />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleInputSubmit}
                  disabled={isAnalyzing || !inputText.trim()}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Emotions'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Live Analysis Visualization */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Live Emotion Analysis
                </Typography>
                
                <EmotionWheel emotions={emotions} dominantEmotion={dominantEmotion} />
                
                <Box sx={{ mt: 3 }}>
                  {emotions.slice(0, 6).map((emotion, index) => (
                    <Box key={emotion.name} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {emotion.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {emotion.intensity}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={emotion.intensity}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: emotion.color,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Insights Box */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  AI Insight:
                </Typography>
                
                {aiInsight ? (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {aiInsight}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
                      {aiRecommendation}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter a conversation to see AI insights
                  </Typography>
                )}

                {/* Stats Display */}
                <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid #eee' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                    Proven Results:
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                      {couplesStat}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      of couples improve communication within 30 days
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                      {therapistsStat} minutes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      saved per session for therapists
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Try It Free Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 2,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              bgcolor: '#00B4D8',
              '&:hover': {
                bgcolor: '#0096c7'
              }
            }}
            onClick={() => navigate('/register')}
          >
            Try It Free - No Account Needed
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EmotionAnalysisDemo;
