/**
 * API Service for MR.CREAMS
 * Centralized API communication layer
 */

// Default to relative `/api` so CRA dev proxy (src/setupProxy.js) + nginx production proxy work.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Generic API request handler with error management
export const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'API-Version': 'v1',
  };
  
  // Add auth token if provided
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Try to get token from localStorage
    const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (storedToken) {
      headers['Authorization'] = `Bearer ${storedToken}`;
    }
  }
  
  const options = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      
      if (!response.ok) {
        const err = new Error(responseData.message || 'An error occurred');
        err.status = response.status;
        err.data = responseData;
        throw err;
      }
      
      return responseData;
    } else {
      const textResponse = await response.text();
      
      if (!response.ok) {
        const err = new Error(textResponse || 'An error occurred');
        err.status = response.status;
        throw err;
      }
      
      return textResponse;
    }
  } catch (error) {
    const isDev = typeof window !== 'undefined' && window.location && window.location.port === '3000';
    const shouldRetry = isDev && (error && (error.status === 504 || error.code === 'ECONNREFUSED'));
    if (shouldRetry) {
      const fallbackUrl = `http://127.0.0.1:5002${endpoint}`;
      try {
        const retryResponse = await fetch(fallbackUrl, options);
        const retryContentType = retryResponse.headers.get('content-type');
        if (retryContentType && retryContentType.includes('application/json')) {
          const retryData = await retryResponse.json();
          if (!retryResponse.ok) {
            const retryErr = new Error(retryData.message || 'An error occurred');
            retryErr.status = retryResponse.status;
            retryErr.data = retryData;
            throw retryErr;
          }
          return retryData;
        } else {
          const retryText = await retryResponse.text();
          if (!retryResponse.ok) {
            const retryErr = new Error(retryText || 'An error occurred');
            retryErr.status = retryResponse.status;
            throw retryErr;
          }
          return retryText;
        }
      } catch (retryError) {
        console.error(`API Retry Error (${fallbackUrl}):`, retryError);
      }
    }
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password) => 
    apiRequest('/auth/login', 'POST', { email, password }),

  professionalLogin: (email, password, organizationCode, role) =>
    apiRequest('/auth/professional-login', 'POST', { email, password, organizationCode, role }),
  
  register: (userData) => 
    apiRequest('/auth/register', 'POST', userData),
  
  verifyToken: () =>
    apiRequest('/auth/verify'),
  
  refresh: (refreshToken) =>
    apiRequest('/auth/refresh', 'POST', { refreshToken }),
    
  logout: () => 
    apiRequest('/auth/logout', 'POST')
};

// User API
export const userAPI = {
  getCurrentUser: () => 
    apiRequest('/auth/me'),
  
  updateProfile: (userData) => 
    apiRequest('/auth/profile', 'PUT', userData),
    
  getUsers: (filters = {}) => 
    apiRequest('/admin/users', 'GET', filters),
    
  getUserById: (userId) => 
    apiRequest(`/admin/users/${userId}`),
    
  createUser: (userData) => 
    apiRequest('/auth/register', 'POST', userData),
    
  updateUser: (userId, userData) => 
    apiRequest(`/admin/users/${userId}`, 'PATCH', userData),
    
  deleteUser: (userId) => 
    apiRequest(`/admin/users/${userId}`, 'DELETE')
};

// Emotion Analysis API
export const emotionAPI = {
  analyzeEmotion: (data) => 
    apiRequest('/emotion-analysis/analyze', 'POST', data),
    
  getEmotionHistory: (userId, filters = {}) => 
    apiRequest(`/emotion-analysis/history/${userId}`, 'GET', filters),
    
  getEmotionInsights: (userId) => 
    apiRequest(`/emotion-analysis/insights/${userId}`)
};

// Support Tickets API
export const ticketsAPI = {
  getTickets: (filters = {}) => 
    apiRequest('/support-tickets', 'GET', filters),
    
  getTicketById: (ticketId) => 
    apiRequest(`/support-tickets/${ticketId}`),
    
  createTicket: (ticketData) => 
    apiRequest('/support-tickets', 'POST', ticketData),
    
  updateTicket: (ticketId, ticketData) => 
    apiRequest(`/support-tickets/${ticketId}`, 'PUT', ticketData),
    
  addComment: (ticketId, commentData) => 
    apiRequest(`/support-tickets/${ticketId}/comments`, 'POST', commentData)
};

// Analytics API
export const analyticsAPI = {
  getDashboardMetrics: (role, filters = {}) => 
    apiRequest(`/analytics/dashboard/${role}`, 'GET', filters),
    
  getSystemHealth: () => 
    apiRequest('/analytics/system-health'),
    
  getPerformanceData: (timeRange) => 
    apiRequest(`/analytics/performance?timeRange=${timeRange}`),
    
  getUserAnalytics: (filters = {}) => 
    apiRequest('/analytics/users', 'GET', filters)
};

// Admin API
export const adminAPI = {
  getSystemSettings: () => 
    apiRequest('/admin/settings'),
    
  updateSystemSettings: (settings) => 
    apiRequest('/admin/settings', 'PUT', settings),
    
  getAuditLogs: (filters = {}) => 
    apiRequest('/admin/audit-logs', 'GET', filters),
    
  getSecurityLogs: (filters = {}) => 
    apiRequest('/admin/security-logs', 'GET', filters)
};

// Therapist API
export const therapistAPI = {
  getClients: () => 
    apiRequest('/therapist/clients'),
    
  getClientById: (clientId) => 
    apiRequest(`/therapist/clients/${clientId}`),
    
  getSessions: (filters = {}) => 
    apiRequest('/therapist/sessions', 'GET', filters),
    
  getSessionById: (sessionId) => 
    apiRequest(`/therapist/sessions/${sessionId}`)
};

// Model Management API (for Super Admin)
export const modelAPI = {
  getModels: () => 
    apiRequest('/models'),
    
  getModelById: (modelId) => 
    apiRequest(`/models/${modelId}`),
    
  deployModel: (modelId, deploymentData) => 
    apiRequest(`/models/${modelId}/deploy`, 'POST', deploymentData),
    
  getModelPerformance: (modelId) => 
    apiRequest(`/models/${modelId}/performance`)
};

const api = {
  auth: authAPI,
  user: userAPI,
  emotion: emotionAPI,
  tickets: ticketsAPI,
  analytics: analyticsAPI,
  admin: adminAPI,
  therapist: therapistAPI,
  model: modelAPI
};

export default api;
