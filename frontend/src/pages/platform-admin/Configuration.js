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
  CircularProgress,
  Grid
} from '@mui/material';
import { apiRequest } from '../../utils/apiService';
import PaymentGatewayConfig from '../../components/admin/PaymentGatewayConfig';

const Configuration = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'success' });
  const [groups, setGroups] = useState({ core: [], security: [], features: [] });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const data = await apiRequest('/platform/config', 'GET', null, token);
      setConfig(data);
      const entries = Object.entries(data.allFlags || {});
      setGroups({
        core: entries.filter(([k]) => k.includes('core') || k.includes('maintenance')),
        security: entries.filter(([k]) => k.includes('security') || k.includes('audit')),
        features: entries.filter(([k]) => !k.includes('core') && !k.includes('security'))
      });
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

      await apiRequest('/platform/config', 'POST', {
        featureFlags: config.featureFlags,
        maintenanceMode: config.maintenanceMode,
        dynamicFlags
      }, token);
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Core
            </Typography>
            <List>
              {groups.core.map(([key, flag]) => (
                <React.Fragment key={key}>
                  <ListItem>
                    <ListItemText primary={flag.description || key} secondary={`Key: ${key}`} />
                    <ListItemSecondaryAction>
                      <Switch edge="end" checked={flag.enabled} onChange={() => handleToggle('allFlags', key)} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <List>
              {groups.security.map(([key, flag]) => (
                <React.Fragment key={key}>
                  <ListItem>
                    <ListItemText primary={flag.description || key} secondary={`Key: ${key}`} />
                    <ListItemSecondaryAction>
                      <Switch edge="end" checked={flag.enabled} onChange={() => handleToggle('allFlags', key)} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <List>
              {groups.features.map(([key, flag]) => (
                <React.Fragment key={key}>
                  <ListItem>
                    <ListItemText primary={flag.description || key} secondary={`Key: ${key}`} />
                    <ListItemSecondaryAction>
                      <Switch edge="end" checked={flag.enabled} onChange={() => handleToggle('allFlags', key)} />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Gateways
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure credentials for Stripe (international) and Ethiopian gateways (Chapa, SantimPay).
            </Typography>
            <PaymentGatewayConfig />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSave}>Save Changes</Button>
        <Button variant="outlined" size="large" onClick={() => setMessage({ open: true, text: 'Rollback scheduled', severity: 'warning' })}>Rollback</Button>
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
