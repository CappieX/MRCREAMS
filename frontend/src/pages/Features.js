import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, alpha, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const features = [
    { title: 'Emotion Analysis', description: 'Real-time detection across 12+ emotional dimensions', badge: 'AI-Powered' },
    { title: 'Conflict Guidance', description: 'Structured exercises for resolution and reconnection', badge: 'Guided' },
    { title: 'Harmony Score', description: 'Track progress with actionable insights', badge: 'Analytics' },
    { title: 'Privacy & Security', description: 'HIPAA and GDPR aligned safeguards', badge: 'Compliant' },
    { title: 'Therapist Tools', description: 'Session analytics and documentation support', badge: 'Professional' },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
          Features
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Powerful tools for couples and professionals with a unified experience.
        </Typography>
        <Grid container spacing={4}>
          {features.map((f) => (
            <Grid item xs={12} md={6} lg={4} key={f.title}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#0A2540', 0.08)}`,
                  boxShadow: '0 10px 30px rgba(10, 37, 64, 0.06)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Chip label={f.badge} size="small" sx={{ mb: 2, bgcolor: alpha('#00B4D8', 0.12) }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 6 }}>
          <Button variant="contained" sx={{ bgcolor: '#00B4D8' }} onClick={() => navigate('/register')}>
            Start Free Trial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
