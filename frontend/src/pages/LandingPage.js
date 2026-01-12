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
  Person as PersonIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import HeroSection from '../components/landing/HeroSection';
import EmotionAnalysisDemo from '../components/landing/EmotionAnalysisDemo';
import TherapistFeatures from '../components/landing/TherapistFeatures';

import Testimonials from '../components/landing/Testimonials';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [showBottomCTA, setShowBottomCTA] = useState(false);

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
  
  const timelineSteps = [
    {
      key: 'share',
      icon: '🎤',
      title: 'Share Your Experience',
      details: 'Voice recording • Text conversation • Video session',
      note: 'Choose what feels comfortable'
    },
    {
      key: 'analyze',
      icon: '🔍',
      title: 'AI Emotion Analysis',
      details: '12+ emotional dimensions detected in real-time',
      note: 'Emotion heatmap visualization'
    },
    {
      key: 'guide',
      icon: '🧭',
      title: 'Personalized Guidance',
      details: 'Custom exercises • Conversation prompts • Insight reports',
      note: 'Tailored to your unique patterns'
    },
    {
      key: 'grow',
      icon: '📈',
      title: 'Track Progress Together',
      details: 'Harmony Score dashboard • Milestone celebrations • Trend analysis',
      note: 'Visible improvement in 30 days'
    }
  ];

  const stats = [
    { number: "85%", label: "of couples report better communication" },
    { number: "40%", label: "average reduction in recurring conflicts" },
    { number: "9/10", label: "users feel more understood by partners" },
    { number: "70%", label: "improvement in emotional connection scores" }
  ];

  const therapistShowcaseFeatures = [
    {
      title: 'HIPAA-Compliant Dashboard',
      icon: '🛡️',
      description: 'Bank-level security with end-to-end encryption',
      badge: 'GDPR Ready'
    },
    {
      title: 'Advanced Session Analytics',
      icon: '📊',
      description: 'Deep emotional pattern recognition across sessions',
      feature: 'Export reports to PDF/CSV'
    },
    {
      title: 'AI-Assisted Documentation',
      icon: '🤖',
      description: 'Automated progress notes with therapist review',
      feature: '40% faster documentation'
    },
    {
      title: 'Multi-Client Management',
      icon: '👥',
      description: 'Manage 50+ clients with individual progress tracking',
      feature: 'Bulk action support'
    },
    {
      title: 'Integration Ecosystem',
      icon: '🔌',
      description: 'Connect with EHR systems, calendars, payment processors',
      logos: ['Zoom', 'Google Calendar', 'Stripe', 'TherapyNotes']
    },
    {
      title: 'Research & Training',
      icon: '🎓',
      description: 'Access to latest emotional intelligence research',
      feature: 'Continuing education credits'
    }
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
  useEffect(() => {
    const onScroll = () => {
      setShowBottomCTA(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

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
      <HeroSection />
      
      {/* Emotion Analysis Demo */}
      <EmotionAnalysisDemo />

      {/* Therapist Features Section */}
      <TherapistFeatures />

      {/* Testimonials Section */}
      <Testimonials />

      <Box
        sx={{
          py: 10,
          background: `linear-gradient(180deg, ${alpha('#0A2540', 0.04)} 0%, ${alpha('#00B4D8', 0.03)} 100%)`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color: '#0A2540', mb: 2 }}>
              Professional Features Showcase
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 780, mx: 'auto' }}>
              Purpose-built tooling for therapists who want better outcomes, faster documentation, and secure workflows.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {therapistShowcaseFeatures.map((feature) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${alpha('#0A2540', 0.08)}`,
                    boxShadow: '0 10px 30px rgba(10, 37, 64, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 18px 50px rgba(10, 37, 64, 0.12)',
                      borderColor: alpha('#00B4D8', 0.45)
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ fontSize: 34, lineHeight: 1 }}>{feature.icon}</Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#0A2540' }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      {feature.badge ? (
                        <Chip
                          label={feature.badge}
                          size="small"
                          sx={{
                            bgcolor: alpha('#00B4D8', 0.12),
                            color: '#0A2540',
                            fontWeight: 700
                          }}
                        />
                      ) : null}
                    </Box>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>

                    {feature.logos ? (
                      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {feature.logos.map((logo) => (
                          <Chip
                            key={logo}
                            label={logo}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: alpha('#0A2540', 0.18),
                              color: '#0A2540',
                              bgcolor: alpha('#FFFFFF', 0.7)
                            }}
                          />
                        ))}
                      </Box>
                    ) : null}

                    {feature.feature ? (
                      <Chip
                        label={feature.feature}
                        size="small"
                        sx={{
                          mb: 2,
                          bgcolor: alpha('#0A2540', 0.06),
                          color: '#0A2540',
                          fontWeight: 600
                        }}
                      />
                    ) : null}

                    <Box>
                      <Button
                        variant="text"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/register')}
                        sx={{
                          px: 0,
                          textTransform: 'none',
                          fontWeight: 700,
                          color: '#00B4D8',
                          '&:hover': { bgcolor: 'transparent', color: '#0096c7' }
                        }}
                      >
                        Learn More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
      <Box id="how-it-works" sx={{ py: 8, bgcolor: 'background.paper' }}>
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
      
      <Box id="timeline" sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 2, color: 'text.primary' }}
          >
            How It Works Timeline
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: 800, mx: 'auto' }}
          >
            Share → Analyze → Guide → Grow
          </Typography>
          
          <Box sx={{ position: 'relative', px: { xs: 2, md: 6 } }}>
            <Box sx={{ position: 'absolute', left: { xs: 24, md: 48 }, top: 0, bottom: 0, width: 4, bgcolor: alpha('#4A90E2', 0.15), borderRadius: 2 }} />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ position: 'absolute', left: 0, top: 0, bottom: 0, transformOrigin: 'top', width: 4 }}
            >
              <Box sx={{ position: 'absolute', left: { xs: 24, md: 48 }, top: 0, bottom: 0, width: 4, borderRadius: 2, background: `linear-gradient(180deg, ${alpha('#4A90E2', 0.3)} 0%, ${alpha('#00B4D8', 0.6)} 100%)` }} />
            </motion.div>
            <Grid container spacing={4}>
              {timelineSteps.map((step) => (
                <Grid item xs={12} key={step.key}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ position: 'relative', minWidth: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#00B4D8', boxShadow: '0 0 0 6px rgba(0, 180, 216, 0.2)' }} />
                    </Box>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'background.paper', border: `1px solid ${alpha('#4A90E2', 0.12)}` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ color: 'text.primary' }}>{step.title}</Typography>
                        <Typography variant="h5" sx={{ lineHeight: 1 }}>{step.icon}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{step.details}</Typography>
                      <Chip label={step.note} size="small" sx={{ bgcolor: alpha('#4A90E2', 0.08), color: '#4A90E2', fontWeight: 600 }} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="text"
                endIcon={<ArrowForwardIcon />}
                onClick={handleSeeHowItWorks}
                sx={{ textTransform: 'none', fontWeight: 700, color: '#00B4D8', '&:hover': { bgcolor: 'transparent', color: '#0096c7' } }}
              >
                See Detailed Walkthrough →
              </Button>
            </Box>
          </Box>
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
          py: 10,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #00B4D8 0%, #0A2540 100%)',
          color: '#fff'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            Ready to Transform Relationships with Emotional Intelligence?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9 }}>
            Join thousands who've discovered deeper connection through AI-powered insights
          </Typography>
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            <Grid item xs={12} md="auto">
              <Button
                variant="contained"
                size="large"
                startIcon={<HeartIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: '#FF6B6B',
                  color: '#fff',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#e45a5a' }
                }}
              >
                ❤️ Start Free Couples Trial
              </Button>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                30-day emotional check-in included
              </Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              <Button
                variant="outlined"
                size="large"
                startIcon={<MedicalServicesIcon />}
                onClick={() => navigate('/login/professional')}
                sx={{
                  borderColor: '#00B4D8',
                  color: '#00B4D8',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: alpha('#FFFFFF', 0.05),
                  '&:hover': { borderColor: '#0096c7', backgroundColor: alpha('#FFFFFF', 0.12) }
                }}
              >
                🩺 Request Professional Demo
              </Button>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                See full clinical features
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            ✅ No credit card required • 🔒 100% Private • 🩺 HIPAA Compliant
          </Typography>
        </Container>
      </Box>
      
      <Box sx={{ bgcolor: 'background.paper', pt: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: alpha('#00B4D8', 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartIcon sx={{ color: '#00B4D8' }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold">MR.CREAMS</Typography>
                <Typography variant="body2" color="text.secondary">Modern Relationship Conflict Resolution & Emotion Analysis</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton color="primary" aria-label="Twitter"><TwitterIcon /></IconButton>
              <IconButton color="primary" aria-label="LinkedIn"><LinkedInIcon /></IconButton>
              <IconButton color="primary" aria-label="Instagram"><InstagramIcon /></IconButton>
            </Box>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Product</Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/features')}>Features</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/pricing')}>Pricing</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/demo')}>Demo</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/updates')}>Updates</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>For Couples</Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={handleSeeHowItWorks}>How It Works</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/stories')}>Success Stories</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/exercises')}>Exercises</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/faq')}>FAQ</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>For Professionals</Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/therapist/tools')}>Therapist Tools</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/integrations')}>Integrations</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/training')}>Training</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/api')}>API</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Company</Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/about')}>About</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/careers')}>Careers</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/contact')}>Contact</Button>
                <Button variant="text" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/blog')}>Blog</Button>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#00B4D8', 0.06), borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">Get emotional intelligence tips →</Typography>
                <Typography variant="body2" color="text.secondary">Monthly insights to help you connect better</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Paper sx={{ flex: 1, p: 0.5 }} variant="outlined">
                    <Box component="input" placeholder="Enter your email" style={{ width: '100%', border: 0, outline: 'none', padding: '12px' }} />
                  </Paper>
                  <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ px: 3 }}>
                    Subscribe
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 6, py: 3, borderTop: `1px solid ${alpha('#0A2540', 0.1)}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">© 2024 MR.CREAMS by Enum Technology</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="text" onClick={() => navigate('/privacy')}>Privacy Policy</Button>
              <Button variant="text" onClick={() => navigate('/terms')}>Terms</Button>
              <Button variant="text" onClick={() => navigate('/cookies')}>Cookie Policy</Button>
              <Button variant="text" onClick={() => navigate('/compliance')}>Compliance</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="HIPAA Compliant" size="small" />
              <Chip label="GDPR Ready" size="small" />
              <Chip label="SOC 2 Certified" size="small" />
            </Box>
          </Box>
        </Container>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${alpha('#0A2540', 0.1)}`,
          display: { xs: showBottomCTA ? 'flex' : 'none', md: 'none' },
          py: 1.5,
          px: 2,
          gap: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1200
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Ready to start?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => navigate('/register')} sx={{ borderRadius: 2, minHeight: 44 }}>
            Try Free
          </Button>
          <Button variant="outlined" onClick={() => navigate('/login/professional')} sx={{ borderRadius: 2, minHeight: 44 }}>
            Demo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
