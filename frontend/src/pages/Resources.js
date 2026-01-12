import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const items = [
  { title: 'Guide: Active Listening', summary: 'Improve communication with structured steps' },
  { title: 'Blog: Emotion Patterns', summary: 'Understanding triggers and reactions' },
  { title: 'Worksheet: Appreciation', summary: 'Practice gratitude with prompts' },
];

const Resources = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
          Resources
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Practical guides and insights to strengthen relationships.
        </Typography>
        <Grid container spacing={4}>
          {items.map((i) => (
            <Grid item xs={12} md={4} key={i.title}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {i.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {i.summary}
                  </Typography>
                  <Button variant="text" onClick={() => navigate('/register')}>
                    Read
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

export default Resources;
