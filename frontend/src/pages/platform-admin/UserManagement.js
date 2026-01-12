import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Dialog, DialogTitle, DialogContent, Chip } from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [userType, setUserType] = useState('all');
  const [pagination, setPagination] = useState({ total: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem('authToken');
    const offset = page * rowsPerPage;
    const res = await fetch(`/api/platform/users?limit=${rowsPerPage}&offset=${offset}&q=${encodeURIComponent(q)}&status=${status}&userType=${userType}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setUsers(data.users || []);
    setPagination(data.pagination || { total: 0 });
  };

  const fetchDetail = async (id) => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`/api/platform/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setDetail(data);
  };

  useEffect(() => { fetchUsers(); }, [page, rowsPerPage, q, status, userType]);

  const bulkAction = async (action) => {
    const ids = users.slice(0, Math.min(10, users.length)).map(u => u.id);
    const token = localStorage.getItem('authToken');
    await fetch('/api/platform/users/bulk-actions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action, userIds: ids }) });
    fetchUsers();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Users</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><TextField fullWidth label="Search" value={q} onChange={(e)=>setQ(e.target.value)} /></Grid>
          <Grid item xs={12} md={3}><TextField select fullWidth label="Status" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={3}><TextField select fullWidth label="User Type" value={userType} onChange={(e)=>setUserType(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="therapist">Therapist</MenuItem>
            <MenuItem value="platform_admin">Platform Admin</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={3} sx={{ display:'flex', gap:1, justifyContent:'flex-end' }}>
            <Button variant="outlined" onClick={()=>bulkAction('activate')}>Activate</Button>
            <Button variant="outlined" onClick={()=>bulkAction('deactivate')}>Deactivate</Button>
            <Button variant="contained" onClick={()=>{
              const header = ['id','name','email','user_type','is_active','created_at'];
              const rows = users.map(u => [u.id, u.name, u.email, u.user_type, u.is_active, u.created_at]);
              const csv = [header, ...rows].map(r => r.map(v => `"${String(v||'')}"`).join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'users.csv'; a.click(); URL.revokeObjectURL(url);
            }}>Export</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Chip label={u.is_active ? 'Active' : 'Inactive'} color={u.is_active ? 'success' : 'default'} size="small" /></TableCell>
                <TableCell>{new Date(u.created_at).toLocaleDateString()}</TableCell>
                <TableCell><Button size="small" onClick={()=>{setSelectedUser(u); fetchDetail(u.id);}}>View</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination component="div" count={pagination.total} page={page} onPageChange={(_,p)=>setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e)=>{setRowsPerPage(parseInt(e.target.value,10)); setPage(0);}} />
      </Paper>

      <Dialog open={!!selectedUser} onClose={()=>{setSelectedUser(null); setDetail(null);}} fullWidth maxWidth="md">
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {detail && (
            <Box>
              <Typography variant="subtitle1">{detail.user.name} ({detail.user.email})</Typography>
              <Typography variant="body2" sx={{ mt:1 }}>Conflicts: {detail.conflicts.length}</Typography>
              <Typography variant="body2" sx={{ mt:1 }}>Recent Activity: {detail.activityLogs.length}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
