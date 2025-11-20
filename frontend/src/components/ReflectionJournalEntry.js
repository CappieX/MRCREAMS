import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  Avatar,
  Divider,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Psychology as PsychologyIcon,
  Favorite as HeartIcon,
  Insights as InsightsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ReflectionJournalEntry = ({ onSave, onDelete, entry }) => {
  const [isEditing, setIsEditing] = useState(!entry);
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    emotions: entry?.emotions || [],
    gratitude: entry?.gratitude || '',
    insights: entry?.insights || '',
    mood: entry?.mood || 5
  });

  const emotionOptions = [
    { label: 'Grateful', value: 'grateful', color: '#4ECDC4', icon: '😊' },
    { label: 'Loved', value: 'loved', color: '#FF6B6B', icon: '❤️' },
    { label: 'Hopeful', value: 'hopeful', color: '#81C784', icon: '🌟' },
    { label: 'Peaceful', value: 'peaceful', color: '#4A90E2', icon: '😌' },
    { label: 'Excited', value: 'excited', color: '#FFB74D', icon: '🎉' },
    { label: 'Reflective', value: 'reflective', color: '#8B5FBF', icon: '🤔' }
  ];

  const handleEmotionToggle = (emotion) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const handleSave = () => {
    const journalEntry = {
      ...formData,
      timestamp: new Date(),
      id: entry?.id || Date.now()
    };
    
    if (onSave) {
      onSave(journalEntry);
    }
    
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && entry) {
      onDelete(entry.id);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      overflow: 'hidden',
      background: isEditing 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      color: isEditing ? 'white' : 'inherit'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon sx={{ mr: 1, fontSize: 28, color: isEditing ? 'white' : 'primary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              {isEditing ? 'New Reflection' : 'Reflection Journal'}
            </Typography>
          </Box>
          
          {!isEditing && entry && (
            <Box>
              <IconButton onClick={() => setIsEditing(true)} size="small">
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              label="Reflection Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { color: 'white' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
            />

            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              How are you feeling today? (Select all that apply)
            </Typography>

            <Grid container spacing={1} sx={{ mb: 3 }}>
              {emotionOptions.map((emotion) => (
                <Grid item key={emotion.value}>
                  <Chip
                    label={`${emotion.icon} ${emotion.label}`}
                    onClick={() => handleEmotionToggle(emotion.value)}
                    sx={{
                      bgcolor: formData.emotions.includes(emotion.value) 
                        ? emotion.color 
                        : 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        bgcolor: emotion.color,
                        opacity: 0.8
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="What's on your mind today?"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { color: 'white' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="What are you grateful for today?"
              value={formData.gratitude}
              onChange={(e) => setFormData(prev => ({ ...prev, gratitude: e.target.value }))}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { color: 'white' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={2}
              label="What insights did you gain?"
              value={formData.insights}
              onChange={(e) => setFormData(prev => ({ ...prev, insights: e.target.value }))}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { color: 'white' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                Save Reflection
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            {entry && (
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {entry.title}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  {formatDate(entry.timestamp)}
                </Typography>

                {entry.emotions && entry.emotions.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      Emotions:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {entry.emotions.map((emotion) => {
                        const emotionData = emotionOptions.find(e => e.value === emotion);
                        return (
                          <Chip
                            key={emotion}
                            label={`${emotionData?.icon} ${emotionData?.label}`}
                            size="small"
                            sx={{
                              bgcolor: emotionData?.color,
                              color: 'white'
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {entry.content}
                </Typography>

                {entry.gratitude && (
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(78, 205, 196, 0.1)' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      💝 Gratitude:
                    </Typography>
                    <Typography variant="body2">
                      {entry.gratitude}
                    </Typography>
                  </Paper>
                )}

                {entry.insights && (
                  <Paper sx={{ p: 2, bgcolor: 'rgba(255, 107, 107, 0.1)' }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                      💡 Insights:
                    </Typography>
                    <Typography variant="body2">
                      {entry.insights}
                    </Typography>
                  </Paper>
                )}
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReflectionJournalEntry;
