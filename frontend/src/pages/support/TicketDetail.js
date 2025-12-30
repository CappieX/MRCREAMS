import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, TextField, Button,
  Avatar, Chip, IconButton, Divider, MenuItem, Select, FormControl,
  InputLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Alert
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { dashboardTheme } from '../../constants/dashboardTheme';
import axios from 'axios';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);
  
  const fetchTicket = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.get(`/api/v1/support/tickets/${id}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'API-Version': 'v1'
        },
        withCredentials: true
      });
      setTicket(response.data);
    } catch (err) {
      setError('Failed to load ticket');
      console.error('Error fetching ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.post(`/api/v1/support/tickets/${id}/comments`, {
        content: comment,
        is_internal: false
      }, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'API-Version': 'v1'
        },
        withCredentials: true
      });
      setComment('');
      await fetchTicket(); // Refresh ticket data
    } catch (err) {
      setError('Failed to submit comment');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.put(`/api/v1/support/tickets/${id}`, { status: newStatus }, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'API-Version': 'v1'
        },
        withCredentials: true
      });
      await fetchTicket();
    } catch (err) {
      setError('Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await axios.put(`/api/v1/support/tickets/${id}`, { priority: newPriority }, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'API-Version': 'v1'
        },
        withCredentials: true
      });
      await fetchTicket();
    } catch (err) {
      setError('Failed to update priority');
      console.error('Error updating priority:', err);
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSLA = () => {
    if (!ticket) return null;
    const slaMinutes = {
      critical: 60,
      high: 240,
      medium: 1440,
      low: 4320
    };
    const targetMinutes = slaMinutes[ticket.priority];
    const elapsed = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
    const remaining = targetMinutes - elapsed;
    const percentage = Math.max(0, (remaining / targetMinutes) * 100);
    
    return {
      remaining: remaining > 0 ? remaining : 0,
      percentage,
      overdue: remaining < 0
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Ticket not found
        </Typography>
        <Button onClick={() => navigate('/dashboard/support/tickets')} sx={{ mt: 2 }}>
          Back to Tickets
        </Button>
      </Box>
    );
  }

  const sla = calculateSLA();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {ticket.ticket_number}: {ticket.title}
            </Typography>
            <Chip
              label={ticket.status.replace('_', ' ')}
              size="small"
              sx={{
                backgroundColor: `${getStatusColor(ticket.status)}20`,
                color: getStatusColor(ticket.status),
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            />
            <Chip
              label={ticket.priority}
              size="small"
              sx={{
                backgroundColor: `${getPriorityColor(ticket.priority)}20`,
                color: getPriorityColor(ticket.priority),
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Created {formatTimestamp(ticket.created_at)}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard/support/tickets')}
        >
          Back to Tickets
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Conversation Thread */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Conversation Thread
              </Typography>

              {/* Original Ticket Description */}
              <Box sx={{ mb: 3, p: 2, backgroundColor: dashboardTheme.colors.background, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ backgroundColor: dashboardTheme.colors.chart.purple }}>
                    {ticket.requester_name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {ticket.requester_name || 'Customer'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(ticket.created_at)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1">
                  {ticket.description || 'No description provided'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Activity Thread */}
              <List>
                {ticket.activities?.filter(a => a.activity_type === 'comment').map((activity) => (
                  <ListItem
                    key={activity.id}
                    alignItems="flex-start"
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: activity.is_internal 
                        ? `${dashboardTheme.colors.warning}10` 
                        : dashboardTheme.colors.background,
                      borderRadius: 2,
                      borderLeft: activity.is_internal 
                        ? `3px solid ${dashboardTheme.colors.warning}` 
                        : 'none'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: dashboardTheme.colors.chart.blue }}>
                        {activity.user_name?.charAt(0) || 'A'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {activity.user_name || 'Support Agent'}
                          </Typography>
                          {activity.is_internal && (
                            <Chip label="Internal Note" size="small" color="warning" sx={{ height: 18, fontSize: '10px' }} />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(activity.created_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {activity.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {/* Reply Form */}
              <Box component="form" onSubmit={handleSubmitComment} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type your reply..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <AttachIcon />
                    </IconButton>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={16} /> : <SendIcon />}
                    disabled={submitting || !comment.trim()}
                  >
                    Send Reply
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Ticket Details */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ticket Details
              </Typography>

              {/* Status */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Status
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                    <MenuItem value="escalated">Escalated</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Priority */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Priority
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Assignee */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Assigned To
                </Typography>
                {ticket.agent_name ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {ticket.agent_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {ticket.agent_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.agent_email}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Chip label="Unassigned" size="small" color="warning" />
                )}
              </Box>

              {/* Requester */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Requester
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {ticket.requester_name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ticket.requester_name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.requester_email}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Category */}
              {ticket.category_name && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Category
                  </Typography>
                  <Chip
                    label={ticket.category_name}
                    size="small"
                    sx={{
                      backgroundColor: `${ticket.category_color}20`,
                      color: ticket.category_color
                    }}
                  />
                </Box>
              )}

              {/* Tags */}
              {ticket.tags && ticket.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {ticket.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* SLA Timer */}
              {sla && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    SLA Status
                  </Typography>
                  <Box sx={{
                    p: 2,
                    backgroundColor: sla.overdue 
                      ? `${dashboardTheme.colors.error}10` 
                      : `${dashboardTheme.colors.success}10`,
                    borderRadius: 1,
                    border: `1px solid ${sla.overdue ? dashboardTheme.colors.error : dashboardTheme.colors.success}`
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700,
                      color: sla.overdue ? dashboardTheme.colors.error : dashboardTheme.colors.success
                    }}>
                      {sla.overdue ? 'OVERDUE' : `${Math.floor(sla.remaining / 60)}h ${sla.remaining % 60}m left`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {sla.overdue ? 'Past resolution deadline' : 'Until resolution deadline'}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Timestamps */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Created
                </Typography>
                <Typography variant="body2">
                  {formatTimestamp(ticket.created_at)}
                </Typography>
              </Box>

              {ticket.first_response_at && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    First Response
                  </Typography>
                  <Typography variant="body2">
                    {formatTimestamp(ticket.first_response_at)}
                  </Typography>
                </Box>
              )}

              {ticket.resolved_at && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Resolved
                  </Typography>
                  <Typography variant="body2">
                    {formatTimestamp(ticket.resolved_at)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketDetail;
