import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import ConflictForm from './components/ConflictForm';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Recommendations from './components/Recommendations';
import Navigation from './components/Navigation';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              💑 W.C.R.E.A.M.S.
              <Chip 
                label="Beta" 
                size="small" 
                color="secondary" 
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              />
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Relationship Intelligence
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Navigation />
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pb: 8 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<ConflictForm />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/recommendations" element={<Recommendations />} />
          </Routes>
        </Container>

        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            py: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            Made with <Favorite sx={{ color: 'error.main', fontSize: 16 }} /> for better relationships
          </Typography>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;