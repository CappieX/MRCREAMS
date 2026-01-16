import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from 'axios/dist/browser/axios.cjs';

const API_BASE_URL = 'http://localhost:5001/api';

const commonReasons = [
  'Household Chores',
  'Finances',
  'Social Plans',
  'In-Laws',
  'Personal Habits',
  'Miscommunication',
  'Work-Life Balance',
  'Other'
];

function ConflictForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    conflict_reason: '',
    time_consumption: 30,
    fight_degree: 5,
    final_result: '',
    remark: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchConflict();
    }
  }, [id]);

  const fetchConflict = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conflicts/${id}`);
      const conflict = response.data;
      
      // Format date for input field
      const formattedDate = new Date(conflict.date).toISOString().split('T')[0];
      
      setFormData({
        ...conflict,
        date: formattedDate
      });
      setError('');
    } catch (error) {
      console.error('Error fetching conflict:', error);
      setError('Failed to load conflict data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSliderChange = (name) => (event, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/conflicts/${id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/conflicts`, formData);
      }
      
      setSuccess(true);
      setError('');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/harmony-hub');
      }, 1500);
    } catch (error) {
      console.error('Error saving conflict:', error);
      setError('Failed to save conflict. Please try again.');
      setSuccess(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Challenge' : 'Share Challenge'}
        </Typography>
        <Typography>Loading conflict data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/harmony-hub')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4">
            {isEditMode ? 'Edit Challenge' : 'Share Challenge'}
          </Typography>
        </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Conflict {isEditMode ? 'updated' : 'added'} successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Conflict Reason</InputLabel>
                <Select
                  name="conflict_reason"
                  value={formData.conflict_reason}
                  onChange={handleChange}
                >
                  {commonReasons.map((reason) => (
                    <MenuItem key={reason} value={reason}>
                      {reason}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Duration (minutes)</Typography>
              <Slider
                value={formData.time_consumption}
                onChange={handleSliderChange('time_consumption')}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={5}
                max={120}
              />
              <TextField
                fullWidth
                type="number"
                name="time_consumption"
                value={formData.time_consumption}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Intensity (1-10)</Typography>
              <Slider
                value={formData.fight_degree}
                onChange={handleSliderChange('fight_degree')}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
              />
              <TextField
                fullWidth
                type="number"
                name="fight_degree"
                value={formData.fight_degree}
                onChange={handleChange}
                inputProps={{ min: 1, max: 10 }}
                sx={{ mt: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Final Result"
                name="final_result"
                value={formData.final_result}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="Additional notes or context about this conflict..."
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
              >
                {isEditMode ? 'Update Conflict' : 'Save Conflict'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default ConflictForm;
