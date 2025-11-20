import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const SystemHarmonyAdmin = () => {
  const [users, setUsers] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConflicts: 0,
    maleUsers: 0,
    femaleUsers: 0
  });
  
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        // Fetch users
        const usersResponse = await axios.get('http://localhost:5001/api/admin/users', config);
        setUsers(usersResponse.data);
        
        // Fetch conflicts
        const conflictsResponse = await axios.get('http://localhost:5001/api/conflicts', config);
        setConflicts(conflictsResponse.data);
        
        // Calculate stats
        const maleUsers = usersResponse.data.filter(user => user.gender === 'male').length;
        const femaleUsers = usersResponse.data.filter(user => user.gender === 'female').length;
        
        setStats({
          totalUsers: usersResponse.data.length,
          totalConflicts: conflictsResponse.data.length,
          maleUsers,
          femaleUsers
        });
        
        setError('');
      } catch (err) {
        setError('Failed to fetch admin data. ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.delete(`http://localhost:5001/api/admin/users/${userToDelete.id}`, config);
      
      // Update users list
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
        maleUsers: userToDelete.gender === 'male' ? prev.maleUsers - 1 : prev.maleUsers,
        femaleUsers: userToDelete.gender === 'female' ? prev.femaleUsers - 1 : prev.femaleUsers
      }));
      
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Failed to delete user. ' + (err.response?.data?.error || err.message));
    }
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AdminPanelSettingsIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
          <Typography variant="h4" component="h1">
            System Harmony Management
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Harmony Seekers</Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Relationship Challenges</Typography>
                <Typography variant="h4">{stats.totalConflicts}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Husbands</Typography>
                <Typography variant="h4">{stats.maleUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Wives</Typography>
                <Typography variant="h4">{stats.femaleUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mb: 2 }}>
          User Management
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: user.is_admin ? 'primary.main' : 'text.secondary' }} />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>{user.is_admin ? 'Admin' : 'User'}</TableCell>
                  <TableCell>{user.gender === 'male' ? 'Husband' : 'Wife'}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => openDeleteDialog(user)}
                      disabled={user.is_admin} // Prevent deleting admin users
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" sx={{ mb: 2 }}>
          Recent Conflicts
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Fight Degree</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conflicts.slice(0, 5).map((conflict) => (
                <TableRow key={conflict.id}>
                  <TableCell>{conflict.id}</TableCell>
                  <TableCell>{conflict.date}</TableCell>
                  <TableCell>{conflict.conflict_reason}</TableCell>
                  <TableCell>{conflict.fight_degree}/10</TableCell>
                  <TableCell>{conflict.final_result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{userToDelete?.username}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SystemHarmonyAdmin;