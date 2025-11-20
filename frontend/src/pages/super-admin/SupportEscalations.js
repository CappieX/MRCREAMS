import React from 'react';
import { Box, Typography, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import { Visibility as ViewIcon, CheckCircle as ResolveIcon } from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import { dashboardTheme } from '../../constants/dashboardTheme';

const SupportEscalations = () => {
  const tickets = [
    { id: 1, title: 'Payment processing error', user: 'john@example.com', priority: 'high', status: 'open', created: '2 hours ago' },
    { id: 2, title: 'Session recording issue', user: 'sarah@example.com', priority: 'medium', status: 'in-progress', created: '5 hours ago' },
    { id: 3, title: 'Login authentication failure', user: 'mike@example.com', priority: 'critical', status: 'escalated', created: '1 hour ago' },
    { id: 4, title: 'Data export request', user: 'emily@example.com', priority: 'low', status: 'pending', created: '1 day ago' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Support & Escalations
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Open Tickets" value="12" change="+3 today" changeType="warning" color={dashboardTheme.colors.warning} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Escalated" value="3" change="Critical" changeType="warning" color={dashboardTheme.colors.error} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Avg Response Time" value="2.3h" change="-0.5h" changeType="increase" color={dashboardTheme.colors.success} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Resolution Rate" value="94%" change="+2%" changeType="increase" color={dashboardTheme.colors.chart.teal} />
        </Grid>
      </Grid>

      <DashboardCard title="Active Support Tickets" subtitle="Manage escalations and urgent issues">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Ticket ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      #{ticket.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ticket.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ticket.user}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={ticket.priority} size="small" color={getPriorityColor(ticket.priority)} />
                  </TableCell>
                  <TableCell>
                    <Chip label={ticket.status} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ticket.created}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Resolve">
                        <IconButton size="small" color="success">
                          <ResolveIcon fontSize="small" />
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

export default SupportEscalations;
