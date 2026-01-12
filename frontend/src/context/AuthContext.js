import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (raw) => {
    if (!raw) return null;
    const normalized = {
      id: raw.id,
      email: raw.email,
      name: raw.name,
      userType: raw.user_type || raw.userType,
      onboardingCompleted: raw.onboarding_completed ?? raw.onboardingCompleted,
      emailVerified: raw.email_verified ?? raw.emailVerified,
      is_admin: raw.is_admin,
      organizationCode: raw.organization_code || raw.organizationCode,
    };
    return normalized;
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await verifyToken(token);
        setUser(normalizeUser(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...userData })
      });

      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') ? await response.json() : null;
      if (!response.ok) {
        const msg = data?.error || data?.message || 'Registration failed';
        throw new Error(msg);
      }
      const { user: newUser, token } = data || {};
      if (token) localStorage.setItem('authToken', token);
      const normalized = normalizeUser(newUser);
      setUser(normalized);
      return normalized;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password, organizationCode, role) => {
    try {
      console.log('🔐 AUTHCONTEXT LOGIN DEBUG - Starting login process');
      const normalizedEmail = (email || '').trim().toLowerCase();
      const normalizedPassword = (password || '').trim();
      console.log('📧 Login credentials:', { email: normalizedEmail, organizationCode, role });
      
      // Use relative URL when proxy is configured
      const response = await fetch('/api/auth/professional-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'API-Version': 'v1' },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword, organizationCode, role }),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      // Handle 404 specifically
      if (response.status === 404) {
        return {
          success: false,
          error: 'Login endpoint not found (404). Check: 1) Backend server running, 2) Correct port, 3) Endpoint exists in auth.js'
        };
      }

      if (!response.ok) {
        let parsedError = null;
        try {
          parsedError = await response.json();
        } catch (_) {
          // Fallback to text when JSON parsing fails
        }
        const serverMessage = parsedError?.error || parsedError?.message || response.statusText;
        console.log('❌ Server response:', parsedError || serverMessage);
        return {
          success: false,
          error: serverMessage ? `Server error: ${response.status} - ${serverMessage}` : `Server error: ${response.status}`
        };
      }

      const data = await response.json();
      console.log('✅ Login response:', data);

      if (data.success) {
        const normalized = normalizeUser(data.user);
        setUser(normalized);
        localStorage.setItem('user', JSON.stringify(normalized));
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('authToken', data.token); // Also store as authToken for compatibility
        }
        return { success: true, user: normalized };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('💥 Network error:', error);
      return {
        success: false,
        error: `Cannot connect to server: ${error.message}. Check if backend is running.`
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const data = await response.json();
        const payloadUser = data.user || data.data?.user || data;
        const normalized = normalizeUser(payloadUser);
        setUser(normalized);
        return normalized;
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson?.error || 'Token verification failed');
        }
        const data = await response.json();
        return data;
      } else {
        const text = await response.text();
        throw new Error(text || 'Token verification failed');
      }
    } catch (error) {
      // Fallback: check if we have user data in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
