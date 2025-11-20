import React, { useState } from 'react';
import {
  Box, Typography, Grid, TextField, InputAdornment, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import { dashboardTheme } from '../../constants/dashboardTheme';

const SessionsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sessions = [
    { id: 1, client: 'Sarah & John M.', therapist: 'Dr. Smith', date: '2024-01-18', duration: '60 min', type: 'Couples', status: 'completed' },
    { id: 2, client: 'Emily R.', therapist: 'Dr. Johnson', date: '2024-01-18', duration: '45 min', type: 'Individual', status: 'completed' },
    { id: 3, client: 'David & Lisa K.', therapist: 'Dr. Smith', date: '2024-01-18', duration: '90 min', type: 'Conflict', status: 'in-progress' },
    { id: 4, client: 'Michael T.', therapist: 'Dr. Chen', date: '2024-01-18', duration: '50 min', type: 'Follow-up', status: 'scheduled' },
    { id: 5, client: 'Anna & Tom W.', therapist: 'Dr. Wilson', date: '2024-01-18', duration: '60 min', type: 'Progress', status: 'completed' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'scheduled': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Sessions & Conversations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Sessions"
            value="1,248"
            change="+45 today"
            changeType="increase"
            color={dashboardTheme.colors.chart.blue}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Now"
            value="23"
            change="Live"
            changeType="stable"
            color={dashboardTheme.colors.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Avg Duration"
            value="58 min"
            change="+3 min"
            changeType="increase"
            color={dashboardTheme.colors.chart.purple}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completion Rate"
            value="94%"
            change="+2%"
            changeType="increase"
            color={dashboardTheme.colors.chart.teal}
          />
        </Grid>
      </Grid>

      <DashboardCard title="Recent Sessions" subtitle="Monitor and manage all therapy sessions">
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search sessions by client, therapist, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Therapist</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {session.client}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{session.therapist}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{session.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{session.duration}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={session.type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={session.status} 
                      size="small"
                      color={getStatusColor(session.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export">
                        <IconButton size="small">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </Box>
  );
};

export default SessionsManagement;
