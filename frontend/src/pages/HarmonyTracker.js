import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  List as ListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import StyledCard from '../components/StyledCard';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

function ConflictList() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/conflicts`);
      setConflicts(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching conflicts:', error);
      setError('Failed to load conflicts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="medium">Harmony Tracker</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="medium" gutterBottom>Harmony Tracker</Typography>
          <Typography variant="body1" color="text.secondary">
            Track your relationship growth and harmony opportunities with emotional intelligence
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/conflicts/new"
          sx={{ borderRadius: 2 }}
        >
          Share Challenge
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {conflicts.length === 0 ? (
        <StyledCard
          title="No Conflicts Found"
          icon={<ListIcon />}
          elevation={1}
        >
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1" paragraph>
              No conflicts recorded yet. Click the button above to add your first conflict.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/conflicts/new"
              sx={{ borderRadius: 2, mt: 1 }}
            >
              Add First Conflict
            </Button>
          </Box>
        </StyledCard>
      ) : (
        <StyledCard
          title="All Conflicts"
          icon={<ListIcon />}
          elevation={1}
          sx={{ overflow: 'hidden' }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Duration (min)</TableCell>
                  <TableCell>Intensity</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conflicts.map((conflict) => (
                  <TableRow key={conflict.id} hover>
                    <TableCell>{new Date(conflict.date).toLocaleDateString()}</TableCell>
                    <TableCell>{conflict.time}</TableCell>
                    <TableCell>{conflict.conflict_reason}</TableCell>
                    <TableCell>{conflict.time_consumption}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${conflict.fight_degree}/10`} 
                        color={conflict.fight_degree > 7 ? 'error' : conflict.fight_degree > 4 ? 'warning' : 'success'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {conflict.final_result && conflict.final_result.length > 30 
                        ? `${conflict.final_result.substring(0, 30)}...` 
                        : conflict.final_result}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small" 
                          component={RouterLink} 
                          to={`/conflicts/edit/${conflict.id}`}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledCard>
      )}
    </Box>
  );
}

export default ConflictList;