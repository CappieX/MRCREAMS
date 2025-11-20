import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Sample data for the dashboard
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'therapist', status: 'active', lastActive: '2 hours ago' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'support', status: 'active', lastActive: '1 day ago' },
  { id: 3, name: 'Alex Johnson', email: 'alex@example.com', role: 'therapist', status: 'inactive', lastActive: '1 week ago' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'executive', status: 'active', lastActive: '5 hours ago' },
  { id: 5, name: 'Mike Brown', email: 'mike@example.com', role: 'support', status: 'active', lastActive: '30 minutes ago' },
];

const stats = [
  { title: 'Total Users', value: '1,248', change: '+12%', trend: 'up' },
  { title: 'Active Sessions', value: '342', change: '+5%', trend: 'up' },
  { title: 'New Users (7d)', value: '89', change: '+23%', trend: 'up' },
  { title: 'Avg. Session', value: '4m 23s', change: '-2%', trend: 'down' },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PersonAddIcon />}
            sx={{ mr: 1 }}
          >
            Add User
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>{stat.title}</Typography>
                <Box display="flex" alignItems="flex-end">
                  <Typography variant="h4" sx={{ mr: 1 }}>{stat.value}</Typography>
                  <Typography 
                    variant="body2" 
                    color={stat.trend === 'up' ? 'success.main' : 'error.main'}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {stat.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* User Management Section */}
      <Card elevation={3}>
        <Box p={2} display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ m: 1 }}>User Management</Typography>
          
          <Box display="flex" flexWrap="wrap" gap={2}>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="therapist">Therapist</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="executive">Executive</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                      size="small"
                      color="default"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status === 'active' ? 'Active' : 'Inactive'}
                      color={user.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredUsers.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography color="textSecondary">No users found matching your criteria</Typography>
          </Box>
        )}
        
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderTop="1px solid rgba(0, 0, 0, 0.12)">
          <Typography variant="body2" color="textSecondary">
            Showing {filteredUsers.length} of {users.length} users
          </Typography>
          <Box>
            <Button size="small" sx={{ mr: 1 }}>Previous</Button>
            <Button variant="contained" size="small" disabled>1</Button>
            <Button size="small">2</Button>
            <Button size="small">3</Button>
            <Button size="small">Next</Button>
          </Box>
        </Box>
      </Card>
      
      {/* Recent Activity Section */}
      <Box mt={4}>
        <Card elevation={3}>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Recent Activity</Typography>
            <Button size="small" color="primary">View All</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableBody>
                {[
                  { id: 1, action: 'New user registered: michael@example.com', time: '5 minutes ago', type: 'user' },
                  { id: 2, action: 'Therapist profile updated: Dr. Sarah Johnson', time: '1 hour ago', type: 'update' },
                  { id: 3, action: 'New support ticket #4578 created', time: '2 hours ago', type: 'ticket' },
                  { id: 4, action: 'System backup completed successfully', time: '5 hours ago', type: 'system' },
                  { id: 5, action: 'New feature update: Enhanced reporting', time: '1 day ago', type: 'update' },
                ].map((activity) => (
                  <TableRow key={activity.id} hover>
                    <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.5)' }}>
                      <Box>
                        <Typography variant="body2">{activity.action}</Typography>
                        <Typography variant="caption" color="textSecondary">{activity.time}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Box>
  );
}
