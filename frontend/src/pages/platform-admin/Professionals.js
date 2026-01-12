import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const Professionals = () => {
  const [queue, setQueue] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [availability, setAvailability] = useState([]);

  const token = localStorage.getItem('authToken');

  const loadQueue = async () => {
    try {
      const res = await fetch('/api/platform/professionals/verification-queue', { headers: { Authorization: `Bearer ${token}` } });
      setQueue(res.ok ? await res.json() : []);
    } catch {
      setQueue([]);
    }
  };

  const loadMetrics = async () => {
    try {
      const res = await fetch('/api/platform/professionals/metrics', { headers: { Authorization: `Bearer ${token}` } });
      setMetrics(res.ok ? await res.json() : null);
    } catch {
      setMetrics(null);
    }
  };

  const loadAvailability = async () => {
    try {
      const res = await fetch('/api/platform/professionals/availability', { headers: { Authorization: `Bearer ${token}` } });
      setAvailability(res.ok ? await res.json() : []);
    } catch {
      setAvailability([]);
    }
  };

  useEffect(() => { loadQueue(); loadMetrics(); loadAvailability(); }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Professionals</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography variant="h6">Performance</Typography>
            {metrics && (
              <Box sx={{ mt:1 }}>
                <Typography variant="body2">Total: {metrics.totalTherapists}</Typography>
                <Typography variant="body2">Active: {metrics.activeTherapists}</Typography>
                <Typography variant="body2">Avg Sessions: {metrics.averageSessionsPerTherapist}</Typography>
                <Typography variant="body2">Client Satisfaction: {metrics.clientSatisfaction}</Typography>
              </Box>
            )}
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6">Verification Queue</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>License</TableCell>
                  <TableCell>Reviewed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map(q => (
                  <TableRow key={q.user_id}>
                    <TableCell>{q.name}</TableCell>
                    <TableCell>{q.email}</TableCell>
                    <TableCell>{q.status}</TableCell>
                    <TableCell>{q.license_number} {q.license_state}</TableCell>
                    <TableCell>{q.reviewed_at ? new Date(q.reviewed_at).toLocaleDateString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p:2 }}>
            <Typography variant="h6">Availability</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Therapist</TableCell>
                  <TableCell>Scheduled At</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availability.map(a => (
                  <TableRow key={`${a.therapist_id}-${a.scheduled_at}`}>
                    <TableCell>{a.therapist_name}</TableCell>
                    <TableCell>{new Date(a.scheduled_at).toLocaleString()}</TableCell>
                    <TableCell>{a.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Professionals;
