const apiKeyService = require('../services/apiKeyService');

/**
 * Middleware to authenticate API requests using API keys
 */
const authenticateAPIKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key required',
        code: 'MISSING_API_KEY'
      });
    }

    const validation = await apiKeyService.validateAPIKey(apiKey);
    
    if (!validation.valid) {
      return res.status(401).json({
        success: false,
        message: validation.message,
        code: 'INVALID_API_KEY',
        retryAfter: validation.retryAfter
      });
    }

    // Attach API key data to request
    req.apiKey = validation.data;
    req.user = validation.data.user;
    
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'API authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to check API permissions
 */
const checkAPIPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.apiKey) {
        return res.status(401).json({
          success: false,
          message: 'API key authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const userPermissions = req.apiKey.permissions;
      
      // Check if user has all required permissions
      const hasPermission = requiredPermissions.every(permission => 
        userPermissions.includes(permission) || userPermissions.includes('*')
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: requiredPermissions,
          current: userPermissions
        });
      }

      next();
    } catch (error) {
      console.error('API permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed',
        code: 'PERMISSION_ERROR'
      });
    }
  };
};

/**
 * Middleware to log API usage
 */
const logAPIUsage = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Log API usage asynchronously
    if (req.apiKey) {
      apiKeyService.logAPIUsage(
        req.apiKey.keyId,
        req.path,
        req.method,
        responseTime,
        res.statusCode
      ).catch(error => {
        console.error('Error logging API usage:', error);
      });
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

/**
 * Middleware to apply API rate limiting
 */
const apiRateLimit = (req, res, next) => {
  if (!req.apiKey) {
    return next(); // Let other middleware handle authentication
  }

  apiKeyService.checkRateLimit(req.apiKey.keyId)
    .then(rateLimitCheck => {
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          success: false,
          message: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitCheck.retryAfter,
          currentUsage: rateLimitCheck.currentUsage,
          rateLimit: rateLimitCheck.rateLimit
        });
      }

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': rateLimitCheck.rateLimit,
        'X-RateLimit-Remaining': Math.max(0, rateLimitCheck.rateLimit - rateLimitCheck.currentUsage),
        'X-RateLimit-Reset': new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      });

      next();
    })
    .catch(error => {
      console.error('Rate limit check error:', error);
      next(); // Continue on error
    });
};

/**
 * Middleware to validate API version
 */
const validateAPIVersion = (req, res, next) => {
  const apiVersion = req.headers['x-api-version'] || req.query.version || 'v1';
  
  // Validate API version
  const supportedVersions = ['v1'];
  if (!supportedVersions.includes(apiVersion)) {
    return res.status(400).json({
      success: false,
      message: 'Unsupported API version',
      code: 'UNSUPPORTED_VERSION',
      supportedVersions
    });
  }

  req.apiVersion = apiVersion;
  next();
};

/**
 * Middleware to add API response headers
 */
const addAPIHeaders = (req, res, next) => {
  res.set({
    'X-API-Version': req.apiVersion || 'v1',
    'X-Request-ID': req.headers['x-request-id'] || generateRequestId(),
    'X-Response-Time': '0ms' // Will be updated by response time middleware
  });
  
  next();
};

/**
 * Middleware to handle API errors consistently
 */
const handleAPIErrors = (err, req, res, next) => {
  console.error('API Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
    code = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
    code = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not found';
    code = 'NOT_FOUND';
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware to validate request format
 */
const validateRequestFormat = (req, res, next) => {
  // Check Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        message: 'Content-Type must be application/json',
        code: 'INVALID_CONTENT_TYPE'
      });
    }
  }

  next();
};

/**
 * Generate unique request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  authenticateAPIKey,
  checkAPIPermissions,
  logAPIUsage,
  apiRateLimit,
  validateAPIVersion,
  addAPIHeaders,
  handleAPIErrors,
  validateRequestFormat
};
