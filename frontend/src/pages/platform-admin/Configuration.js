import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

const Configuration = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/platform/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (section, key) => {
    setConfig(prev => {
      // Handle updates to allFlags (the source of truth)
      if (section === 'allFlags') {
        return {
          ...prev,
          allFlags: {
            ...prev.allFlags,
            [key]: {
              ...prev.allFlags[key],
              enabled: !prev.allFlags[key].enabled
            }
          },
          // Also update the convenience fields if they map
          ...(key === 'maintenance_mode' ? { maintenanceMode: !prev.maintenanceMode } : {}),
          featureFlags: {
            ...prev.featureFlags,
            ...(key === 'beta_features' ? { betaFeatures: !prev.featureFlags.betaFeatures } : {}),
            ...(key === 'new_analytics' ? { newAnalytics: !prev.featureFlags.newAnalytics } : {})
          }
        };
      }
      
      // Legacy handling (if needed, but ideally we drive everything from allFlags)
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: !prev[section][key]
          }
        };
      } else {
        return {
          ...prev,
          [key]: !prev[key]
        };
      }
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Prepare dynamic flags payload
      const dynamicFlags = {};
      if (config.allFlags) {
        Object.entries(config.allFlags).forEach(([key, value]) => {
          dynamicFlags[key] = value.enabled;
        });
      }

      await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          featureFlags: config.featureFlags,
          maintenanceMode: config.maintenanceMode,
          dynamicFlags
        })
      });
      setMessage({ open: true, text: 'Configuration saved successfully', severity: 'success' });
    } catch (error) {
      setMessage({ open: true, text: 'Failed to save configuration', severity: 'error' });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Configuration
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          General Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Maintenance Mode" 
              secondary="Prevents regular users from accessing the system" 
            />
            <ListItemSecondaryAction>
              <Switch 
                edge="end" 
                checked={config?.allFlags?.maintenance_mode?.enabled || false} 
                onChange={() => handleToggle('allFlags', 'maintenance_mode')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Allow Registration" 
              secondary="Enable/disable new user signups" 
            />
            <ListItemSecondaryAction>
              <Switch 
                edge="end" 
                checked={config?.allowRegistration || false} 
                onChange={() => handleToggle(null, 'allowRegistration')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Feature Flags
        </Typography>
        <List>
          {config?.allFlags && Object.entries(config.allFlags).map(([key, flag]) => (
            <React.Fragment key={key}>
              <ListItem>
                <ListItemText 
                  primary={flag.description || key}
                  secondary={`Key: ${key}`}
                />
                <ListItemSecondaryAction>
                  <Switch 
                    edge="end" 
                    checked={flag.enabled} 
                    onChange={() => handleToggle('allFlags', key)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>

      <Snackbar 
        open={message.open} 
        autoHideDuration={6000} 
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert severity={message.severity} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Configuration;
