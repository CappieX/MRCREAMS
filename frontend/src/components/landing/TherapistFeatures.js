import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, useTheme, alpha, Button } from '@mui/material';
import { Security, BarChart, AutoFixHigh, People, Power, School } from '@mui/icons-material';

const features = [
  {
    icon: '🛡️',
    title: 'HIPAA-Compliant Dashboard',
    description: 'Bank-level security with end-to-end encryption.',
    badge: 'GDPR Ready',
  },
  {
    icon: '📊',
    title: 'Advanced Session Analytics',
    description: 'Deep emotional pattern recognition across sessions.',
    feature: 'Export reports to PDF/CSV',
  },
  {
    icon: '🤖',
    title: 'AI-Assisted Documentation',
    description: 'Automated progress notes with therapist review.',
    timeSaved: '40% faster documentation',
  },
  {
    icon: '👥',
    title: 'Multi-Client Management',
    description: 'Manage 50+ clients with individual progress tracking.',
    feature: 'Bulk action support',
  },
  {
    icon: '🔌',
    title: 'Integration Ecosystem',
    description: 'Connect with EHR systems, calendars, payment processors.',
    logos: ['Zoom', 'Google Calendar', 'Stripe', 'TherapyNotes'],
  },
  {
    icon: '🎓',
    title: 'Research & Training',
    description: 'Access to latest emotional intelligence research.',
    feature: 'Continuing education credits',
  },
];

const TherapistFeatures = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          A Smarter Way to Practice
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Our platform provides therapists with the tools to deliver exceptional care and achieve better client outcomes.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ fontSize: '3rem', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3, minHeight: 60 }}>
                  {feature.description}
                </Typography>
                {feature.badge && (
                  <Chip label={feature.badge} color="success" sx={{ fontWeight: 'bold' }} />
                )}
                {feature.feature && (
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {feature.feature}
                  </Typography>
                )}
                {feature.timeSaved && (
                  <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                    {feature.timeSaved}
                  </Typography>
                )}
                {feature.logos && (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                    {feature.logos.map((logo, i) => (
                      <Chip key={i} label={logo} size="small" />
                    ))}
                  </Box>
                )}
                <Button
                  variant="text"
                  sx={{
                    mt: 3,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  Learn More &rarr;
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TherapistFeatures;
