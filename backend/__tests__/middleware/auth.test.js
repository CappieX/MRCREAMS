/**
 * Authentication Middleware Tests
 */

const jwt = require('jsonwebtoken');
const { authenticateToken, isAdmin, isTherapist, isSupport } = require('../../middleware/auth');

// Mock dependencies
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token', () => {
      // Setup
      const mockUser = { id: 1, email: 'test@example.com', role: 'client' };
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockUser);
      });

      // Execute
      authenticateToken(req, res, next);

      // Assert
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject missing token', () => {
      // Execute
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token format', () => {
      // Setup
      req.headers.authorization = 'InvalidFormat';

      // Execute
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject expired or invalid token', () => {
      // Setup
      req.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Token expired or invalid'), null);
      });

      // Execute
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.any(String)
      }));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Role-based middleware', () => {
    beforeEach(() => {
      // Setup authenticated user for role tests
      req.user = { id: 1, email: 'test@example.com', role: 'client' };
    });

    describe('isAdmin', () => {
      it('should allow admin users', () => {
        // Setup
        req.user.role = 'admin';

        // Execute
        isAdmin(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should reject non-admin users', () => {
        // Execute (user role is 'client' from beforeEach)
        isAdmin(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          success: false,
          message: expect.any(String)
        }));
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('isTherapist', () => {
      it('should allow therapist users', () => {
        // Setup
        req.user.role = 'therapist';

        // Execute
        isTherapist(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should reject non-therapist users', () => {
        // Execute (user role is 'client' from beforeEach)
        isTherapist(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          success: false,
          message: expect.any(String)
        }));
        expect(next).not.toHaveBeenCalled();
      });
    });

    describe('isSupport', () => {
      it('should allow support users', () => {
        // Setup
        req.user.role = 'support';

        // Execute
        isSupport(req, res, next);

        // Assert
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
      });

      it('should reject non-support users', () => {
        // Execute (user role is 'client' from beforeEach)
        isSupport(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          success: false,
          message: expect.any(String)
        }));
        expect(next).not.toHaveBeenCalled();
      });
    });
  });
});