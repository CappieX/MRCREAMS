const { verifyToken } = require('../services/authService');
const { query } = require('../config/database');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (decoded.type !== 'session') {
      return res.status(401).json({ 
        error: 'Invalid token type',
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    // Get user from database
    const userResult = await query(`
      SELECT u.*, o.name as organization_name, o.code as organization_code
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      WHERE u.id = $1 AND u.is_active = true
    `, [decoded.userId]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Check if email is verified (for non-admin users)
    if (!user.email_verified && !['super_admin', 'admin', 'it_admin', 'platform_admin'].includes(user.user_type)) {
      return res.status(401).json({ 
        error: 'Email verification required',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.user_type,
      organizationId: user.organization_id,
      organizationName: user.organization_name,
      organizationCode: user.organization_code,
      onboardingCompleted: user.onboarding_completed,
      emailVerified: user.email_verified,
      isAdmin: ['super_admin', 'admin', 'it_admin', 'platform_admin'].includes(user.user_type),
      isSuperAdmin: user.user_type === 'super_admin',
      isPlatformAdmin: user.user_type === 'platform_admin',
      isTherapist: user.user_type === 'therapist',
      isSupport: ['support', 'super_admin', 'admin', 'platform_admin'].includes(user.user_type)
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Role-based access control middleware
 * Checks if user has required role(s)
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.userType;
    const isAllowed = Array.isArray(allowedRoles) 
      ? allowedRoles.includes(userRole)
      : allowedRoles === userRole;

    if (!isAllowed) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

/**
 * Organization access control middleware
 * Ensures user can only access resources from their organization
 */
const requireOrganizationAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  // Super admins can access all organizations
  if (req.user.isSuperAdmin) {
    return next();
  }

  // For other users, check organization access
  const resourceOrgId = req.params.organizationId || req.body.organizationId;
  
  if (resourceOrgId && resourceOrgId !== req.user.organizationId) {
    return res.status(403).json({ 
      error: 'Access denied to this organization',
      code: 'ORGANIZATION_ACCESS_DENIED'
    });
  }

  next();
};

/**
 * Resource ownership middleware
 * Ensures user can only access their own resources
 */
const requireOwnership = (resourceUserIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Admins can access all resources
    if (req.user.isAdmin) {
      return next();
    }

    const resourceUserId = req.params[resourceUserIdParam] || req.body[resourceUserIdParam];
    
    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({ 
        error: 'Access denied to this resource',
        code: 'RESOURCE_ACCESS_DENIED'
      });
    }

    next();
  };
};

/**
 * Email verification middleware
 * Ensures user's email is verified
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({ 
      error: 'Email verification required',
      code: 'EMAIL_VERIFICATION_REQUIRED'
    });
  }

  next();
};

/**
 * Onboarding completion middleware
 * Ensures user has completed onboarding
 */
const requireOnboardingCompletion = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.onboardingCompleted) {
    return res.status(403).json({ 
      error: 'Onboarding completion required',
      code: 'ONBOARDING_REQUIRED'
    });
  }

  next();
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (decoded.type !== 'session') {
      req.user = null;
      return next();
    }

    // Get user from database
    const userResult = await query(`
      SELECT u.*, o.name as organization_name, o.code as organization_code
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      WHERE u.id = $1 AND u.is_active = true
    `, [decoded.userId]);

    if (userResult.rows.length === 0) {
      req.user = null;
      return next();
    }

    const user = userResult.rows[0];

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.user_type,
      organizationId: user.organization_id,
      organizationName: user.organization_name,
      organizationCode: user.organization_code,
      onboardingCompleted: user.onboarding_completed,
      emailVerified: user.email_verified,
      isAdmin: ['super_admin', 'admin', 'it_admin'].includes(user.user_type),
      isSuperAdmin: user.user_type === 'super_admin',
      isTherapist: user.user_type === 'therapist',
      isSupport: ['support', 'super_admin', 'admin'].includes(user.user_type)
    };

    next();
  } catch (error) {
    // If token verification fails, just set user to null
    req.user = null;
    next();
  }
};

/**
 * Rate limiting middleware for sensitive operations
 */
const sensitiveOperationRateLimit = (req, res, next) => {
  // This would integrate with a rate limiting library like express-rate-limit
  // For now, we'll just pass through
  next();
};

/**
 * Audit logging middleware
 * Logs user actions for compliance
 */
const auditLog = (action, resourceType) => {
  return async (req, res, next) => {
    // Store original res.json
    const originalJson = res.json;
    
    // Override res.json to capture response
    res.json = function(data) {
      // Log the action after response is sent
      setImmediate(async () => {
        try {
          if (req.user) {
            await query(`
              INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, ip_address, user_agent, organization_id)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
              req.user.id,
              action,
              resourceType,
              req.params.id || req.body.id,
              JSON.stringify(req.body),
              req.ip,
              req.get('User-Agent'),
              req.user.organizationId
            ]);
          }
        } catch (error) {
          console.error('Audit logging error:', error);
        }
      });
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOrganizationAccess,
  requireOwnership,
  requireEmailVerification,
  requireOnboardingCompletion,
  optionalAuth,
  sensitiveOperationRateLimit,
  auditLog
};