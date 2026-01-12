import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CouplesTestimonialCarousel from './CouplesTestimonialCarousel';

import ProfessionalEndorsements from './ProfessionalEndorsements';

import MediaMentions from './MediaMentions';

import LiveStatsCounter from './LiveStatsCounter';

const Testimonials = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 8 }}>
          Trusted by Couples and Professionals Alike
        </Typography>

        {/* 1. Couples Testimonial Carousel */}
        <Box mb={8}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Couples Stories</Typography>
          <CouplesTestimonialCarousel />
        </Box>

        {/* 2. Professional Endorsements */}
        <Box mb={8}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Professional Endorsements</Typography>
          <ProfessionalEndorsements />
        </Box>

        {/* 3. Media Mentions */}
        <Box mb={8}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Featured In & Clinically Validated</Typography>
          <MediaMentions />
        </Box>

        {/* 4. Live Stats Counter */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Our Impact in Real-Time</Typography>
          <LiveStatsCounter />
        </Box>
        
        <Divider sx={{ my: 6 }} />
        
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center' }}>
          <Button variant="text" onClick={() => navigate('/features')}>Features</Button>
          <Button variant="text" onClick={() => navigate('/pricing')}>Pricing</Button>
          <Button variant="text" onClick={() => navigate('/resources')}>Resources</Button>
          <Button variant="text" onClick={() => navigate('/about')}>About</Button>
          <Button variant="text" onClick={() => navigate('/contact')}>Contact</Button>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Subscribe to our newsletter</Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              setEmail('');
            }}
            sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', md: 'row' } }}
          >
            <TextField
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ minWidth: { md: 360 } }}
            />
            <Button type="submit" variant="contained" sx={{ bgcolor: '#00B4D8' }}>
              Subscribe
            </Button>
          </Box>
          {submitted && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Thanks! You’re subscribed.
            </Typography>
          )}
        </Box>

      </Container>
    </Box>
  );
};

export default Testimonials;
