import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, useTheme, Button } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import ThemeSettings from './ThemeSettings';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const theme = useTheme();
  const { currentTheme } = useContext(ThemeContext);
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Box 
            component="img"
            src="/logo.svg"
            alt="MR.CREAMS Logo"
            sx={{
              height: 40,
              mr: 1,
              filter: currentTheme === 'dark' ? 'invert(1)' : 'none',
            }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MR.CREAMS
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" sx={{ flexGrow: 1, ml: 2, display: { xs: 'none', sm: 'block' } }}>
          Smart healing for modern relationships
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {currentUser?.is_admin && (
            <Button 
              color="inherit" 
              component={Link} 
              to="/system-harmony"
              sx={{ mr: 2 }}
            >
              System Harmony
            </Button>
          )}
          <ThemeSettings />
          <IconButton color="inherit" onClick={handleLogout} sx={{ ml: 1 }} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;