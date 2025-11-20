import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, IconButton, Tooltip, Badge, LinearProgress, List, ListItem, ListItemText
} from '@mui/material';
import {
  ConfirmationNumber as TicketIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as ClockIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assignment as AssignIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import { dashboardTheme } from '../../constants/dashboardTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SupportHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    open_count: 0,
    unassigned_count: 0,
    overdue_count: 0,
    avg_satisfaction: 0
  });
  const [tickets, setTickets] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, ticketsRes] = await Promise.all([
        axios.get('/api/v1/support/analytics/overview'),
        axios.get('/api/v1/support/tickets?limit=10&sort_by=created_at&sort_order=DESC')
      ]);

      setStats(analyticsRes.data.stats);
      setTickets(ticketsRes.data.tickets);
      setRecentActivity(analyticsRes.data.recent_activity || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: dashboardTheme.colors.chart.blue,
      in_progress: dashboardTheme.colors.warning,
      resolved: dashboardTheme.colors.success,
      closed: dashboardTheme.colors.text.secondary,
      escalated: dashboardTheme.colors.error
    };
    return colors[status] || dashboardTheme.colors.text.secondary;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: dashboardTheme.colors.success,
      medium: dashboardTheme.colors.warning,
      high: dashboardTheme.colors.error,
      critical: '#DC2626'
    };
    return colors[priority] || dashboardTheme.colors.text.secondary;
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'critical' || priority === 'high') {
      return '🔴';
    } else if (priority === 'medium') {
      return '🟡';
    }
    return '🟢';
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: '🆕',
      in_progress: '⏳',
      resolved: '✅',
      closed: '🔒',
      escalated: '🚨'
    };
    return icons[status] || '📋';
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/dashboard/support/tickets/${ticketId}`);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'mine') return ticket.assigned_agent_id; // Would check against current user
    if (filter === 'unassigned') return !ticket.assigned_agent_id;
    if (filter === 'high-priority') return ['high', 'critical'].includes(ticket.priority);
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Support Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time ticket monitoring and management
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Open Tickets"
            value={stats.open_count || 0}
            change={`${stats.in_progress_count || 0} in progress`}
            changeType="info"
            icon={TicketIcon}
            color={dashboardTheme.colors.chart.blue}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Unassigned"
            value={stats.unassigned_count || 0}
            change="Need assignment"
            changeType="warning"
            icon={AssignIcon}
            color={dashboardTheme.colors.warning}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Overdue"
            value={stats.overdue_count || 0}
            change="Past SLA"
            changeType={stats.overdue_count > 0 ? 'decrease' : 'stable'}
            icon={ClockIcon}
            color={dashboardTheme.colors.error}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="CSAT Score"
            value={stats.avg_satisfaction ? `${stats.avg_satisfaction.toFixed(1)}/5` : 'N/A'}
            change="Customer satisfaction"
            changeType="increase"
            icon={StarIcon}
            color={dashboardTheme.colors.success}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Ticket Queue */}
        <Grid item xs={12} lg={8}>
          <DashboardCard 
            title="Ticket Queue" 
            subtitle="Recent support requests"
            action={
              <Button 
                size="small" 
                onClick={() => navigate('/dashboard/support/tickets')}
              >
                View All
              </Button>
            }
          >
            {/* Filter Buttons */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['all', 'mine', 'unassigned', 'high-priority'].map((f) => (
                <Chip
                  key={f}
                  label={f.replace('-', ' ').toUpperCase()}
                  onClick={() => setFilter(f)}
                  color={filter === f ? 'primary' : 'default'}
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </Box>

            {loading ? (
              <LinearProgress />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket ID</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Assignee</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        hover
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: dashboardTheme.colors.background }
                        }}
                        onClick={() => handleTicketClick(ticket.id)}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                            {ticket.ticket_number}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                            {ticket.title}
                          </Typography>
                          {ticket.category_name && (
                            <Chip 
                              label={ticket.category_name} 
                              size="small" 
                              sx={{ 
                                height: 18, 
                                fontSize: '10px',
                                mt: 0.5,
                                backgroundColor: `${ticket.category_color}20`,
                                color: ticket.category_color
                              }} 
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <span>{getStatusIcon(ticket.status)}</span>
                                <span>{ticket.status.replace('_', ' ')}</span>
                              </Box>
                            }
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(ticket.status)}20`,
                              color: getStatusColor(ticket.status),
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <span>{getPriorityIcon(ticket.priority)}</span>
                                <span>{ticket.priority}</span>
                              </Box>
                            }
                            size="small"
                            sx={{
                              backgroundColor: `${getPriorityColor(ticket.priority)}20`,
                              color: getPriorityColor(ticket.priority),
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {ticket.agent_name ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                                {ticket.agent_name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2">
                                {ticket.agent_name}
                              </Typography>
                            </Box>
                          ) : (
                            <Chip label="Unassigned" size="small" color="warning" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatTimeAgo(ticket.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={(e) => {
                              e.stopPropagation();
                              handleTicketClick(ticket.id);
                            }}>
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {filteredTickets.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No tickets found
                </Typography>
              </Box>
            )}
          </DashboardCard>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Real-time Activity Feed */}
          <DashboardCard 
            title="Recent Activity" 
            subtitle="Live updates"
            sx={{ mb: 3 }}
          >
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {recentActivity.map((activity, index) => (
                <ListItem
                  key={activity.id || index}
                  sx={{
                    mb: 1,
                    backgroundColor: dashboardTheme.colors.background,
                    borderRadius: 1,
                    borderLeft: `3px solid ${dashboardTheme.colors.chart.blue}`
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        <strong>{activity.user_name}</strong> {activity.content}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={activity.ticket_number} 
                          size="small" 
                          sx={{ height: 18, fontSize: '10px' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeAgo(activity.created_at)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {recentActivity.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent activity
                  </Typography>
                </Box>
              )}
            </List>
          </DashboardCard>

          {/* Quick Actions */}
          <DashboardCard title="Quick Actions">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<TicketIcon />}
                onClick={() => navigate('/dashboard/support/tickets/new')}
                sx={{ textTransform: 'none' }}
              >
                Create New Ticket
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssignIcon />}
                onClick={() => setFilter('unassigned')}
                sx={{ textTransform: 'none' }}
              >
                View Unassigned ({stats.unassigned_count || 0})
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WarningIcon />}
                onClick={() => setFilter('high-priority')}
                sx={{ textTransform: 'none' }}
              >
                High Priority Tickets
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupportHome;
