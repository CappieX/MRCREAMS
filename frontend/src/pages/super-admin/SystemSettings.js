import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Switch, FormControlLabel, Button, Divider } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';

const SystemSettings = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          System Settings
        </Typography>
        <Button variant="contained" startIcon={<SaveIcon />} sx={{ textTransform: 'none' }}>
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardCard title="Security Settings" subtitle="Authentication & access controls">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel control={<Switch defaultChecked />} label="Require Two-Factor Authentication" />
              <FormControlLabel control={<Switch defaultChecked />} label="Enable IP Whitelisting" />
              <FormControlLabel control={<Switch defaultChecked />} label="Session Timeout (4 hours)" />
              <FormControlLabel control={<Switch />} label="Allow API Access" />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title="Feature Flags" subtitle="Enable/disable platform features">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel control={<Switch defaultChecked />} label="ML Emotion Analysis" />
              <FormControlLabel control={<Switch defaultChecked />} label="Real-time Chat" />
              <FormControlLabel control={<Switch />} label="Video Sessions (Beta)" />
              <FormControlLabel control={<Switch defaultChecked />} label="Advanced Analytics" />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title="Notification Settings" subtitle="System alerts and emails">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
              <FormControlLabel control={<Switch defaultChecked />} label="SMS Alerts" />
              <FormControlLabel control={<Switch defaultChecked />} label="Security Alerts" />
              <FormControlLabel control={<Switch />} label="Marketing Emails" />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title="Data & Privacy" subtitle="Compliance and retention">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel control={<Switch defaultChecked />} label="GDPR Compliance Mode" />
              <FormControlLabel control={<Switch defaultChecked />} label="HIPAA Compliance Mode" />
              <FormControlLabel control={<Switch defaultChecked />} label="Auto Data Purge" />
              <FormControlLabel control={<Switch defaultChecked />} label="Audit Logging" />
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemSettings;
