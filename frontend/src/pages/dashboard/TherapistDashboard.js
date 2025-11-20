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
import TherapistSidebar from '../../components/TherapistSidebar';
import { Outlet, useLocation } from 'react-router-dom';

const TherapistDashboard = () => {
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
    if (path.includes('/sessions')) return 'My Sessions';
    if (path.includes('/clients')) return 'My Clients';
    if (path.includes('/insights')) return 'Emotion Insights';
    if (path.includes('/reports')) return 'Session Reports';
    if (path.includes('/calendar')) return 'My Calendar';
    if (path.includes('/ai-assistant')) return 'AI Therapy Assistant';
    if (path.includes('/settings')) return 'My Settings';
    return 'Therapist Dashboard';
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
      <TherapistSidebar
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

const OldTherapistDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for client progress
  const clientProgressData = [
    { week: 'Week 1', emotional: 45, communication: 50, conflict: 40, overall: 45 },
    { week: 'Week 2', emotional: 52, communication: 58, conflict: 48, overall: 53 },
    { week: 'Week 3', emotional: 61, communication: 65, conflict: 55, overall: 60 },
    { week: 'Week 4', emotional: 68, communication: 72, conflict: 63, overall: 68 },
    { week: 'Week 5', emotional: 75, communication: 78, conflict: 70, overall: 74 },
    { week: 'Week 6', emotional: 82, communication: 85, conflict: 78, overall: 82 }
  ];

  const emotionalMetrics = [
    { metric: 'Emotional Awareness', value: 85 },
    { metric: 'Communication', value: 78 },
    { metric: 'Conflict Resolution', value: 72 },
    { metric: 'Empathy', value: 88 },
    { metric: 'Trust Building', value: 80 }
  ];

  const upcomingSessions = [
    { id: 1, client: 'Sarah & John M.', time: '10:00 AM', type: 'Couples Therapy', status: 'confirmed', priority: 'high' },
    { id: 2, client: 'Emily R.', time: '11:30 AM', type: 'Individual Session', status: 'confirmed', priority: 'normal' },
    { id: 3, client: 'David & Lisa K.', time: '2:00 PM', type: 'Conflict Resolution', status: 'pending', priority: 'high' },
    { id: 4, client: 'Michael T.', time: '3:30 PM', type: 'Follow-up', status: 'confirmed', priority: 'normal' },
    { id: 5, client: 'Anna & Tom W.', time: '5:00 PM', type: 'Progress Review', status: 'confirmed', priority: 'normal' }
  ];

  const activeClients = [
    { 
      id: 1, 
      name: 'Sarah & John M.', 
      avatar: 'SM', 
      progress: 82, 
      sessions: 12, 
      lastSession: '2 days ago',
      status: 'excellent',
      nextSession: 'Today, 10:00 AM'
    },
    { 
      id: 2, 
      name: 'Emily R.', 
      avatar: 'ER', 
      progress: 68, 
      sessions: 8, 
      lastSession: '1 week ago',
      status: 'good',
      nextSession: 'Today, 11:30 AM'
    },
    { 
      id: 3, 
      name: 'David & Lisa K.', 
      avatar: 'DL', 
      progress: 45, 
      sessions: 4, 
      lastSession: '3 days ago',
      status: 'needs-attention',
      nextSession: 'Today, 2:00 PM'
    },
    { 
      id: 4, 
      name: 'Michael T.', 
      avatar: 'MT', 
      progress: 91, 
      sessions: 15, 
      lastSession: '1 day ago',
      status: 'excellent',
      nextSession: 'Today, 3:30 PM'
    }
  ];

  const getProgressColor = (progress) => {
    if (progress >= 80) return dashboardTheme.colors.success;
    if (progress >= 60) return dashboardTheme.colors.chart.teal;
    if (progress >= 40) return dashboardTheme.colors.warning;
    return dashboardTheme.colors.error;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return dashboardTheme.colors.success;
      case 'good': return dashboardTheme.colors.chart.teal;
      case 'needs-attention': return dashboardTheme.colors.warning;
      default: return dashboardTheme.colors.text.secondary;
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: dashboardTheme.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: dashboardTheme.colors.text.primary, mb: 1 }}>
            Clinical Relationship Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! You have 5 sessions scheduled today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<CalendarIcon />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            View Calendar
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ 
              background: roleColors.therapist.gradient,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            New Session
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Clients"
            value="24"
            change="+3 this month"
            changeType="increase"
            icon={PeopleIcon}
            color={dashboardTheme.colors.chart.purple}
            subtitle="18 couples, 6 individuals"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Sessions Today"
            value="5"
            change="2 completed"
            changeType="stable"
            icon={EventNoteIcon}
            color={dashboardTheme.colors.chart.teal}
            subtitle="3 remaining"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Pending Notes"
            value="3"
            change="Due today"
            changeType="warning"
            icon={AssignmentIcon}
            color={dashboardTheme.colors.warning}
            subtitle="Complete by EOD"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg. Progress"
            value="78%"
            change="+5% this month"
            changeType="increase"
            icon={TrendingUpIcon}
            color={dashboardTheme.colors.success}
            subtitle="Across all clients"
          />
        </Grid>
      </Grid>

      {/* Client Progress & Emotional Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <DashboardCard title="Client Progress Tracking" subtitle="6-week therapeutic journey">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clientProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke={dashboardTheme.colors.text.secondary} />
                <YAxis stroke={dashboardTheme.colors.text.secondary} />
                <ChartTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="emotional" 
                  stroke={dashboardTheme.colors.chart.purple} 
                  strokeWidth={2}
                  name="Emotional Health"
                  dot={{ fill: dashboardTheme.colors.chart.purple, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="communication" 
                  stroke={dashboardTheme.colors.chart.teal} 
                  strokeWidth={2}
                  name="Communication"
                  dot={{ fill: dashboardTheme.colors.chart.teal, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conflict" 
                  stroke={dashboardTheme.colors.chart.orange} 
                  strokeWidth={2}
                  name="Conflict Resolution"
                  dot={{ fill: dashboardTheme.colors.chart.orange, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={4}>
          <DashboardCard title="Emotional Assessment" subtitle="Current client metrics">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={emotionalMetrics}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: dashboardTheme.colors.text.secondary, fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: dashboardTheme.colors.text.secondary }} />
                <Radar 
                  name="Score" 
                  dataKey="value" 
                  stroke={dashboardTheme.colors.chart.purple} 
                  fill={dashboardTheme.colors.chart.purple} 
                  fillOpacity={0.6} 
                />
                <ChartTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Today's Schedule & Active Clients */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <DashboardCard title="Today's Schedule" subtitle="5 sessions planned">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {upcomingSessions.map((session) => (
                    <TableRow key={session.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {session.time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {session.priority === 'high' && (
                            <StarIcon sx={{ fontSize: 16, color: dashboardTheme.colors.warning }} />
                          )}
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {session.client}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {session.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={session.status === 'confirmed' ? 'success' : 'warning'} 
                          label={session.status}
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} lg={5}>
          <DashboardCard title="Active Client Portfolio" subtitle="Recent activity">
            <List sx={{ width: '100%' }}>
              {activeClients.map((client, index) => (
                <ListItem
                  key={client.id}
                  sx={{
                    borderRadius: dashboardTheme.borderRadius.md,
                    mb: 1,
                    backgroundColor: index % 2 === 0 ? '#fafafa' : 'transparent',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  secondaryAction={
                    <IconButton edge="end">
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        backgroundColor: getStatusColor(client.status),
                        fontWeight: 600
                      }}
                    >
                      {client.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {client.name}
                        </Typography>
                        <Chip 
                          label={`${client.progress}%`} 
                          size="small"
                          sx={{ 
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: `${getProgressColor(client.progress)}20`,
                            color: getProgressColor(client.progress)
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {client.sessions} sessions • Last: {client.lastSession}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: roleColors.therapist.primary }}>
                          Next: {client.nextSession}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={client.progress} 
                          sx={{ 
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(client.progress),
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2, textTransform: 'none' }}
            >
              View All Clients
            </Button>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TherapistDashboard;
