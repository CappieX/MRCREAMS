/**
 * Authentication Routes Tests
 */

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');
const authMiddleware = require('../../middleware/auth');

// Mock dependencies
jest.mock('../../middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => next()),
  isAdmin: jest.fn((req, res, next) => next()),
  isTherapist: jest.fn((req, res, next) => next()),
  isSupport: jest.fn((req, res, next) => next()),
}));

jest.mock('../../services/authService', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  verifyToken: jest.fn(),
  refreshToken: jest.fn(),
  logoutUser: jest.fn(),
  professionalLogin: jest.fn(),
}));

const authService = require('../../services/authService');

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock successful registration
      authService.registerUser.mockResolvedValue({
        success: true,
        user: { id: 1, email: 'test@example.com', role: 'client' },
        token: 'test-token'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(authService.registerUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      });
    });

    it('should return 400 for invalid registration data', async () => {
      // Mock validation error
      authService.registerUser.mockRejectedValue({
        status: 400,
        message: 'Validation error'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      // Mock successful login
      authService.loginUser.mockResolvedValue({
        success: true,
        user: { id: 1, email: 'test@example.com', role: 'client' },
        token: 'test-token'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(authService.loginUser).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!'
      );
    });

    it('should return 401 for invalid credentials', async () => {
      // Mock authentication failure
      authService.loginUser.mockRejectedValue({
        status: 401,
        message: 'Invalid credentials'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/professional-login', () => {
    it('should login a professional user successfully', async () => {
      // Mock successful professional login
      authService.professionalLogin.mockResolvedValue({
        success: true,
        user: { id: 1, email: 'therapist@example.com', role: 'therapist' },
        token: 'test-token'
      });

      const response = await request(app)
        .post('/api/auth/professional-login')
        .send({
          email: 'therapist@example.com',
          password: 'Password123!',
          organizationCode: 'ORG123',
          role: 'therapist'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(authService.professionalLogin).toHaveBeenCalledWith(
        'therapist@example.com',
        'Password123!',
        'ORG123',
        'therapist'
      );
    });
  });

  describe('GET /api/auth/verify-token', () => {
    it('should verify a valid token', async () => {
      // Mock successful token verification
      authService.verifyToken.mockResolvedValue({
        success: true,
        user: { id: 1, email: 'test@example.com', role: 'client' }
      });

      const response = await request(app)
        .get('/api/auth/verify-token')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user successfully', async () => {
      // Mock successful logout
      authService.logoutUser.mockResolvedValue({
        success: true,
        message: 'Logged out successfully'
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });
  });
});