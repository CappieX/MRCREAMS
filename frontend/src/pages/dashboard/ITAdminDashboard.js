import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Button, LinearProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Alert
} from '@mui/material';
import {
  Storage as StorageIcon,
  Security as SecurityIcon,
  Cloud as CloudIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Dns as DnsIcon,
  Code as CodeIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import StatusIndicator, { StatusDot } from '../../components/dashboard/StatusIndicator';
import { dashboardTheme, roleColors } from '../../constants/dashboardTheme';

const ITAdminDashboard = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Infrastructure performance data
  const performanceData = [
    { time: '00:00', cpu: 42, memory: 65, network: 120, disk: 55 },
    { time: '04:00', cpu: 35, memory: 61, network: 95, disk: 48 },
    { time: '08:00', cpu: 68, memory: 78, network: 280, disk: 72 },
    { time: '12:00', cpu: 82, memory: 85, network: 350, disk: 80 },
    { time: '16:00', cpu: 71, memory: 76, network: 290, disk: 68 },
    { time: '20:00', cpu: 48, memory: 68, network: 180, disk: 58 }
  ];

  const infrastructureStatus = [
    { name: 'Production API', status: 'healthy', uptime: '99.98%', load: 42, latency: '45ms' },
    { name: 'Database Cluster', status: 'healthy', uptime: '100%', load: 65, latency: '12ms' },
    { name: 'Cache Layer', status: 'healthy', uptime: '99.95%', load: 38, latency: '3ms' },
    { name: 'Message Queue', status: 'warning', uptime: '98.5%', load: 78, latency: '89ms' },
    { name: 'CDN Network', status: 'healthy', uptime: '99.99%', load: 52, latency: '28ms' },
    { name: 'Backup System', status: 'healthy', uptime: '99.92%', load: 35, latency: 'N/A' }
  ];

  const deploymentPipeline = [
    { stage: 'Build', status: 'success', duration: '2m 34s', lastRun: '1 hour ago' },
    { stage: 'Test', status: 'success', duration: '5m 12s', lastRun: '1 hour ago' },
    { stage: 'Security Scan', status: 'success', duration: '3m 45s', lastRun: '1 hour ago' },
    { stage: 'Deploy Staging', status: 'success', duration: '4m 20s', lastRun: '1 hour ago' },
    { stage: 'Deploy Production', status: 'pending', duration: '-', lastRun: 'Awaiting approval' }
  ];

  const securityAlerts = [
    { id: 1, type: 'info', message: 'SSL certificates renewed successfully', time: '30 min ago' },
    { id: 2, type: 'warning', message: 'Unusual login attempt detected - blocked', time: '2 hours ago' },
    { id: 3, type: 'success', message: 'Security patch deployed to all servers', time: '5 hours ago' }
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: dashboardTheme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: dashboardTheme.colors.text.primary, mb: 1 }}>
            Technical Operations Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={() => setLastUpdate(new Date())} sx={{ backgroundColor: 'white' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            startIcon={<CodeIcon />}
            sx={{ 
              background: roleColors.it_admin.gradient,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Deploy Manager
          </Button>
        </Box>
      </Box>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="System Uptime"
            value="99.98%"
            change="All systems operational"
            changeType="increase"
            icon={CheckCircleIcon}
            color={dashboardTheme.colors.success}
            subtitle="Last 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="API Latency"
            value="45ms"
            change="-12ms"
            changeType="increase"
            icon={SpeedIcon}
            color={dashboardTheme.colors.chart.blue}
            subtitle="Average response time"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Storage Used"
            value="1.2TB"
            change="74% capacity"
            changeType="warning"
            icon={StorageIcon}
            color={dashboardTheme.colors.chart.orange}
            subtitle="1.6TB total"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Security Score"
            value="98/100"
            change="Excellent"
            changeType="increase"
            icon={SecurityIcon}
            color={dashboardTheme.colors.success}
            subtitle="0 active threats"
          />
        </Grid>
      </Grid>

      {/* Infrastructure Performance */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <DashboardCard title="Infrastructure Performance Metrics" subtitle="Real-time monitoring - Last 24 hours">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke={dashboardTheme.colors.text.secondary} />
                <YAxis stroke={dashboardTheme.colors.text.secondary} />
                <ChartTooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke={dashboardTheme.colors.chart.blue} strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke={dashboardTheme.colors.chart.purple} strokeWidth={2} name="Memory %" />
                <Line type="monotone" dataKey="disk" stroke={dashboardTheme.colors.chart.orange} strokeWidth={2} name="Disk I/O %" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Infrastructure Status & Deployment Pipeline */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={7}>
          <DashboardCard title="Infrastructure Health Status" subtitle="Service monitoring">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Uptime</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Load</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Latency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infrastructureStatus.map((service, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StatusDot status={service.status} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator status={service.status} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {service.uptime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 120 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={service.load} 
                            sx={{ 
                              flexGrow: 1, 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: service.load > 70 ? dashboardTheme.colors.warning : dashboardTheme.colors.success
                              }
                            }} 
                          />
                          <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 30 }}>
                            {service.load}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={service.latency} 
                          size="small"
                          sx={{ 
                            backgroundColor: '#f5f5f5',
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <DashboardCard title="CI/CD Pipeline Status" subtitle="Deployment workflow">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {deploymentPipeline.map((stage, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 2, 
                    borderRadius: dashboardTheme.borderRadius.md,
                    backgroundColor: '#fafafa',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StatusDot status={stage.status === 'pending' ? 'warning' : stage.status} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stage.stage}
                      </Typography>
                    </Box>
                    <StatusIndicator 
                      status={stage.status === 'pending' ? 'warning' : stage.status} 
                      label={stage.status}
                      size="small" 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Duration: {stage.duration}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {stage.lastRun}
                  </Typography>
                </Box>
              ))}
              <Button 
                variant="contained" 
                startIcon={<PlayIcon />}
                fullWidth
                sx={{ 
                  mt: 1,
                  background: roleColors.it_admin.gradient,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Approve Production Deploy
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Security Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DashboardCard title="Security & System Alerts" subtitle="Recent notifications">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {securityAlerts.map((alert) => (
                <Alert 
                  key={alert.id} 
                  severity={alert.type}
                  sx={{ 
                    borderRadius: dashboardTheme.borderRadius.md,
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {alert.time}
                  </Typography>
                </Alert>
              ))}
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ITAdminDashboard;
