import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, InputAdornment, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, Chip, Avatar, IconButton, Tooltip, Paper, Toolbar,
  Menu, Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  MoreVert as MoreIcon,
  Assignment as AssignIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardTheme } from '../../constants/dashboardTheme';
import axios from 'axios/dist/browser/axios.cjs';

const AllTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bulkActionAnchor, setBulkActionAnchor] = useState(null);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState({ type: '', value: '' });

  useEffect(() => {
    fetchTickets();
  }, [page, statusFilter, priorityFilter, searchQuery]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await axios.get('/api/v1/support/tickets', { params });
      setTickets(response.data.tickets);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(tickets.map(t => t.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async () => {
    try {
      await axios.post('/api/v1/support/tickets/bulk-update', {
        ticket_ids: selected,
        updates: { [bulkAction.type]: bulkAction.value }
      });
      setBulkActionDialog(false);
      setSelected([]);
      fetchTickets();
    } catch (error) {
      console.error('Error applying bulk action:', error);
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          All Support Tickets
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTickets}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 300 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="escalated">Escalated</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Bulk Actions Toolbar */}
      {selected.length > 0 && (
        <Toolbar
          sx={{
            mb: 2,
            backgroundColor: `${dashboardTheme.colors.chart.blue}15`,
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="subtitle1">
            {selected.length} ticket{selected.length > 1 ? 's' : ''} selected
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setBulkAction({ type: 'status', value: '' });
                setBulkActionDialog(true);
              }}
            >
              Change Status
            </Button>
            <Button
              size="small"
              onClick={() => {
                setBulkAction({ type: 'assigned_agent_id', value: '' });
                setBulkActionDialog(true);
              }}
            >
              Assign To
            </Button>
            <Button
              size="small"
              onClick={() => {
                setBulkAction({ type: 'priority', value: '' });
                setBulkActionDialog(true);
              }}
            >
              Change Priority
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => setSelected([])}
            >
              Clear Selection
            </Button>
          </Box>
        </Toolbar>
      )}

      {/* Tickets Table */}
      <Paper>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === tickets.length && tickets.length > 0}
                    indeterminate={selected.length > 0 && selected.length < tickets.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Ticket ID</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  hover
                  selected={selected.includes(ticket.id)}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/dashboard/support/tickets/${ticket.id}`)}
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(ticket.id)}
                      onChange={() => handleSelectOne(ticket.id)}
                    />
                  </TableCell>
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
                      label={ticket.status.replace('_', ' ')}
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
                      label={ticket.priority}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {ticket.requester_name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                        {ticket.requester_name || 'Unknown'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {ticket.agent_name ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                          {ticket.agent_name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
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
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton size="small">
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {tickets.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              No tickets found
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ px: 2, py: 1 }}>
              Page {page} of {totalPages}
            </Typography>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Paper>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)}>
        <DialogTitle>Bulk Update Tickets</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>
              {bulkAction.type === 'status' && 'New Status'}
              {bulkAction.type === 'priority' && 'New Priority'}
              {bulkAction.type === 'assigned_agent_id' && 'Assign To'}
            </InputLabel>
            <Select
              value={bulkAction.value}
              label={bulkAction.type}
              onChange={(e) => setBulkAction({ ...bulkAction, value: e.target.value })}
            >
              {bulkAction.type === 'status' && (
                <>
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </>
              )}
              {bulkAction.type === 'priority' && (
                <>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBulkAction}>
            Apply to {selected.length} Ticket{selected.length > 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllTickets;
