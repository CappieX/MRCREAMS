import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Paper, Avatar, Chip, IconButton } from '@mui/material';
import { FormatQuote, VerifiedUser } from '@mui/icons-material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    photo: '/path/to/photo1.jpg', // Replace with actual path
    names: 'Sarah & Michael',
    duration: 'Married 3 years',
    quote: "After 3 months, our communication improved by 85%. The emotion tracking helped us understand what we weren't saying.",
    metrics: 'Harmony Score: 92% • 40% fewer conflicts',
  },
  // Add more testimonials as needed
];

const CouplesTestimonialCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <Slider {...settings}>
      {testimonials.map((testimonial, index) => (
        <Box key={index} p={2}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src={testimonial.photo} sx={{ width: 60, height: 60, mr: 2 }} />
              <Box>
                <Typography variant="h6">{testimonial.names}</Typography>
                <Typography variant="body2" color="text.secondary">{testimonial.duration}</Typography>
              </Box>
              <Chip
                icon={<VerifiedUser />}
                label="Verified User"
                color="success"
                size="small"
                sx={{ ml: 'auto' }}
              />
            </Box>
            <FormatQuote sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
              {testimonial.quote}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {testimonial.metrics}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Slider>
  );
};

export default CouplesTestimonialCarousel;
