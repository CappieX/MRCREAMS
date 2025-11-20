import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
  Login as LoginIcon,
  Psychology as PsychologyIcon,
  Support as SupportIcon
} from '@mui/icons-material';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleUserTypeSelection = (userType) => {
    if (userType === 'end_user') {
      navigate('/register/user');
    } else if (userType === 'company_user') {
      navigate('/register/company');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleProLogin = () => {
    navigate('/pro-login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          py: 4,
          background: `linear-gradient(135deg, ${alpha('#4A90E2', 0.1)} 0%, ${alpha('#8B5FBF', 0.1)} 100%)`,
          borderBottom: `1px solid ${alpha('#4A90E2', 0.1)}`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#4A90E2' }}>
              MR.CREAMS
            </Typography>
            <Button
              variant="outlined"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{
                borderColor: '#4A90E2',
                color: '#4A90E2',
                '&:hover': {
                  borderColor: '#357ABD',
                  bgcolor: alpha('#4A90E2', 0.1)
                }
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              startIcon={<BusinessIcon />}
              onClick={handleProLogin}
              sx={{ ml: 2, bgcolor: '#8B5FBF', '&:hover': { bgcolor: '#7B4F9F' } }}
            >
              Pro Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
            How would you like to use MR.CREAMS?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Choose the option that best describes your relationship with our platform
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {/* End User Card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: 4, 
                cursor: 'pointer', 
                height: '100%',
                borderRadius: 3,
                border: `2px solid ${alpha('#4A90E2', 0.2)}`,
                '&:hover': {
                  borderColor: '#4A90E2',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleUserTypeSelection('end_user')}
            >
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
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
                    mb: 3
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 40, color: '#4A90E2' }} />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                  For My Relationship
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  I want to improve my relationship, resolve conflicts, and enhance emotional connection with my partner.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#4A90E2', mb: 1 }}>
                    Perfect for:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {['Couples', 'Individuals', 'Dating', 'Married'].map((tag) => (
                      <Paper
                        key={tag}
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: alpha('#4A90E2', 0.1),
                          color: '#4A90E2',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {tag}
                      </Paper>
                    ))}
                  </Box>
                </Box>

                <Button 
                  variant="contained" 
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#4A90E2',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: '#357ABD'
                    }
                  }}
                >
                  Continue as User
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Company User Card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: 4, 
                cursor: 'pointer', 
                height: '100%',
                borderRadius: 3,
                border: `2px solid ${alpha('#8B5FBF', 0.2)}`,
                '&:hover': {
                  borderColor: '#8B5FBF',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleUserTypeSelection('company_user')}
            >
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha('#8B5FBF', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 40, color: '#8B5FBF' }} />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                  For Professional Use
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  I'm a therapist, counselor, administrator, or professional helping others with relationship guidance.
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#8B5FBF', mb: 1 }}>
                    Perfect for:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {['Therapists', 'Counselors', 'Admins', 'Organizations'].map((tag) => (
                      <Paper
                        key={tag}
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: alpha('#8B5FBF', 0.1),
                          color: '#8B5FBF',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {tag}
                      </Paper>
                    ))}
                  </Box>
                </Box>

                <Button 
                  variant="outlined" 
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: '#8B5FBF',
                    color: '#8B5FBF',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#7B4F9F',
                      bgcolor: alpha('#8B5FBF', 0.1)
                    }
                  }}
                >
                  Continue as Professional
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Information */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
            Need Help Choosing?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            If you're unsure which option is right for you, our support team is here to help.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="text"
              startIcon={<SupportIcon />}
              sx={{ color: '#4A90E2' }}
            >
              Contact Support
            </Button>
            <Button
              variant="text"
              startIcon={<PsychologyIcon />}
              sx={{ color: '#8B5FBF' }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Trust Indicators */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            🔒 Secure & Private • 💝 Trusted by thousands • 🚀 Start free today
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default UserTypeSelection;
