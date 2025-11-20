import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  LinearProgress,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  TrendingUp as TrendingUpIcon,
  Insights as InsightsIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  PlayCircle as PlayIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [emotionalState, setEmotionalState] = useState('neutral');

  const testimonials = [
    {
      name: "Sarah & Michael",
      relationship: "Married 3 years",
      quote: "MR.CREAMS helped us understand each other's emotions in ways we never could before. Our communication has transformed completely.",
      rating: 5,
      improvement: "85% better communication"
    },
    {
      name: "Alex & Jordan",
      relationship: "Dating 2 years", 
      quote: "The AI insights are incredible. It's like having a relationship counselor who knows us better than we know ourselves.",
      rating: 5,
      improvement: "70% fewer conflicts"
    },
    {
      name: "Maria & David",
      relationship: "Married 8 years",
      quote: "We were on the brink of separation. MR.CREAMS gave us the tools to reconnect and rebuild our relationship stronger than ever.",
      rating: 5,
      improvement: "90% stronger connection"
    }
  ];

  const features = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#4A90E2' }} />,
      title: "Emotional Intelligence",
      description: "Understand each other's feelings with AI-powered emotion analysis that goes beyond words.",
      benefit: "Feel truly heard and understood"
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: '#8B5FBF' }} />,
      title: "Smart Conflict Resolution",
      description: "Transform arguments into opportunities for connection with personalized guidance.",
      benefit: "Turn conflicts into growth moments"
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40, color: '#4ECDC4' }} />,
      title: "Personalized Guidance",
      description: "Get tailored recommendations for your unique relationship dynamics and challenges.",
      benefit: "Solutions that actually work for you"
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#FF6B6B' }} />,
      title: "Progress Tracking",
      description: "See real improvement in your relationship health with detailed analytics and insights.",
      benefit: "Celebrate every step forward"
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#81C784' }} />,
      title: "Expert Support",
      description: "Connect with relationship experts when you need extra help and guidance.",
      benefit: "Professional support when you need it"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#FFB74D' }} />,
      title: "Privacy & Security",
      description: "Your relationship data is protected with enterprise-grade security and privacy controls.",
      benefit: "Safe space for vulnerable conversations"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Share Your Story",
      description: "Describe your relationship challenges in your own words, using voice, text, or guided prompts.",
      icon: <ChatIcon sx={{ fontSize: 32 }} />
    },
    {
      step: "02", 
      title: "Emotion Analysis",
      description: "Our AI understands the feelings behind the words, analyzing emotional patterns and triggers.",
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />
    },
    {
      step: "03",
      title: "Personalized Guidance", 
      description: "Get customized exercises, insights, and recommendations tailored to your unique situation.",
      icon: <InsightsIcon sx={{ fontSize: 32 }} />
    },
    {
      step: "04",
      title: "Grow Together",
      description: "Track your progress, celebrate improvements, and continue growing as a couple.",
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />
    }
  ];

  const stats = [
    { number: "85%", label: "of couples report better communication" },
    { number: "40%", label: "average reduction in recurring conflicts" },
    { number: "9/10", label: "users feel more understood by partners" },
    { number: "70%", label: "improvement in emotional connection scores" }
  ];

  // New: User type options for the unified system
  const userTypes = [
    {
      id: 'individual',
      title: 'For Individuals & Couples',
      description: 'Personal relationship improvement and emotional growth',
      icon: <PersonIcon sx={{ fontSize: 24 }} />,
      features: ['Personal insights', 'Couple exercises', 'Progress tracking']
    },
    {
      id: 'company',
      title: 'For Companies',
      description: 'Employee wellness and team relationship management',
      icon: <BusinessIcon sx={{ fontSize: 24 }} />,
      features: ['Team analytics', 'Manager tools', 'Organization dashboard']
    },
    {
      id: 'therapist',
      title: 'For Professionals',
      description: 'Therapist tools for client relationship management',
      icon: <PsychologyIcon sx={{ fontSize: 24 }} />,
      features: ['Client sessions', 'Professional analytics', 'Billing integration']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleEmotionalCheckIn = (emotion) => {
    setEmotionalState(emotion);
  };

  // Updated: Direct to unified registration
  const handleStartJourney = () => {
    navigate('/register');
  };

  // Updated: Direct to unified registration for "See How It Works"
  const handleSeeHowItWorks = () => {
    navigate('/register');
  };

  // Updated: Direct to login
  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha('#4A90E2', 0.1)} 0%, ${alpha('#8B5FBF', 0.1)} 100%)`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${alpha('#4A90E2', 0.1)}, ${alpha('#8B5FBF', 0.1)})`,
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 2,
                    lineHeight: 1.2
                  }}
                >
                  Heal Your Relationship with{' '}
                  <Box component="span" sx={{ color: '#4A90E2' }}>
                    Emotional Intelligence
                  </Box>
                </Typography>
                
                <Typography
                  variant="h5"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    lineHeight: 1.6,
                    fontWeight: 400
                  }}
                >
                  MR.CREAMS uses advanced emotion analysis to help couples communicate better, 
                  understand deeper, and grow together through smart conflict resolution.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleStartJourney}
                    sx={{
                      bgcolor: '#4A90E2',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: '#357ABD',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Start Your Journey
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayIcon />}
                    onClick={handleSeeHowItWorks}
                    sx={{
                      borderColor: '#4A90E2',
                      color: '#4A90E2',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#357ABD',
                        bgcolor: alpha('#4A90E2', 0.1)
                      }
                    }}
                  >
                    See How It Works
                  </Button>
                </Box>

                {/* Emotional Check-in Demo */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: alpha('#4A90E2', 0.05),
                    border: `1px solid ${alpha('#4A90E2', 0.2)}`
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: '#4A90E2', fontWeight: 'bold' }}>
                    Try Our Emotional Check-in
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Experience how MR.CREAMS understands your emotions
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {['😌', '😊', '😐', '😰', '😢'].map((emoji, index) => (
                      <IconButton
                        key={index}
                        onClick={() => handleEmotionalCheckIn(emoji)}
                        sx={{
                          bgcolor: emotionalState === emoji ? '#4A90E2' : 'transparent',
                          color: emotionalState === emoji ? 'white' : 'text.primary',
                          '&:hover': {
                            bgcolor: alpha('#4A90E2', 0.2)
                          }
                        }}
                      >
                        <Typography sx={{ fontSize: '1.5rem' }}>{emoji}</Typography>
                      </IconButton>
                    ))}
                  </Box>
                  
                  {emotionalState !== 'neutral' && (
                    <Typography variant="body2" sx={{ color: '#4A90E2', fontWeight: 'bold' }}>
                      AI Insight: "I sense you're feeling {emotionalState === '😌' ? 'calm and peaceful' : 
                      emotionalState === '😊' ? 'happy and content' : 
                      emotionalState === '😰' ? 'anxious or stressed' : 
                      emotionalState === '😢' ? 'sad or emotional' : 'neutral'}. 
                      This is a great starting point for understanding your emotional state."
                    </Typography>
                  )}
                </Paper>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                {/* Main Dashboard Preview */}
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    transform: 'rotateY(-5deg) rotateX(5deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <Box
                    sx={{
                      height: 300,
                      background: `linear-gradient(135deg, ${alpha('#4A90E2', 0.1)} 0%, ${alpha('#8B5FBF', 0.1)} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      p: 3
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#4A90E2', width: 60, height: 60, mb: 2 }}>
                      <HeartIcon sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A90E2', mb: 1 }}>
                      Harmony Score: 85%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your relationship is growing stronger
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{
                        width: '100%',
                        mt: 2,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha('#4A90E2', 0.2),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#4A90E2'
                        }
                      }}
                    />
                  </Box>
                </Card>
                
                {/* Floating Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    bgcolor: '#8B5FBF',
                    color: 'white',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 24 }} />
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    bgcolor: '#4ECDC4',
                    color: 'white',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 6, color: 'text.primary' }}
          >
            Trusted by Thousands of Couples
          </Typography>
          
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    bgcolor: alpha('#4A90E2', 0.05),
                    border: `1px solid ${alpha('#4A90E2', 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Typography
                    variant="h2"
                    fontWeight="bold"
                    sx={{ color: '#4A90E2', mb: 1 }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why MR.CREAMS Works Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 2, color: 'text.primary' }}
          >
            Why MR.CREAMS Works
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            Our AI-powered platform combines emotional intelligence with personalized guidance
            to help you build stronger, more connected relationships.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    border: `1px solid ${alpha('#4A90E2', 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                      borderColor: '#4A90E2'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {feature.description}
                  </Typography>
                  <Chip
                    label={feature.benefit}
                    size="small"
                    sx={{
                      bgcolor: alpha('#4A90E2', 0.1),
                      color: '#4A90E2',
                      fontWeight: 'bold'
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 6, color: 'text.primary' }}
          >
            How MR.CREAMS Works
          </Typography>
          
          <Grid container spacing={4}>
            {howItWorks.map((step, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha('#4A90E2', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      position: 'relative'
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ color: '#4A90E2', position: 'absolute', top: -10, left: -10 }}
                    >
                      {step.step}
                    </Typography>
                    <Box sx={{ color: '#4A90E2' }}>
                      {step.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: 'text.primary' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 6, color: 'text.primary' }}
          >
            Real Stories, Real Results
          </Typography>
          
          <Card
            sx={{
              maxWidth: 800,
              mx: 'auto',
              p: 4,
              borderRadius: 4,
              bgcolor: 'background.paper',
              border: `1px solid ${alpha('#4A90E2', 0.1)}`,
              textAlign: 'center'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <StarIcon key={i} sx={{ color: '#FFB74D', fontSize: 24 }} />
              ))}
            </Box>
            
            <Typography
              variant="h6"
              sx={{ mb: 3, fontStyle: 'italic', color: 'text.primary', lineHeight: 1.6 }}
            >
              "{testimonials[currentTestimonial].quote}"
            </Typography>
            
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#4A90E2', mb: 1 }}>
              {testimonials[currentTestimonial].name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {testimonials[currentTestimonial].relationship}
            </Typography>
            
            <Chip
              label={testimonials[currentTestimonial].improvement}
              sx={{
                bgcolor: alpha('#4ECDC4', 0.1),
                color: '#4ECDC4',
                fontWeight: 'bold'
              }}
            />
          </Card>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentTestimonial ? '#4A90E2' : alpha('#4A90E2', 0.3),
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${alpha('#4A90E2', 0.1)} 0%, ${alpha('#8B5FBF', 0.1)} 100%)`,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ mb: 3, color: 'text.primary' }}
          >
            Ready to Transform Your Relationship?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            Join thousands of couples who have discovered the power of emotional intelligence 
            in building stronger, more connected relationships.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleStartJourney}
              sx={{
                bgcolor: '#4A90E2',
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#357ABD',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Your Journey
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: '#8B5FBF',
                color: '#8B5FBF',
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: '#7B4F9F',
                  bgcolor: alpha('#8B5FBF', 0.1)
                }
              }}
            >
              Sign In
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            🔒 Your privacy is protected • 💝 30-day money-back guarantee • 🚀 Start free today
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: 'background.paper', borderTop: `1px solid ${alpha('#4A90E2', 0.1)}` }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#4A90E2', mb: 1 }}>
                MR.CREAMS
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Smart healing for modern relationships
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Typography variant="body2" color="text.secondary">
                  © 2024 MR.CREAMS. All rights reserved.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </Box>
  );
};

export default LandingPage;