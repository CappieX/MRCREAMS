import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import {
  Security as SecurityIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  BugReport as BugReportIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import axios from 'axios';

// Create an axios instance with base URL and auth header interceptor
// Ideally this should be imported from a central api config file, but defining here for now to ensure it works
const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch system stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);

      // Fetch users
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      // Fetch security alerts
      const alertsRes = await api.get('/security/alerts?limit=10');
      setAlerts(alertsRes.data.data?.alerts || []); // Handle nested data structure
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        // Refresh users list
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  // Prepare Chart Data
  const genderData = stats ? [
    { name: 'Male', value: stats.users.male },
    { name: 'Female', value: stats.users.female },
  ] : [];

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

  // Mock data for charts where we don't have real endpoints yet
  const activityData = [
    { name: 'Mon', users: 400, conflicts: 240 },
    { name: 'Tue', users: 300, conflicts: 139 },
    { name: 'Wed', users: 200, conflicts: 980 },
    { name: 'Thu', users: 278, conflicts: 390 },
    { name: 'Fri', users: 189, conflicts: 480 },
    { name: 'Sat', users: 239, conflicts: 380 },
    { name: 'Sun', users: 349, conflicts: 430 },
  ];

  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Super Admin Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={fetchData}
        >
          Refresh Data
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<PeopleIcon />} label="User Management" />
          <Tab icon={<SecurityIcon />} label="Security & Alerts" />
        </Tabs>
      </Paper>

      {/* OVERVIEW TAB */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Stat Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PeopleIcon color="primary" fontSize="large" />
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">Total Users</Typography>
                    <Typography variant="h4">{stats?.users?.total || 0}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUpIcon color="secondary" fontSize="large" />
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">Total Conflicts</Typography>
                    <Typography variant="h4">{stats?.conflicts?.total || 0}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <WarningIcon color="error" fontSize="large" />
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">Active Alerts</Typography>
                    <Typography variant="h4">{alerts.filter(a => !a.resolved).length}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircleIcon color="success" fontSize="large" />
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">System Health</Typography>
                    <Typography variant="h4">98%</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 340 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                System Activity (Mock)
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="conflicts" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 340 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                User Demographics
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* USER MANAGEMENT TAB */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.gender || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.is_admin ? "Admin" : "User"} 
                        color={user.is_admin ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.is_admin} // Prevent deleting admins
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      {/* SECURITY TAB */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <Box p={2}>
                <Typography variant="h6">Recent Security Alerts</Typography>
              </Box>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Severity</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow hover key={alert.id}>
                        <TableCell>
                          <Chip 
                            label={alert.severity} 
                            color={alert.severity === 'high' || alert.severity === 'critical' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{alert.title}</TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>{alert.userName || alert.userEmail || 'System'}</TableCell>
                        <TableCell>{alert.ipAddress}</TableCell>
                        <TableCell>
                          <Chip 
                            label={alert.resolved ? 'Resolved' : alert.acknowledged ? 'Acknowledged' : 'New'} 
                            color={alert.resolved ? 'success' : 'default'}
                            variant={alert.resolved ? 'filled' : 'outlined'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {alerts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Box py={3} display="flex" flexDirection="column" alignItems="center">
                            <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                            <Typography>No active security alerts</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
}
