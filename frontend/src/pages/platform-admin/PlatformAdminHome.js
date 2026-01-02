import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button
} from '@mui/material';
import {
  CheckCircle as HealthyIcon,
  Warning as WarningIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PlatformAdminHome = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHealth();
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
      console.error('Failed to fetch health data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box p={3}><CircularProgress /></Box>;
  }

  const statusColor = health?.status === 'healthy' ? 'success.main' : 'error.main';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Platform Overview
      </Typography>

      <Grid container spacing={3}>
        {/* System Status Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                System Status
              </Typography>
              <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
                {health?.status?.toUpperCase() || 'UNKNOWN'}
              </Typography>
            </Box>
            {health?.status === 'healthy' ? (
              <HealthyIcon sx={{ fontSize: 40, color: statusColor }} />
            ) : (
              <WarningIcon sx={{ fontSize: 40, color: statusColor }} />
            )}
          </Paper>
        </Grid>

        {/* Database Status Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Database
              </Typography>
              <Typography variant="h5">
                {health?.database?.status === 'connected' ? 'Connected' : 'Disconnected'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Latency: {health?.database?.latency || 'N/A'}
              </Typography>
            </Box>
            <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Paper>
        </Grid>

        {/* Uptime Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Uptime
              </Typography>
              <Typography variant="h5">
                {health?.uptime ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : 'N/A'}
              </Typography>
            </Box>
            <TimerIcon sx={{ fontSize: 40, color: 'info.main' }} />
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="contained" onClick={() => navigate('/dashboard/platform-admin/health')}>
                    View Detailed Health
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => navigate('/dashboard/platform-admin/logs')}>
                    View Audit Logs
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => navigate('/dashboard/platform-admin/config')}>
                    System Configuration
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlatformAdminHome;
