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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await verifyToken(token);
        setUser(userData);
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

      if (response.ok) {
        const { user: newUser, token } = await response.json();
        localStorage.setItem('authToken', token);
        setUser(newUser);
        return newUser;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password, organizationCode, role) => {
    try {
      console.log('🔐 AUTHCONTEXT LOGIN DEBUG - Starting login process');
      console.log('📧 Login credentials:', { email, organizationCode, role });
      
      // Use relative URL when proxy is configured
      const response = await fetch('/api/auth/professional-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, organizationCode, role }),
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
        const errorText = await response.text();
        console.log('❌ Server response:', errorText);
        return {
          success: false,
          error: `Server error: ${response.status} - ${errorText}`
        };
      }

      const data = await response.json();
      console.log('✅ Login response:', data);

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('authToken', data.token); // Also store as authToken for compatibility
        }
        return { success: true, user: data.user };
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
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return updatedUser;
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Token verification failed');
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