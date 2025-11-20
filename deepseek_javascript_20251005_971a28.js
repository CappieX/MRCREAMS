import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  LinearProgress
} from '@mui/material';
import { Delete, TrendingUp, Schedule, Warning, List, Download } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const [conflicts, setConflicts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [conflictsRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/conflicts`),
        axios.get(`${API_BASE_URL}/analytics`)
      ]);
      setConflicts(conflictsRes.data);
      setAnalytics(analyticsRes.data);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conflict record?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/conflicts/${id}`);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting conflict:', error);
      setError('Failed to delete conflict record.');
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conflicts/export`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `conflicts-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data.');
    }
  };

  const getIntensityColor = (degree) => {
    if (degree >= 8) return 'error';
    if (degree >= 5) return 'warning';
    return 'success';
  };

  const getIntensityLabel = (degree) => {
    if (degree >= 8) return 'High';
    if (degree >= 5) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Conflict Dashboard</Typography>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Conflict Dashboard</Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Conflict Dashboard</Typography>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>
          Export to CSV
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <List sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Conflicts</Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {analytics.totalConflicts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All time records
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Schedule sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">Avg Duration</Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                {analytics.avgDuration}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per conflict
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Avg Intensity</Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                {analytics.avgFightDegree}/10
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average level
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Peak Intensity</Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                {analytics.maxFightDegree}/10
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Highest recorded
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Conflicts Table */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Conflicts
        </Typography>
        
        {conflicts.length === 0 ? (
          <Alert severity="info">
            No conflicts recorded yet. Use the "Add Conflict" tab to log your first conflict.
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Reason</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Intensity</strong></TableCell>
                  <TableCell><strong>Resolution</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conflicts.slice(0, 8).map((conflict) => (
                  <TableRow 
                    key={conflict.id}
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {new Date(conflict.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {conflict.time}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {conflict.conflict_reason}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${conflict.time_consumption}m`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getIntensityLabel(conflict.fight_degree)}
                        color={getIntensityColor(conflict.fight_degree)}
                        size="small"
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {conflict.fight_degree}/10
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {conflict.final_result || 'No resolution recorded'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(conflict.id)}
                        size="small"
                        title="Delete conflict"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Quick Stats */}
      {analytics.conflictsByReason.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Top Conflict Reasons
          </Typography>
          <Grid container spacing={2}>
            {analytics.conflictsByReason.slice(0, 4).map((reason, index) => (
              <Grid item xs={12} sm={6} md={3} key={reason.conflict_reason}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      #{index + 1}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {reason.conflict_reason}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reason.count} occurrence{reason.count !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}