import React, { useContext } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Popover,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { Settings as SettingsIcon, Palette as PaletteIcon } from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';

const colorOptions = [
  { name: 'Empathetic Blue', primary: '#4A90E2', secondary: '#8B5FBF' },
  { name: 'Warm Teal', primary: '#4ECDC4', secondary: '#FF6B6B' },
  { name: 'Gentle Purple', primary: '#8B5FBF', secondary: '#4A90E2' },
  { name: 'Compassionate Orange', primary: '#FF8A65', secondary: '#4ECDC4' },
  { name: 'Soothing Green', primary: '#81C784', secondary: '#FFB74D' },
  { name: 'Harmony Teal', primary: '#4ECDC4', secondary: '#8B5FBF' },
];

function ThemeSettings() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentTheme, toggleTheme, changePrimaryColor, changeSecondaryColor } = useContext(ThemeContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'theme-settings-popover' : undefined;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} aria-describedby={id}>
        <SettingsIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" gutterBottom>
            Theme Settings
          </Typography>
          <Divider sx={{ my: 1 }} />
          
          <FormControlLabel
            control={
              <Switch
                checked={currentTheme === 'dark'}
                onChange={toggleTheme}
                name="darkMode"
                color="primary"
              />
            }
            label="Dark Mode"
          />
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            <PaletteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Color Themes
          </Typography>
          
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {colorOptions.map((option) => (
              <Grid item xs={4} key={option.name}>
                <Box
                  onClick={() => {
                    changePrimaryColor(option.primary);
                    changeSecondaryColor(option.secondary);
                  }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 1,
                    '&:hover': { bgcolor: 'action.hover', borderRadius: 1 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      height: 24,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ width: '50%', bgcolor: option.primary }} />
                    <Box sx={{ width: '50%', bgcolor: option.secondary }} />
                  </Box>
                  <Typography variant="caption" sx={{ mt: 0.5 }}>
                    {option.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Popover>
    </>
  );
}

export default ThemeSettings;