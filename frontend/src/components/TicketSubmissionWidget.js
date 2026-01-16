import React, { useState, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  Zoom
} from '@mui/material';
import {
  Support as SupportIcon,
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  SmartToy as AIIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { dashboardTheme } from '../constants/dashboardTheme';
import axios from 'axios/dist/browser/axios.cjs';

const TicketSubmissionWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category_id: '',
    tags: []
  });

  const [aiSuggestion, setAiSuggestion] = useState(null);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // AI-powered category suggestion based on title/description
  useEffect(() => {
    if (formData.title.length > 10 || formData.description.length > 20) {
      suggestCategory();
    }
  }, [formData.title, formData.description]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/v1/support/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const suggestCategory = () => {
    // Simple keyword-based category suggestion (can be replaced with ML model)
    const text = `${formData.title} ${formData.description}`.toLowerCase();
    
    let suggestedCategory = null;
    let suggestedPriority = 'medium';

    // Category detection
    if (text.includes('bug') || text.includes('error') || text.includes('crash')) {
      suggestedCategory = categories.find(c => c.name === 'Bug Report');
      suggestedPriority = 'high';
    } else if (text.includes('billing') || text.includes('payment') || text.includes('invoice')) {
      suggestedCategory = categories.find(c => c.name === 'Billing');
    } else if (text.includes('feature') || text.includes('request') || text.includes('enhancement')) {
      suggestedCategory = categories.find(c => c.name === 'Feature Request');
      suggestedPriority = 'low';
    } else if (text.includes('account') || text.includes('login') || text.includes('password')) {
      suggestedCategory = categories.find(c => c.name === 'Account Management');
      suggestedPriority = 'high';
    } else if (text.includes('integration') || text.includes('api') || text.includes('connect')) {
      suggestedCategory = categories.find(c => c.name === 'Integration');
    }

    // Priority detection
    if (text.includes('urgent') || text.includes('critical') || text.includes('emergency')) {
      suggestedPriority = 'critical';
    } else if (text.includes('important') || text.includes('asap')) {
      suggestedPriority = 'high';
    }

    if (suggestedCategory || suggestedPriority !== formData.priority) {
      setAiSuggestion({
        category: suggestedCategory,
        priority: suggestedPriority
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setSuccess(false);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category_id: '',
      tags: []
    });
    setAiSuggestion(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setFormData({
        ...formData,
        category_id: aiSuggestion.category?.id || formData.category_id,
        priority: aiSuggestion.priority
      });
      setAiSuggestion(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please provide a title for your ticket');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/v1/support/tickets', {
        ...formData,
        source: 'web'
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: dashboardTheme.colors.success,
    medium: dashboardTheme.colors.warning,
    high: dashboardTheme.colors.error,
    critical: '#DC2626'
  };

  return (
    <>
      {/* Floating Action Button */}
      <Tooltip title="Need Help? Submit a Ticket" placement="left" TransitionComponent={Zoom}>
        <Fab
          color="primary"
          aria-label="support"
          onClick={handleOpen}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: dashboardTheme.colors.chart.blue,
            '&:hover': {
              backgroundColor: dashboardTheme.colors.chart.purple,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
            zIndex: 1000
          }}
        >
          <SupportIcon />
        </Fab>
      </Tooltip>

      {/* Ticket Submission Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${dashboardTheme.colors.background}`,
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportIcon sx={{ color: dashboardTheme.colors.chart.blue }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Submit Support Ticket
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Ticket submitted successfully! Our support team will respond shortly.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* AI Suggestion Banner */}
            {aiSuggestion && (
              <Alert 
                severity="info" 
                icon={<AIIcon />}
                sx={{ mb: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={applySuggestion}>
                    Apply
                  </Button>
                }
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  AI Suggestion:
                </Typography>
                <Typography variant="body2">
                  {aiSuggestion.category && `Category: ${aiSuggestion.category.name} • `}
                  Priority: {aiSuggestion.priority.toUpperCase()}
                </Typography>
              </Alert>
            )}

            {/* Title */}
            <TextField
              fullWidth
              required
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              sx={{ mb: 2 }}
              autoFocus
            />

            {/* Description */}
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide detailed information about your issue..."
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* Priority */}
              <TextField
                select
                fullWidth
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                sx={{ flex: 1 }}
              >
                <MenuItem value="low">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: priorityColors.low 
                    }} />
                    Low
                  </Box>
                </MenuItem>
                <MenuItem value="medium">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: priorityColors.medium 
                    }} />
                    Medium
                  </Box>
                </MenuItem>
                <MenuItem value="high">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: priorityColors.high 
                    }} />
                    High
                  </Box>
                </MenuItem>
                <MenuItem value="critical">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: priorityColors.critical 
                    }} />
                    Critical
                  </Box>
                </MenuItem>
              </TextField>

              {/* Category */}
              <TextField
                select
                fullWidth
                label="Category"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                sx={{ flex: 1 }}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: category.color 
                      }} />
                      {category.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* User Info Display */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: dashboardTheme.colors.background, 
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="caption" color="text.secondary">
                Ticket will be submitted as:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name || user?.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            {/* Help Text */}
            <Typography variant="caption" color="text.secondary">
              Our support team typically responds within 4 hours for high-priority tickets 
              and 24 hours for standard requests.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ 
            px: 3, 
            py: 2, 
            borderTop: `1px solid ${dashboardTheme.colors.background}` 
          }}>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
              disabled={loading || success}
              sx={{
                backgroundColor: dashboardTheme.colors.chart.blue,
                '&:hover': {
                  backgroundColor: dashboardTheme.colors.chart.purple,
                }
              }}
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default TicketSubmissionWidget;
