import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { green, red, orange } from '@mui/material/colors';

export default function ITAdminDashboard() {
  const systemStatus = {
    status: 'operational',
    lastUpdated: '2023-11-15T14:30:00Z',
    components: [
      { name: 'Web Server', status: 'operational' },
      { name: 'Database', status: 'operational' },
      { name: 'API Service', status: 'degraded' },
      { name: 'Authentication', status: 'operational' },
      { name: 'File Storage', status: 'operational' },
      { name: 'Background Jobs', status: 'operational' },
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return { color: green[600], label: 'Operational' };
      case 'degraded':
        return { color: orange[600], label: 'Degraded' };
      case 'outage':
        return { color: red[600], label: 'Outage' };
      default:
        return { color: 'text.secondary', label: 'Unknown' };
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>IT Admin Dashboard</Typography>
      
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">System Status</Typography>
                <Chip 
                  label={getStatusColor(systemStatus.status).label}
                  style={{
                    backgroundColor: getStatusColor(systemStatus.status).color,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              
              <Typography variant="body2" color="textSecondary" mb={3}>
                Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}
              </Typography>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>Components</Typography>
                <Grid container spacing={2}>
                  {systemStatus.components.map((component, index) => {
                    const status = getStatusColor(component.status);
                    return (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box display="flex" alignItems="center">
                          <Box 
                            width={12} 
                            height={12} 
                            bgcolor={status.color} 
                            borderRadius="50%" 
                            mr={1}
                          />
                          <Typography variant="body2">
                            {component.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" ml="auto">
                            {status.label}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3} style={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>System Resources</Typography>
              
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">CPU Usage</Typography>
                  <Typography variant="body2">42%</Typography>
                </Box>
                <Box width="100%" height={8} bgcolor="#e0e0e0" borderRadius={4} overflow="hidden">
                  <Box width="42%" height="100%" bgcolor={orange[500]} />
                </Box>
              </Box>
              
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">Memory Usage</Typography>
                  <Typography variant="body2">65%</Typography>
                </Box>
                <Box width="100%" height={8} bgcolor="#e0e0e0" borderRadius={4} overflow="hidden">
                  <Box width="65%" height="100%" bgcolor={green[500]} />
                </Box>
              </Box>
              
              <Box>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">Disk Usage</Typography>
                  <Typography variant="body2">78%</Typography>
                </Box>
                <Box width="100%" height={8} bgcolor="#e0e0e0" borderRadius={4} overflow="hidden">
                  <Box width="78%" height="100%" bgcolor={red[500]} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activities</Typography>
              <Box>
                {[
                  { id: 1, action: 'Database backup completed', time: '2 minutes ago', status: 'success' },
                  { id: 2, action: 'Security scan completed', time: '1 hour ago', status: 'success' },
                  { id: 3, action: 'API response time increased', time: '3 hours ago', status: 'warning' },
                  { id: 4, action: 'User authentication updated', time: '5 hours ago', status: 'success' },
                ].map((activity) => (
                  <Box key={activity.id} display="flex" alignItems="center" py={1} borderBottom="1px solid #eee">
                    <Box
                      width={8}
                      height={8}
                      borderRadius="50%"
                      bgcolor={
                        activity.status === 'success' 
                          ? green[500] 
                          : activity.status === 'warning' 
                          ? orange[500] 
                          : red[500]
                      }
                      mr={2}
                    />
                    <Typography variant="body2" style={{ flex: 1 }}>
                      {activity.action}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
