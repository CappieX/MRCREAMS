import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsHub = () => {
  const [trend, setTrend] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [retention, setRetention] = useState([]);
  const [geo, setGeo] = useState([]);
  const [peaks, setPeaks] = useState([]);
  const token = localStorage.getItem('authToken');

  const parseArray = async (res) => {
    try {
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
    } catch {
      return [];
    }
  };

  const load = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const a = await fetch('/api/platform/analytics/conflicts-trend', { headers });
      setTrend(await parseArray(a));
    } catch { setTrend([]); }
    try {
      const b = await fetch('/api/platform/analytics/emotions-heatmap', { headers });
      setHeatmap(await parseArray(b));
    } catch { setHeatmap([]); }
    try {
      const c = await fetch('/api/platform/analytics/user-retention', { headers });
      setRetention(await parseArray(c));
    } catch { setRetention([]); }
    try {
      const d = await fetch('/api/platform/analytics/geographic', { headers });
      setGeo(await parseArray(d));
    } catch { setGeo([]); }
    try {
      const e = await fetch('/api/platform/analytics/usage-peaks', { headers });
      setPeaks(await parseArray(e));
    } catch { setPeaks([]); }
  };

  useEffect(() => { load(); }, []);

  const exportCSV = async () => {
    try {
      const res = await fetch('/api/platform/analytics/export', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'analytics.csv'; a.click(); URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Analytics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2, height:300 }}>
            <Typography variant="subtitle1">Conflict Trend</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={trend.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2, height:300 }}>
            <Typography variant="subtitle1">Usage Peaks</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={peaks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#9c27b0" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1">Emotion Categories</Typography>
            {heatmap.map(h => (
              <Box key={h.category} sx={{ display:'flex', justifyContent:'space-between' }}>
                <Typography>{h.category || 'Unknown'}</Typography>
                <Typography>{h.value}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p:2 }}>
            <Typography variant="subtitle1">Geographic</Typography>
            {geo.map(g => (
              <Box key={g.country} sx={{ display:'flex', justifyContent:'space-between' }}>
                <Typography>{g.country}</Typography>
                <Typography>{g.users}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt:2, display:'flex', justifyContent:'flex-end' }}>
        <Button variant="outlined" onClick={exportCSV}>Export CSV</Button>
      </Box>
    </Box>
  );
};

export default AnalyticsHub;
