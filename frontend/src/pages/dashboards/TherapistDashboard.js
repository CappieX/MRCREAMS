import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button
} from '@mui/material';
import { 
  Event as EventIcon, 
  Person as PersonIcon, 
  CheckCircle as CheckCircleIcon,
  WatchLater as WatchLaterIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

// Sample data for the dashboard
const upcomingSessions = [
  { id: 1, client: 'John Doe', time: 'Today, 2:00 PM', status: 'confirmed' },
  { id: 2, client: 'Jane Smith', time: 'Tomorrow, 10:00 AM', status: 'confirmed' },
  { id: 3, client: 'Alex Johnson', time: 'Tomorrow, 3:30 PM', status: 'pending' },
];

const recentClients = [
  { id: 1, name: 'John Doe', lastSession: '2 days ago', progress: 65, avatar: 'JD' },
  { id: 2, name: 'Jane Smith', lastSession: '1 week ago', progress: 42, avatar: 'JS' },
  { id: 3, name: 'Mike Wilson', lastSession: '2 weeks ago', progress: 88, avatar: 'MW' },
  { id: 4, name: 'Sarah Johnson', lastSession: '3 weeks ago', progress: 30, avatar: 'SJ' },
];

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

export default function TherapistDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [activeClients] = useState(15);
  const [pendingApprovals] = useState(3);
  const [upcomingSessionsCount] = useState(upcomingSessions.length);
  const [clientSatisfaction] = useState(94);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Therapist Dashboard</Typography>
        <Button variant="contained" color="primary" startIcon={<CalendarTodayIcon />}>
          Schedule Session
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Active Clients</Typography>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{activeClients}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Upcoming Sessions</Typography>
              <Box display="flex" alignItems="center">
                <EventIcon color="secondary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{upcomingSessionsCount}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Pending Approvals</Typography>
              <Box display="flex" alignItems="center">
                <WatchLaterIcon color="warning" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{pendingApprovals}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Client Satisfaction</Typography>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{clientSatisfaction}%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Card elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="therapist dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Upcoming Sessions" />
            <Tab label="Client List" />
            <Tab label="Appointment History" />
            <Tab label="Notes & Reports" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Session Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingSessions.map((session) => (
                  <TableRow key={session.id} hover>
                    <TableCell>{session.client}</TableCell>
                    <TableCell>{session.time}</TableCell>
                    <TableCell>
                      <Chip 
                        label={session.status === 'confirmed' ? 'Confirmed' : 'Pending'} 
                        color={session.status === 'confirmed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="small" color="primary">View</Button>
                      <Button size="small" color="secondary">Reschedule</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {recentClients.map((client) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={client.id}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #eee' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                      {client.avatar}
                    </Avatar>
                    <Typography variant="h6">{client.name}</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Last session: {client.lastSession}
                    </Typography>
                    <Box mt={2} mb={1}>
                      <Typography variant="body2" color="textSecondary">Progress</Typography>
                      <Box width="100%" height={8} bgcolor="#e0e0e0" borderRadius={4} overflow="hidden" mt={1}>
                        <Box 
                          width={`${client.progress}%`} 
                          height="100%" 
                          bgcolor="primary.main" 
                        />
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {client.progress}% complete
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="primary" 
                      fullWidth 
                      sx={{ mt: 2 }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">Appointment History</Typography>
            <Typography variant="body2" color="textSecondary">
              Your past appointments will appear here
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">Session Notes & Reports</Typography>
            <Typography variant="body2" color="textSecondary">
              Your session notes and reports will appear here
            </Typography>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
}
