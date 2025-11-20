import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Switch, FormControlLabel } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import { dashboardTheme } from '../../constants/dashboardTheme';

const IntegrationsManagement = () => {
  const integrations = [
    { name: 'Slack', description: 'Team notifications', status: 'active', icon: '💬' },
    { name: 'Zoom', description: 'Video conferencing', status: 'active', icon: '📹' },
    { name: 'Google Calendar', description: 'Session scheduling', status: 'active', icon: '📅' },
    { name: 'Stripe', description: 'Payment processing', status: 'active', icon: '💳' },
    { name: 'Twilio', description: 'SMS notifications', status: 'inactive', icon: '📱' },
    { name: 'SendGrid', description: 'Email delivery', status: 'active', icon: '✉️' }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Integrations Management
      </Typography>

      <Grid container spacing={3}>
        {integrations.map((integration, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ fontSize: 32 }}>{integration.icon}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {integration.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {integration.description}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={integration.status} 
                    size="small"
                    color={integration.status === 'active' ? 'success' : 'default'}
                    icon={integration.status === 'active' ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                  <FormControlLabel
                    control={<Switch checked={integration.status === 'active'} />}
                    label=""
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default IntegrationsManagement;
