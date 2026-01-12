import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { Box, Typography, Grid, Paper } from '@mui/material';

const AnimatedNumber = ({ n }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });
  return <animated.span>{number.to((val) => Math.floor(val))}</animated.span>;
};

const LiveStatsCounter = () => {
  const [activeSessions, setActiveSessions] = useState(28);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSessions((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
      <Grid container spacing={4} textAlign="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="h3" fontWeight="bold">
            <AnimatedNumber n={2500} />+
          </Typography>
          <Typography variant="h6">Couples</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h3" fontWeight="bold">
            <AnimatedNumber n={500} />+
          </Typography>
          <Typography variant="h6">Professionals</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h3" fontWeight="bold">
            <AnimatedNumber n={94} />%
          </Typography>
          <Typography variant="h6">Satisfaction</Typography>
        </Grid>
      </Grid>
      <Box mt={4} textAlign="center">
        <Typography variant="h5" color="primary">
          <animated.span>{activeSessions}</animated.span> sessions active now
        </Typography>
      </Box>
    </Paper>
  );
};

export default LiveStatsCounter;
