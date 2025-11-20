import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BusinessIcon from '@mui/icons-material/Business';
import PsychologyIcon from '@mui/icons-material/Psychology';

const ProfessionalLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // FIX: Start with empty role instead of 'therapist' to prevent MUI Select error
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationCode: '',
    role: '' // ← CHANGED FROM 'therapist' TO EMPTY STRING
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]); // Start empty
  const [error, setError] = useState('');

  // Test credentials for quick fill
  const testCredentials = {
    super_admin: { email: 'super.admin@mrcreams.com', password: 'HFae1PKLkiX0', orgCode: 'MRCREAMS-SUPER-001', role: 'super_admin' },
    admin: { email: 'platform.admin@mrcreams.com', password: 'M&3vyQ6tyWug', orgCode: 'MRCREAMS-ADMIN-001', role: 'admin' },
    support: { email: 'support.team@mrcreams.com', password: 'BpXZ05pSI8W#', orgCode: 'MRCREAMS-SUPPORT-001', role: 'support' },
    therapist: { email: 'clinical.team@mrcreams.com', password: 'v1VRiXzctqHF', orgCode: 'MRCREAMS-THERAPIST-001', role: 'therapist' },
    executive: { email: 'executive.team@mrcreams.com', password: 'ZePiW*XyAMvU', orgCode: 'MRCREAMS-EXECUTIVE-001', role: 'executive' }
  };

  // Auto-set roles based on org code
  useEffect(() => {
    const orgConfig = {
      'MRCREAMS-SUPER-001': ['super_admin'],
      'MRCREAMS-ADMIN-001': ['admin'],
      'MRCREAMS-SUPPORT-001': ['support'],
      'MRCREAMS-THERAPIST-001': ['therapist'],
      'MRCREAMS-EXECUTIVE-001': ['executive']
    };

    if (formData.organizationCode && orgConfig[formData.organizationCode]) {
      setAvailableRoles(orgConfig[formData.organizationCode]);
      if (!orgConfig[formData.organizationCode].includes(formData.role)) {
        setFormData(prev => ({ ...prev, role: orgConfig[formData.organizationCode][0] }));
      }
    } else {
      setAvailableRoles(['super_admin', 'admin', 'support', 'executive', 'therapist']);
    }
  }, [formData.organizationCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.email || !formData.password || !formData.organizationCode || !formData.role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    console.log('🔍 PROFESSIONAL LOGIN DEBUG - Starting login process');
    console.log('📧 Login data:', {
      email: formData.email,
      password: formData.password,
      organizationCode: formData.organizationCode,
      role: formData.role
    });

    try {
      console.log('🔄 Calling login function from AuthContext...');
      const result = await login(formData.email, formData.password, formData.organizationCode, formData.role);
      console.log('✅ Login function completed, result:', result);

      if (result.success) {
        console.log('🎉 Login successful! User data:', result.user);
        console.log('🔀 Redirecting to dashboard:', result.user.role);

        const redirectPaths = {
          super_admin: '/dashboard/super-admin',
          admin: '/dashboard/admin',
          support: '/dashboard/support',
          executive: '/dashboard/executive',
          therapist: '/dashboard/therapist',
          it_admin: '/dashboard/it-admin'
        };
        navigate(redirectPaths[result.user.role] || '/dashboard');
      } else {
        console.log('❌ Login failed with error:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('💥 Login catch error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError('Login failed: ' + err.message);
    } finally {
      console.log('🏁 Login process completed');
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Quick fill without errors
  const quickFill = (role) => {
    const creds = testCredentials[role];
    if (creds) setFormData({
      email: creds.email,
      password: creds.password,
      organizationCode: creds.orgCode,
      role: creds.role
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'center' }}>
          <PsychologyIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">MR.CREAMS Pro</Typography>
        </Box>
        <Typography component="h1" variant="h5" gutterBottom align="center">
          Professional Sign In
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
          For Admins, Therapists, Support, Executives, and Super Admins
        </Typography>

        {/* Quick Test Buttons - SIMPLIFIED */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['super_admin', 'admin', 'support', 'therapist', 'executive'].map(role => (
            <Button key={role} size="small" variant="outlined" onClick={() => quickFill(role)}>
              {role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Button>
          ))}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Organization Code"
            margin="normal"
            required
            value={formData.organizationCode}
            onChange={handleInputChange('organizationCode')}
            placeholder="e.g., MRCREAMS-SUPER-2024"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              )
            }}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Professional Role</InputLabel>
            <Select
              value={formData.role}
              label="Professional Role"
              onChange={handleInputChange('role')}
              disabled={availableRoles.length === 0}
              displayEmpty
            >
              {availableRoles.length === 0 ? (
                <MenuItem disabled value="">
                  <em>Select organization code first</em>
                </MenuItem>
              ) : (
                availableRoles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            value={formData.email}
            onChange={handleInputChange('email')}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            required
            value={formData.password}
            onChange={handleInputChange('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In as Professional'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2">
              <Link component={RouterLink} to="/login" variant="body2">
                ← Back to User Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfessionalLogin;
