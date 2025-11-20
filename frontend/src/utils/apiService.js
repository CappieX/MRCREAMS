/**
 * API Service for MR.CREAMS
 * Centralized API communication layer
 */

const API_BASE_URL = '/api';

// Generic API request handler with error management
const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
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
        throw {
          status: response.status,
          message: responseData.message || 'An error occurred',
          data: responseData
        };
      }
      
      return responseData;
    } else {
      const textResponse = await response.text();
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: textResponse || 'An error occurred',
        };
      }
      
      return textResponse;
    }
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email, password, organizationCode, role) => 
    apiRequest('/auth/professional-login', 'POST', { email, password, organizationCode, role }),
  
  register: (userData) => 
    apiRequest('/auth/register', 'POST', userData),
  
  verifyToken: () => 
    apiRequest('/auth/verify-token'),
    
  logout: () => 
    apiRequest('/auth/logout', 'POST')
};

// User API
export const userAPI = {
  getCurrentUser: () => 
    apiRequest('/users/me'),
  
  updateProfile: (userData) => 
    apiRequest('/users/me', 'PUT', userData),
    
  getUsers: (filters = {}) => 
    apiRequest('/users', 'GET', filters),
    
  getUserById: (userId) => 
    apiRequest(`/users/${userId}`),
    
  createUser: (userData) => 
    apiRequest('/users', 'POST', userData),
    
  updateUser: (userId, userData) => 
    apiRequest(`/users/${userId}`, 'PUT', userData),
    
  deleteUser: (userId) => 
    apiRequest(`/users/${userId}`, 'DELETE')
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

export default {
  auth: authAPI,
  user: userAPI,
  emotion: emotionAPI,
  tickets: ticketsAPI,
  analytics: analyticsAPI,
  admin: adminAPI,
  therapist: therapistAPI,
  model: modelAPI
};