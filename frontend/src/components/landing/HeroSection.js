import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, useTheme, alpha, IconButton, Drawer, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openDemo, setOpenDemo] = React.useState(false);
  const [demoEmail, setDemoEmail] = React.useState('');
  const emotionIcons = ['❤️', '😢', '😊', '😠', '😐'];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0A2540 0%, #00B4D8 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 8
      }}
    >
      {/* Floating Emotion Icons */}
      {emotionIcons.map((icon, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            fontSize: { xs: '1.25rem', md: '2.5rem' },
            color: alpha(theme.palette.common.white, 0.7),
            animation: { xs: 'none', md: `float 6s ease-in-out infinite ${index * 1}s` },
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        >
          {icon}
        </Box>
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box 
            component="img" 
            src="/enum-technology-logo.png" 
            alt="Enum Technology Logo" 
            sx={{ 
              height: { xs: 36, md: 44 }, 
              width: 'auto',
              mr: 2,
              objectFit: 'contain',
              display: 'block'
            }} 
            onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
            loading="lazy"
          />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
            Enum Technology
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button onClick={() => navigate('/features')} sx={{ color: 'white' }}>
              Features
            </Button>
            <Button onClick={() => navigate('/pricing')} sx={{ color: 'white' }}>
              Pricing
            </Button>
            <Button onClick={() => navigate('/resources')} sx={{ color: 'white' }}>
              Resources
            </Button>
            <Button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} sx={{ color: 'white' }}>
              How it works
            </Button>
            <Button onClick={() => navigate('/about')} sx={{ color: 'white' }}>
              About
            </Button>
            <Button onClick={() => navigate('/contact')} sx={{ color: 'white' }}>
              Contact
            </Button>
          </Box>
          <IconButton
            onClick={() => setOpenMenu(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'white' }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="right" open={openMenu} onClose={() => setOpenMenu(false)}>
          <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpenMenu(false)}>
            <List>
              <ListItem button onClick={() => navigate('/login?type=client')}>
                <ListItemText primary="For Couples" />
              </ListItem>
              <ListItem button onClick={() => navigate('/professional-login')}>
                <ListItemText primary="For Therapists" />
              </ListItem>
              <ListItem button onClick={() => navigate('/pricing')}>
                <ListItemText primary="Pricing" />
              </ListItem>
              <ListItem button onClick={() => navigate('/login')}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => navigate('/features')}>
                <ListItemText primary="Features" />
              </ListItem>
              <ListItem button onClick={() => navigate('/resources')}>
                <ListItemText primary="Resources" />
              </ListItem>
              <ListItem button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                <ListItemText primary="How it works" />
              </ListItem>
              <ListItem button onClick={() => navigate('/about')}>
                <ListItemText primary="About" />
              </ListItem>
              <ListItem button onClick={() => navigate('/contact')}>
                <ListItemText primary="Contact" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Headline and Sub-headline */}
        <Box sx={{ mb: 6, textAlign: 'center', px: { xs: 2, md: 0 } }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 'bold',
              color: 'white',
              mb: 3,
              lineHeight: 1.2
            }}
          >
            AI-Powered Emotional Intelligence for Modern Relationships
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: alpha(theme.palette.common.white, 0.9),
              mb: { xs: 3, md: 4 },
              lineHeight: 1.6,
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            Where couples connect deeper and therapists deliver better outcomes with clinically-validated emotion analysis
          </Typography>
        </Box>

        {/* Split-Section Cards */}
        <Grid container spacing={4} alignItems="stretch">
          {/* Couples Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: '0 8px 24px rgba(0, 180, 216, 0.15)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 180, 216, 0.2)',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 6 }, bgcolor: alpha('#00B4D8', 0.05) }}>
                <Box sx={{ fontSize: '2.5rem', mb: 3 }}>❤️</Box>
                <Typography variant="h4" sx={{ mb: 4, color: '#00B4D8', fontWeight: 'bold' }}>
                  For Couples Seeking Deeper Connection
                </Typography>
                <Box sx={{ mb: 6 }}>
                  {[
                    'Real-time emotion detection during conversations',
                    'AI-guided conflict resolution exercises',
                    'Private, secure space for vulnerable talks',
                    '"Harmony Score" progress tracking'
                  ].map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleIcon sx={{ color: '#00B4D8', mr: 2 }} />
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: '#00B4D8', 
                    px: { xs: 3, md: 4 }, 
                    py: { xs: 2, md: 1.5 }, 
                    borderRadius: 3, 
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#0096c7'
                    }
                  }}
                  onClick={() => navigate('/register')}
                >
                  Start Free Trial →
                </Button>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#00B4D8' }}>
                  No credit card needed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Professionals Card */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                boxShadow: '0 8px 24px rgba(10, 37, 64, 0.15)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(10, 37, 64, 0.2)',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 6 }, bgcolor: alpha('#0A2540', 0.05) }}>
                <Box sx={{ fontSize: '2.5rem', mb: 3 }}>🩺</Box>
                <Typography variant="h4" sx={{ mb: 4, color: '#0A2540', fontWeight: 'bold' }}>
                  For Relationship Professionals
                </Typography>
                <Box sx={{ mb: 6 }}>
                  {[
                    'Clinical-grade session analytics dashboard',
                    'HIPAA-compliant client management',
                    'AI-assisted progress note generation',
                    'Multi-client emotional trend analysis'
                  ].map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleIcon sx={{ color: '#0A2540', mr: 2 }} />
                      <Typography variant="body1">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: '#0A2540', 
                    px: { xs: 3, md: 4 }, 
                    py: { xs: 2, md: 1.5 }, 
                    borderRadius: 3, 
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#081a30'
                    }
                  }}
                  onClick={() => setOpenDemo(true)}
                >
                  Schedule Professional Demo →
                </Button>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#0A2540' }}>
                  See full platform
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 6, md: 8 }, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.9), fontWeight: 'medium' }}>
            ★★★★★ 4.9/5 • HIPAA Compliant • Bank-Level Security
          </Typography>
        </Box>

        <Box sx={{ mt: 6, display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
          <Button
            variant="contained"
            sx={{ 
              bgcolor: '#00B4D8', 
              px: { xs: 3, md: 4 }, 
              py: { xs: 2, md: 1.5 }, 
              borderRadius: 3, 
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#0096c7'
              }
            }}
            onClick={() => navigate('/login?type=client')}
          >
            For Couples →
          </Button>
          <Button
            variant="contained"
            sx={{ 
              bgcolor: '#0A2540', 
              px: { xs: 3, md: 4 }, 
              py: { xs: 2, md: 1.5 }, 
              borderRadius: 3, 
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#081a30'
              }
            }}
            onClick={() => navigate('/professional-login')}
          >
            For Therapists →
          </Button>
        </Box>
        <Dialog open={openDemo} onClose={() => setOpenDemo(false)}>
          <DialogTitle>Schedule a Professional Demo</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Work Email"
              type="email"
              fullWidth
              value={demoEmail}
              onChange={(e) => setDemoEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDemo(false)}>Cancel</Button>
            <Button onClick={() => { setOpenDemo(false); setDemoEmail(''); }}>Request Demo</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default HeroSection;
