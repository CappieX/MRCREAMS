import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Slider,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Save, Clear } from '@mui/icons-material';
import axios from 'axios';

const conflictReasons = [
  'Household Chores',
  'Social Plans',
  'Finances',
  'Miscommunication',
  'In-Laws',
  'Work-Life Balance',
  'Personal Habits',
  'Time Management',
  'Communication Style',
  'Expectations',
  'Other'
];

const API_BASE_URL = 'http://localhost:5000/api';

export default function ConflictForm() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    conflict_reason: '',
    time_consumption: 30,
    fight_degree: 5,
    final_result: '',
    remark: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSliderChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/conflicts`, formData);
      setMessage({ 
        type: 'success', 
        text: 'Conflict logged successfully!' 
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        conflict_reason: '',
        time_consumption: 30,
        fight_degree: 5,
        final_result: '',
        remark: ''
      });
    } catch (error) {
      console.error('Error logging conflict:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error logging conflict. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      conflict_reason: '',
      time_consumption: 30,
      fight_degree: 5,
      final_result: '',
      remark: ''
    });
    setMessage({ type: '', text: '' });
  };

  const getIntensityColor = (degree) => {
    if (degree >= 8) return 'error.main';
    if (degree >= 5) return 'warning.main';
    return 'success.main';
  };

  const getIntensityLabel = (degree) => {
    if (degree >= 8) return 'High Intensity';
    if (degree >= 5) return 'Medium Intensity';
    return 'Low Intensity';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Log New Conflict
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Track and analyze disagreements to improve communication and understanding.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {message.text && (
              <Alert 
                severity={message.type} 
                sx={{ mb: 2 }}
                onClose={() => setMessage({ type: '', text: '' })}
              >
                {message.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Time"
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <FormControl fullWidth required>
                  <InputLabel>Conflict Reason</InputLabel>
                  <Select
                    name="conflict_reason"
                    value={formData.conflict_reason}
                    label="Conflict Reason"
                    onChange={handleChange}
                  >
                    {conflictReasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography gutterBottom variant="h6">
                    Duration: {formData.time_consumption} minutes
                  </Typography>
                  <Slider
                    value={formData.time_consumption}
                    onChange={(e, value) => handleSliderChange('time_consumption', value)}
                    min={5}
                    max={180}
                    step={5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} min`}
                    marks={[
                      { value: 5, label: '5m' },
                      { value: 60, label: '1h' },
                      { value: 120, label: '2h' },
                      { value: 180, label: '3h' }
                    ]}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">
                      Intensity: {formData.fight_degree}/10
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: getIntensityColor(formData.fight_degree),
                        fontWeight: 'bold'
                      }}
                    >
                      {getIntensityLabel(formData.fight_degree)}
                    </Typography>
                  </Box>
                  <Slider
                    value={formData.fight_degree}
                    onChange={(e, value) => handleSliderChange('fight_degree', value)}
                    min={1}
                    max={10}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 1, label: '1' },
                      { value: 5, label: '5' },
                      { value: 10, label: '10' }
                    ]}
                    sx={{
                      color: getIntensityColor(formData.fight_degree),
                      '& .MuiSlider-markLabel': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Box>

                <TextField
                  label="Resolution / Final Outcome"
                  name="final_result"
                  value={formData.final_result}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="How was the conflict resolved? What was agreed upon?"
                  helperText="Describe the outcome and any agreements reached"
                />

                <TextField
                  label="Additional Notes & Context"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                  placeholder="Any additional context, triggers, or observations..."
                  helperText="Optional notes for future reference"
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    startIcon={<Save />}
                    disabled={isSubmitting}
                    sx={{ flex: 2 }}
                  >
                    {isSubmitting ? 'Logging...' : 'Log Conflict'}
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    size="large" 
                    startIcon={<Clear />}
                    onClick={handleClear}
                    sx={{ flex: 1 }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'primary.50', border: 1, borderColor: 'primary.100' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                💡 Tips for Better Logging
              </Typography>
              <Box component="ul" sx={{ pl: 2, '& li': { mb: 1 } }}>
                <li><Typography variant="body2">Be honest about intensity levels</Typography></li>
                <li><Typography variant="body2">Note specific triggers if possible</Typography></li>
                <li><Typography variant="body2">Record resolutions accurately</Typography></li>
                <li><Typography variant="body2">Include context in remarks</Typography></li>
                <li><Typography variant="body2">Log conflicts soon after they occur</Typography></li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}