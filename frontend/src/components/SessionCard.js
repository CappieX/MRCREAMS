import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { AccessTime, CalendarToday } from '@mui/icons-material';

const SessionCard = ({ session }) => {
  if (!session) return null;

  return (
    <Card sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">{session.clientName}</Typography>
          <Chip label={session.type} size="small" color="primary" variant="outlined" />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday fontSize="small" />
            <Typography variant="body2">{session.date}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" />
            <Typography variant="body2">{session.time}</Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Topic: {session.topic || 'Regular Check-in'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
