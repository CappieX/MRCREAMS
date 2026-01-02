import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';

const SystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/platform/health', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch health:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Health Monitor
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Memory Usage
        </Typography>
        {health?.memory && (
          <List>
            <ListItem>
              <ListItemText 
                primary="RSS (Resident Set Size)" 
                secondary={`${(health.memory.rss / 1024 / 1024).toFixed(2)} MB`} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Heap Total" 
                secondary={`${(health.memory.heapTotal / 1024 / 1024).toFixed(2)} MB`} 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Heap Used" 
                secondary={`${(health.memory.heapUsed / 1024 / 1024).toFixed(2)} MB`} 
              />
            </ListItem>
          </List>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Environment Info
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Platform" secondary={health?.system?.platform} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Node Version" secondary={health?.system?.nodeVersion} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Server Time" secondary={health?.timestamp} />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default SystemHealth;
