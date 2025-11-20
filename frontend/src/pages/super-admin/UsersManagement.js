import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Button, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Alert, Snackbar, Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import DashboardCard from '../../components/dashboard/DashboardCard';
import MetricCard from '../../components/dashboard/MetricCard';
import StatusIndicator from '../../components/dashboard/StatusIndicator';
import { dashboardTheme } from '../../constants/dashboardTheme';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'therapist',
    organization: '',
    status: 'active'
  });

  // Initialize users
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { userAPI } = await import('../../utils/apiService');
        const response = await userAPI.getUsers();
        
        if (response && response.data) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to mock data if API fails
        const mockUsers = [
          { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@therapyclinic.com', role: 'therapist', organization: 'Therapy Network Partners', status: 'active', lastLogin: '2 hours ago', sessions: 45 },
          { id: 2, name: 'Admin User', email: 'admin@mrcreams.com', role: 'admin', organization: 'MR.CREAMS Corporate', status: 'active', lastLogin: '1 day ago', sessions: 12 },
          { id: 3, name: 'Support Agent', email: 'support@mrcreams.com', role: 'support', organization: 'MR.CREAMS Corporate', status: 'active', lastLogin: '30 min ago', sessions: 89 },
          { id: 4, name: 'Executive Director', email: 'executive@mrcreams.com', role: 'executive', organization: 'MR.CREAMS Corporate', status: 'inactive', lastLogin: '2 weeks ago', sessions: 3 },
          { id: 5, name: 'Dr. David Wilson', email: 'david@therapyclinic.com', role: 'therapist', organization: 'Therapy Network Partners', status: 'active', lastLogin: '5 hours ago', sessions: 67 }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;
    
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, users]);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    const userToAdd = {
      id: users.length + 1,
      ...newUser,
      lastLogin: 'Never',
      sessions: 0
    };

    setUsers(prev => [...prev, userToAdd]);
    setSnackbar({ open: true, message: `User ${newUser.name} added successfully`, severity: 'success' });
    resetForm();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      status: user.status
    });
    setOpenDialog(true);
  };

  const handleUpdateUser = () => {
    setUsers(prev => prev.map(user =>
      user.id === editingUser.id ? { ...user, ...newUser } : user
    ));
    setSnackbar({ open: true, message: `User ${newUser.name} updated successfully`, severity: 'success' });
    resetForm();
  };

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
  };

  const resetForm = () => {
    setNewUser({ name: '', email: '', role: 'therapist', organization: '', status: 'active' });
    setOpenDialog(false);
    setEditingUser(null);
  };

  const roleColors = {
    therapist: dashboardTheme.colors.chart.purple,
    admin: dashboardTheme.colors.chart.blue,
    support: dashboardTheme.colors.chart.teal,
    executive: dashboardTheme.colors.chart.orange,
    super_admin: dashboardTheme.colors.error
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Users & Roles Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Add New User
        </Button>
      </Box>

      {/* Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Users"
            value="1,248"
            change="+12.5%"
            changeType="increase"
            color={dashboardTheme.colors.chart.blue}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Today"
            value="156"
            change="+23"
            changeType="increase"
            color={dashboardTheme.colors.success}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Therapists"
            value="42"
            change="+3"
            changeType="increase"
            color={dashboardTheme.colors.chart.purple}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Admins"
            value="8"
            change="Stable"
            changeType="stable"
            color={dashboardTheme.colors.chart.teal}
          />
        </Grid>
      </Grid>

      {/* Filters & Search */}
      <DashboardCard title="User Directory" subtitle="Manage all platform users">
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search users by name, email, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="therapist">Therapist</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="executive">Executive</MenuItem>
                <MenuItem value="super_admin">Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Organization</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sessions</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.organization}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      size="small"
                      sx={{ 
                        backgroundColor: `${roleColors[user.role]}20`,
                        color: roleColors[user.role],
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusIndicator 
                      status={user.status === 'active' ? 'success' : 'warning'} 
                      label={user.status}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.lastLogin}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.sessions}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit User">
                        <IconButton size="small" onClick={() => handleEditUser(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No users found matching your criteria
            </Typography>
          </Box>
        )}
      </DashboardCard>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newUser.role}
                  label="Role"
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <MenuItem value="therapist">Therapist</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="support">Support</MenuItem>
                  <MenuItem value="executive">Executive</MenuItem>
                  <MenuItem value="super_admin">Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newUser.status}
                  label="Status"
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization"
                value={newUser.organization}
                onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                placeholder="Enter organization name"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            onClick={editingUser ? handleUpdateUser : handleAddUser}
            variant="contained"
          >
            {editingUser ? 'Update User' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersManagement;
