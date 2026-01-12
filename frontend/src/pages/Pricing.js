import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const tiers = [
  { name: 'Starter', price: '$0', description: 'Try emotion analysis demo and exercises', cta: 'Get Started' },
  { name: 'Couples', price: '$29/mo', description: 'Full access for two, progress tracking and guidance', cta: 'Start Trial' },
  { name: 'Professional', price: '$79/mo', description: 'Session analytics, documentation, client management', cta: 'Request Demo' },
];

const Pricing = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          Pricing
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Simple, transparent plans for every stage of your journey.
        </Typography>
        <Grid container spacing={4}>
          {tiers.map((t) => (
            <Grid item xs={12} md={4} key={t.name}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${alpha('#0A2540', 0.08)}`,
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                    {t.name}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, color: '#00B4D8' }}>
                    {t.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: '#00B4D8' }}
                    onClick={() => {
                      if (t.name === 'Professional') return navigate('/professional-login');
                      return navigate('/register');
                    }}
                  >
                    {t.cta}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing;
