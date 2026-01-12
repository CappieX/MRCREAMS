import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent } from '@mui/material';

const ConflictsAdmin = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('all');
  const [intensity, setIntensity] = useState('all');
  const [duration, setDuration] = useState('all');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchList = async () => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`/api/platform/conflicts?status=${status}&intensity=${intensity}&duration=${duration}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  const fetchDetail = async (id) => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`/api/platform/conflicts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setDetail(data);
  };

  useEffect(() => { fetchList(); }, [status, intensity, duration]);

  const escalate = async (id) => {
    const token = localStorage.getItem('authToken');
    await fetch(`/api/platform/conflicts/${id}/escalate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ reason: 'High intensity' }) });
  };

  const exportData = async () => {
    const token = localStorage.getItem('authToken');
    const res = await fetch('/api/platform/conflicts/export', { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'conflicts.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Conflicts</Typography>
      <Paper sx={{ p:2, mb:2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><TextField select fullWidth label="Status" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={3}><TextField select fullWidth label="Intensity" value={intensity} onChange={(e)=>setIntensity(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="5">≥ 5</MenuItem>
            <MenuItem value="7">≥ 7</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={3}><TextField select fullWidth label="Duration" value={duration} onChange={(e)=>setDuration(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="30">≥ 30m</MenuItem>
            <MenuItem value="60">≥ 60m</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={3} sx={{ display:'flex', justifyContent:'flex-end' }}>
            <Button variant="outlined" onClick={exportData}>Export CSV</Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Intensity</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.user_id}</TableCell>
                <TableCell>{c.conflict_reason}</TableCell>
                <TableCell>{c.fight_degree}</TableCell>
                <TableCell>{c.time_consumption}</TableCell>
                <TableCell>{c.final_result}</TableCell>
                <TableCell>
                  <Button size="small" onClick={()=>{setSelected(c); fetchDetail(c.id);}}>View</Button>
                  <Button size="small" onClick={()=>escalate(c.id)}>Escalate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={!!selected} onClose={()=>{setSelected(null); setDetail(null);}} fullWidth maxWidth="md">
        <DialogTitle>Conflict Detail</DialogTitle>
        <DialogContent>
          {detail && (
            <Box>
              <Typography variant="subtitle1">{detail.conflict.conflict_reason}</Typography>
              <Typography variant="body2">User: {detail.conflict.user_name} ({detail.conflict.user_email})</Typography>
              <Typography variant="body2" sx={{ mt:1 }}>Timeline entries: {detail.timeline.length}</Typography>
              <Typography variant="body2" sx={{ mt:1 }}>Resolution score: {detail.resolutionProgress.score}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ConflictsAdmin;
