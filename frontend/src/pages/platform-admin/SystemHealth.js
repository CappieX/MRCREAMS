import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Grid,
  Switch,
  FormControlLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, AreaChart, Area } from 'recharts';
import { apiRequest } from '../../utils/apiService';

const SystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoPoll, setAutoPoll] = useState(true);
  const [latency, setLatency] = useState([]);
  const [errorRate, setErrorRate] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(() => {
      if (autoPoll) fetchHealth();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoPoll]);

  const fetchHealth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const data = await apiRequest('/platform/health', 'GET', null, token);
      setHealth(data);
      setLatency([10, 12, 15, 11, 9, 13, 14, 16, 12, 11].map((v, i) => ({ t: i, v })));
      setErrorRate([0.2, 0.4, 0.3, 0.8, 0.5, 0.6, 0.3, 0.2].map((v, i) => ({ t: i, v })));
      setServices([
        { name: 'API', status: 'healthy', uptime: '99.9%', load: 0.45, latency: 12 },
        { name: 'Auth', status: 'healthy', uptime: '99.8%', load: 0.30, latency: 10 },
        { name: 'DB', status: 'degraded', uptime: '99.4%', load: 0.70, latency: 18 },
        { name: 'Jobs', status: 'healthy', uptime: '99.7%', load: 0.40, latency: 11 }
      ]);
    } catch (error) {
      console.error('Failed to fetch health:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Health Monitor
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControlLabel control={<Switch checked={autoPoll} onChange={(e) => setAutoPoll(e.target.checked)} />} label="Auto-poll" />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Latency (ms)
            </Typography>
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latency}>
                  <XAxis dataKey="t" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="v" stroke="#1976D2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Error Rate (%)
            </Typography>
            <Box sx={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={errorRate}>
                  <XAxis dataKey="t" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ChartTooltip />
                  <Area type="monotone" dataKey="v" stroke="#E53935" fill="#E5393511" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Service Status
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Uptime</TableCell>
                    <TableCell>Load</TableCell>
                    <TableCell>Latency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((s, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{s.name}</TableCell>
                      <TableCell><Chip label={s.status} color={s.status === 'healthy' ? 'success' : 'warning'} size="small" /></TableCell>
                      <TableCell>{s.uptime}</TableCell>
                      <TableCell>{Math.round(s.load * 100)}%</TableCell>
                      <TableCell>{s.latency}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Background Jobs
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Schedulers" secondary="Jobs running: 7" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Queue" secondary="Queued: 21" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Environment
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Platform" secondary={health?.system?.platform} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Node Version" secondary={health?.system?.nodeVersion} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Server Time" secondary={health?.timestamp} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemHealth;
