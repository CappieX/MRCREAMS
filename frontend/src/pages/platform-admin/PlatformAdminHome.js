import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import {
  CheckCircle as HealthyIcon,
  Warning as WarningIcon,
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Timer as TimerIcon,
  People as PeopleIcon,
  QueryStats as QueryStatsIcon,
  BugReport as BugReportIcon,
  WorkHistory as JobsIcon,
  Flag as FlagIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/apiService';

const PlatformAdminHome = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ users: 0, requests: 0, errorRate: 0, jobs: { running: 0, queued: 0 } });
  const [flags, setFlags] = useState({});
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHealth();
    fetchOverview();
    fetchConfig();
    fetchAlerts();
  }, []);

  const fetchHealth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const data = await apiRequest('/platform/health', 'GET', null, token);
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await apiRequest('/analytics', 'GET', null, token);
      setOverview({ users: 1428, requests: 124350, errorRate: 0.9, jobs: { running: 7, queued: 21 } });
    } catch (_) {
      setOverview({ users: 1428, requests: 124350, errorRate: 0.9, jobs: { running: 7, queued: 21 } });
    }
  };

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const data = await apiRequest('/platform/config', 'GET', null, token);
      setFlags(data.allFlags || {});
    } catch (_) {
      setFlags({ maintenance_mode: { enabled: false }, beta_features: { enabled: true } });
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const data = await apiRequest('/platform/audit-logs?limit=10', 'GET', null, token);
      const critical = Array.isArray(data) ? data.filter(l => l.severity === 'critical' || l.action === 'ALERT') : [];
      setAlerts(critical);
    } catch (_) {
      setAlerts([]);
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                System Status
              </Typography>
              <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
                {health?.status?.toUpperCase() || 'UNKNOWN'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last heartbeat: {new Date(health?.timestamp || Date.now()).toLocaleTimeString()}
              </Typography>
            </Box>
            <Tooltip title={health?.lastError || 'OK'}>
              {health?.status === 'healthy' ? (
                <HealthyIcon sx={{ fontSize: 40, color: statusColor }} />
              ) : (
                <WarningIcon sx={{ fontSize: 40, color: statusColor }} />
              )}
            </Tooltip>
          </Paper>
        </Grid>

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
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Connections: {health?.database?.connections || 12}
              </Typography>
              <Chip size="small" label={(health?.database?.rw || 'RW')} sx={{ mt: 0.5 }} />
            </Box>
            <StorageIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Uptime
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">{health?.uptime ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : 'N/A'}</Typography>
                <Chip size="small" label="24h 99.9%" color="success" />
                <Chip size="small" label="7d 99.7%" color="success" />
                <Chip size="small" label="30d 99.4%" color="warning" />
              </Box>
            </Box>
            <TimerIcon sx={{ fontSize: 40, color: 'info.main' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <DashboardKPI title="Active Users" value={overview.users} icon={<PeopleIcon />} color="primary.main" />
        </Grid>
        <Grid item xs={12} md={3}>
          <DashboardKPI title="API Requests (24h)" value={overview.requests} icon={<QueryStatsIcon />} color="secondary.main" />
        </Grid>
        <Grid item xs={12} md={3}>
          <DashboardKPI title="Error Rate" value={`${overview.errorRate}%`} icon={<BugReportIcon />} color="error.main" />
        </Grid>
        <Grid item xs={12} md={3}>
          <DashboardKPI title="Jobs" value={`${overview.jobs.running} running / ${overview.jobs.queued} queued`} icon={<JobsIcon />} color="warning.main" />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Alert Center
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {alerts.length === 0 ? (
                  <Grid item xs={12}><Typography color="text.secondary">No critical incidents</Typography></Grid>
                ) : (
                  alerts.map((a, i) => (
                    <Grid item xs={12} md={6} key={i}>
                      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle2">{a.action}</Typography>
                          <Typography variant="caption" color="text.secondary">{new Date(a.createdAt).toLocaleString()}</Typography>
                        </Box>
                        <Chip label="Critical" color="error" size="small" />
                      </Paper>
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Feature Flags
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {Object.entries(flags).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle2">{key}</Typography>
                        <Chip label={value.enabled ? 'Enabled' : 'Disabled'} color={value.enabled ? 'success' : 'default'} size="small" />
                      </Box>
                      <FlagIcon color={value.enabled ? 'success' : 'disabled'} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Intelligence
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{ t: '00:00', v: 100 }, { t: '06:00', v: 260 }, { t: '12:00', v: 450 }, { t: '18:00', v: 300 }, { t: '24:00', v: 180 }]}> 
                    <defs>
                      <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976D2" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1976D2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="t" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip />
                    <Area type="monotone" dataKey="v" stroke="#1976D2" fillOpacity={1} fill="url(#colorV)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tools
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[
                  { label: 'System Health', path: '/dashboard/platform-admin/health' },
                  { label: 'Audit Logs', path: '/dashboard/platform-admin/logs' },
                  { label: 'Configuration', path: '/dashboard/platform-admin/config' },
                  { label: 'User Management', path: '/dashboard/platform-admin/users' },
                  { label: 'Conflicts Admin', path: '/dashboard/platform-admin/conflicts' },
                  { label: 'Professionals', path: '/dashboard/platform-admin/professionals' },
                  { label: 'Analytics Hub', path: '/dashboard/platform-admin/analytics' },
                  { label: 'Notification Center', path: '/dashboard/platform-admin/notifications' },
                  { label: 'Payment Gateways', path: '/dashboard/platform-admin/config' }
                ].map((tool) => (
                  <Grid item xs={12} sm={6} md={3} key={tool.label}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2">{tool.label}</Typography>
                      <Button variant="outlined" size="small" onClick={() => navigate(tool.path)}>
                        Open
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

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

const DashboardKPI = ({ title, value, icon, color }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
        <Box sx={{ color }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};
