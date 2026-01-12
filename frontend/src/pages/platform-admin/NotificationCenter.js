import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Button, List, ListItem, ListItemText } from '@mui/material';

const NotificationCenter = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [segment, setSegment] = useState('all');
  const [schedule, setSchedule] = useState('');

  const token = localStorage.getItem('authToken');

  const load = async () => {
    try {
      const res = await fetch('/api/platform/notifications', { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.ok ? await res.json() : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []);

  const broadcast = async () => {
    try {
      const res = await fetch('/api/platform/broadcast', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ message, severity, target: segment }) });
      if (!res.ok) return;
      setMessage('');
      load();
    } catch {}
  };

  const createNotification = async () => {
    try {
      const res = await fetch('/api/platform/notifications', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title, message, severity, segment }) });
      if (!res.ok) return;
      setTitle(''); setMessage('');
      load();
    } catch {}
  };

  const scheduleAnnouncement = async () => {
    try {
      const res = await fetch('/api/platform/notifications/schedule', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title, message, severity, scheduledFor: schedule }) });
      if (!res.ok) return;
      setSchedule('');
      load();
    } catch {}
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Notification Center</Typography>
      <Paper sx={{ p:2, mb:2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><TextField fullWidth label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Message" value={message} onChange={(e)=>setMessage(e.target.value)} /></Grid>
          <Grid item xs={12} md={2}><TextField select fullWidth label="Severity" value={severity} onChange={(e)=>setSeverity(e.target.value)}>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={2}><TextField select fullWidth label="Segment" value={segment} onChange={(e)=>setSegment(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="therapists">Therapists</MenuItem>
            <MenuItem value="users">Users</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={1}><Button fullWidth variant="contained" onClick={createNotification}>Notify</Button></Grid>
          <Grid item xs={12} md={2}><Button fullWidth variant="outlined" onClick={broadcast}>Broadcast</Button></Grid>
          <Grid item xs={12} md={3}><TextField fullWidth label="Schedule ISO" value={schedule} onChange={(e)=>setSchedule(e.target.value)} /></Grid>
          <Grid item xs={12} md={2}><Button fullWidth variant="outlined" onClick={scheduleAnnouncement}>Schedule</Button></Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p:2 }}>
        <Typography variant="h6">Recent</Typography>
        <List>
          {items.map(n => (
            <ListItem key={n.id}>
              <ListItemText primary={`${n.title} (${n.severity})`} secondary={`${n.message} • ${new Date(n.createdAt).toLocaleString()}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default NotificationCenter;
