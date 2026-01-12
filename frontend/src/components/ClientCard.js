import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, Chip } from '@mui/material';
import { Event, Chat } from '@mui/icons-material';

const ClientCard = ({ client }) => {
  if (!client) return null;
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={client.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
          <Box>
            <Typography variant="h6">{client.name}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip size="small" label={client.status || 'Active'} color={client.status === 'Critical' ? 'error' : 'success'} />
              <Chip size="small" label="Couples Therapy" variant="outlined" />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<Event />} variant="outlined" size="small">
            Schedule
          </Button>
          <Button startIcon={<Chat />} variant="contained" size="small">
            Message
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
