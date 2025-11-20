import React, { useState } from 'react';
import {
  Box,
  Toolbar,
  IconButton,
  AppBar,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import SuperAdminSidebar from '../../components/SuperAdminSidebar';
import { Outlet, useLocation } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get current page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/users')) return 'Users & Roles Management';
    if (path.includes('/emotion-analysis')) return 'Emotion Analysis Dashboard';
    if (path.includes('/sessions')) return 'Sessions & Conversations';
    if (path.includes('/models')) return 'Model Management';
    if (path.includes('/security')) return 'Security Center';
    if (path.includes('/analytics')) return 'Reports & Analytics';
    if (path.includes('/data-governance')) return 'Data Governance';
    if (path.includes('/integrations')) return 'Integrations Management';
    if (path.includes('/settings')) return 'System Settings';
    if (path.includes('/support')) return 'Support & Escalations';
    return 'Super Admin Dashboard';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleSidebarToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <SuperAdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant={isMobile ? 'temporary' : 'persistent'}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${sidebarOpen && !isMobile ? 280 : 0}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Outlet /> {/* This renders the nested routes */}
      </Box>
    </Box>
  );
};

const OldSuperAdminDashboard = () => {
  const [systemHealth, setSystemHealth] = useState(98);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // State for system performance data
  const [performanceData, setPerformanceData] = useState([]);
  const [serverStatus, setServerStatus] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [organizationData, setOrganizationData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true);
        
        // Import analytics API
        const { analyticsAPI, adminAPI } = await import('../../utils/apiService');
        
        // Fetch performance data
        const performance = await analyticsAPI.getPerformanceData('24h');
        setPerformanceData(performance.data || []);
        
        // Fetch server status
        const systemHealth = await analyticsAPI.getSystemHealth();
        setServerStatus(systemHealth.servers || []);
        setSystemHealth(systemHealth.overallHealth || 98);
        
        // Fetch recent alerts
        const logs = await adminAPI.getAuditLogs({ limit: 3, type: 'alert' });
        setRecentAlerts(logs.data || []);
        
        // Fetch organization data
        const orgStats = await analyticsAPI.getUserAnalytics({ groupBy: 'status' });
        
        // Map organization data to the expected format with colors
        const mappedOrgData = Object.entries(orgStats.data || {}).map(([name, value]) => {
          let color = dashboardTheme.colors.info;
          if (name === 'Active') color = dashboardTheme.colors.success;
          if (name === 'Suspended') color = dashboardTheme.colors.warning;
          if (name === 'Inactive') color = dashboardTheme.colors.error;
          return { name, value, color };
        });
        
        setOrganizationData(mappedOrgData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to sample data if API fails
        setPerformanceData([
          { time: '00:00', cpu: 45, memory: 62, requests: 1200 },
          { time: '04:00', cpu: 38, memory: 58, requests: 800 },
          { time: '08:00', cpu: 72, memory: 75, requests: 3500 },
          { time: '12:00', cpu: 85, memory: 82, requests: 4200 },
          { time: '16:00', cpu: 68, memory: 71, requests: 3100 },
          { time: '20:00', cpu: 52, memory: 65, requests: 2400 }
        ]);
        
        setServerStatus([
          { name: 'Web Server 1', status: 'healthy', uptime: '99.9%', load: 45 },
          { name: 'Web Server 2', status: 'healthy', uptime: '99.8%', load: 52 },
          { name: 'API Server 1', status: 'healthy', uptime: '99.9%', load: 38 },
          { name: 'Database Primary', status: 'healthy', uptime: '100%', load: 65 },
          { name: 'Database Replica', status: 'warning', uptime: '98.2%', load: 78 },
          { name: 'Cache Server', status: 'healthy', uptime: '99.9%', load: 42 }
        ]);
        
        setRecentAlerts([
          { id: 1, type: 'warning', message: 'High memory usage on Database Replica', time: '5 min ago' },
          { id: 2, type: 'info', message: 'Scheduled backup completed successfully', time: '1 hour ago' },
          { id: 3, type: 'success', message: 'System update deployed to production', time: '3 hours ago' }
        ]);
        
        setOrganizationData([
          { name: 'Active', value: 42, color: dashboardTheme.colors.success },
          { name: 'Trial', value: 18, color: dashboardTheme.colors.info },
          { name: 'Suspended', value: 5, color: dashboardTheme.colors.warning },
          { name: 'Inactive', value: 3, color: dashboardTheme.colors.error }
        ]);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setLastUpdate(new Date());
    setDataLoading(true);
    
    try {
      // Import analytics API
      const { analyticsAPI, adminAPI } = await import('../../utils/apiService');
      
      // Fetch fresh data
      const performance = await analyticsAPI.getPerformanceData('24h');
      setPerformanceData(performance.data || []);
      
      const systemHealth = await analyticsAPI.getSystemHealth();
      setServerStatus(systemHealth.servers || []);
      setSystemHealth(systemHealth.overallHealth || 98);
      
      const logs = await adminAPI.getAuditLogs({ limit: 3, type: 'alert' });
      setRecentAlerts(logs.data || []);
      
      const orgStats = await analyticsAPI.getUserAnalytics({ groupBy: 'status' });
      const mappedOrgData = Object.entries(orgStats.data || {}).map(([name, value]) => {
        let color = dashboardTheme.colors.info;
        if (name === 'Active') color = dashboardTheme.colors.success;
        if (name === 'Suspended') color = dashboardTheme.colors.warning;
        if (name === 'Inactive') color = dashboardTheme.colors.error;
        return { name, value, color };
      });
      
      setOrganizationData(mappedOrgData);
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: dashboardTheme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: dashboardTheme.colors.text.primary, mb: 1 }}>
            Global System Command Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} sx={{ backgroundColor: 'white' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button 
            variant="contained" 
            startIcon={<SettingsIcon />}
            sx={{ 
              background: roleColors.super_admin.gradient,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            System Settings
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Users"
            value="1,248"
            change="+12.5%"
            changeType="increase"
            icon={PeopleIcon}
            color={dashboardTheme.colors.chart.blue}
            subtitle="Active this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Organizations"
            value="68"
            change="+8 new"
            changeType="increase"
            icon={BusinessIcon}
            color={dashboardTheme.colors.chart.teal}
            subtitle="42 active, 18 trial"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="System Health"
            value={`${systemHealth}%`}
            change="Excellent"
            changeType="increase"
            icon={CheckCircleIcon}
            color={dashboardTheme.colors.success}
            subtitle="All systems operational"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Sessions"
            value="156"
            change="+23"
            changeType="increase"
            icon={DashboardIcon}
            color={dashboardTheme.colors.chart.purple}
            subtitle="Real-time connections"
          />
        </Grid>
      </Grid>

      {/* System Performance & Server Status */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <DashboardCard title="System Performance - Last 24 Hours" subtitle="CPU, Memory & Request Load">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={dashboardTheme.colors.chart.blue} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={dashboardTheme.colors.chart.blue} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={dashboardTheme.colors.chart.purple} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={dashboardTheme.colors.chart.purple} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke={dashboardTheme.colors.text.secondary} />
                <YAxis stroke={dashboardTheme.colors.text.secondary} />
                <ChartTooltip />
                <Legend />
                <Area type="monotone" dataKey="cpu" stroke={dashboardTheme.colors.chart.blue} fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
                <Area type="monotone" dataKey="memory" stroke={dashboardTheme.colors.chart.purple} fillOpacity={1} fill="url(#colorMemory)" name="Memory %" />
              </AreaChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DashboardCard title="Organization Distribution" subtitle="By status type">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={organizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {organizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Server Status & Recent Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <DashboardCard title="Server Infrastructure Status" subtitle="Real-time monitoring">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Server</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Uptime</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Load</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serverStatus.map((server, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StatusDot status={server.status} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {server.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator status={server.status} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {server.uptime}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 150 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={server.load} 
                            sx={{ 
                              flexGrow: 1, 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: server.load > 70 ? dashboardTheme.colors.warning : dashboardTheme.colors.success
                              }
                            }} 
                          />
                          <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 35 }}>
                            {server.load}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DashboardCard title="Recent Alerts" subtitle="System notifications">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentAlerts.map((alert) => (
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
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 1, textTransform: 'none' }}
              >
                View All Alerts
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;
