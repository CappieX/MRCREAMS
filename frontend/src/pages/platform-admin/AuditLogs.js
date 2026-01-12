import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TablePagination,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { apiRequest } from '../../utils/apiService';

const Row = ({ log }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
        <TableCell>
          <Chip 
            label={log.action} 
            color={log.success ? "success" : "error"} 
            variant="outlined" 
            size="small" 
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2">{log.userName}</Typography>
            <Typography variant="caption" color="textSecondary">{log.userEmail}</Typography>
          </Box>
        </TableCell>
        <TableCell>{log.resourceType}</TableCell>
        <TableCell>
          <Chip 
            label={log.severity || 'info'} 
            size="small" 
            color={log.severity === 'critical' ? 'error' : log.severity === 'warning' ? 'warning' : 'default'}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Request Details
                      </Typography>
                      <pre style={{ overflowX: 'auto', fontSize: '0.8rem' }}>
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </Grid>
                {log.oldData && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Previous Data
                        </Typography>
                        <pre style={{ overflowX: 'auto', fontSize: '0.8rem' }}>
                          {JSON.stringify(log.oldData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                {log.newData && (
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          New Data
                        </Typography>
                        <pre style={{ overflowX: 'auto', fontSize: '0.8rem' }}>
                          {JSON.stringify(log.newData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [query, setQuery] = useState('');
  const [actor, setActor] = useState('all');
  const [action, setAction] = useState('all');
  const [severity, setSeverity] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage, actor, action, severity, query]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const offset = page * rowsPerPage;
      const data = await apiRequest(`/platform/audit-logs?limit=${rowsPerPage}&offset=${offset}`, 'GET', null, token);
      let items = Array.isArray(data) ? data : [];
      items = items.filter(i =>
        (severity === 'all' || i.severity === severity) &&
        (actor === 'all' || (actor === 'system' ? i.userEmail === 'system' : i.userEmail !== 'system')) &&
        (action === 'all' || i.action === action) &&
        (!query || JSON.stringify(i).toLowerCase().includes(query.toLowerCase()))
      );
      setLogs(items);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const header = ['timestamp','action','userEmail','userName','resourceType','severity'];
    const rows = logs.map(l => [new Date(l.createdAt).toISOString(), l.action, l.userEmail, l.userName, l.resourceType, l.severity]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v || '')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && logs.length === 0) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Audit Logs
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField select fullWidth label="Actor" value={actor} onChange={(e) => setActor(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="user">Users</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField select fullWidth label="Action" value={action} onChange={(e) => setAction(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="LOGIN">LOGIN</MenuItem>
              <MenuItem value="UPDATE">UPDATE</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
              <MenuItem value="ALERT">ALERT</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField select fullWidth label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button variant="outlined" onClick={exportCSV}>Export CSV</Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Severity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <Row key={log.id} log={log} />
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={-1} // Server-side pagination, total count unknown for now
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default AuditLogs;
