const { body, param, query, validationResult } = require('express-validator');
const SecurityService = require('../services/securityService');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

/**
 * Sanitize input middleware
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize params
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return SecurityService.sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Security validation middleware
 */
const securityValidation = (req, res, next) => {
  const input = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
  
  // Check for SQL injection
  if (SecurityService.detectSQLInjection(input)) {
    SecurityService.logSecurityEvent('sql_injection_attempt', {
      input: SecurityService.hashSensitiveData(input),
      endpoint: req.path,
      method: req.method
    }, req);
    
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected',
      code: 'SECURITY_VIOLATION'
    });
  }

  // Check for XSS
  if (SecurityService.detectXSS(input)) {
    SecurityService.logSecurityEvent('xss_attempt', {
      input: SecurityService.hashSensitiveData(input),
      endpoint: req.path,
      method: req.method
    }, req);
    
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected',
      code: 'SECURITY_VIOLATION'
    });
  }

  // Check for suspicious patterns
  if (SecurityService.detectSuspiciousPatterns(input)) {
    SecurityService.logSecurityEvent('suspicious_pattern', {
      input: SecurityService.hashSensitiveData(input),
      endpoint: req.path,
      method: req.method
    }, req);
    
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected',
      code: 'SECURITY_VIOLATION'
    });
  }

  next();
};

/**
 * Validate payload size
 */
const validatePayloadSize = (maxSize = 1024 * 1024) => {
  return (req, res, next) => {
    const validation = SecurityService.validatePayloadSize(req.body, maxSize);
    
    if (!validation.isValid) {
      return res.status(413).json({
        success: false,
        message: 'Payload too large',
        code: 'PAYLOAD_TOO_LARGE',
        size: validation.size,
        maxSize: validation.maxSize
      });
    }
    
    next();
  };
};

/**
 * Validate file upload
 */
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (req.file) {
      const validation = SecurityService.validateFileUpload(req.file, allowedTypes, maxSize);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          code: 'FILE_VALIDATION_ERROR',
          errors: validation.errors
        });
      }
    }
    
    next();
  };
};

/**
 * Validate IP address
 */
const validateIPAddress = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (!SecurityService.validateIPAddress(ip)) {
    SecurityService.logSecurityEvent('invalid_ip', {
      ip: ip,
      endpoint: req.path,
      method: req.method
    }, req);
    
    return res.status(400).json({
      success: false,
      message: 'Invalid IP address',
      code: 'INVALID_IP'
    });
  }
  
  next();
};

/**
 * Check IP whitelist
 */
const checkIPWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    
    if (!SecurityService.isIPAllowed(ip, allowedIPs)) {
      SecurityService.logSecurityEvent('ip_not_allowed', {
        ip: ip,
        endpoint: req.path,
        method: req.method
      }, req);
      
      return res.status(403).json({
        success: false,
        message: 'IP address not allowed',
        code: 'IP_NOT_ALLOWED'
      });
    }
    
    next();
  };
};

/**
 * CSRF protection middleware
 */
const csrfProtection = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session ? req.session.csrfToken : null;

  if (!SecurityService.validateCSRFToken(token, sessionToken)) {
    SecurityService.logSecurityEvent('csrf_attack', {
      token: token ? SecurityService.hashSensitiveData(token) : null,
      endpoint: req.path,
      method: req.method
    }, req);
    
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed',
      code: 'CSRF_TOKEN_INVALID'
    });
  }

  next();
};

/**
 * User registration validation
 */
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required')
    .custom(value => {
      if (!SecurityService.validateEmail(value)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom(value => {
      const validation = SecurityService.validatePassword(value);
      if (!validation.isValid) {
        throw new Error('Password does not meet security requirements');
      }
      return true;
    }),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  body('userType')
    .isIn(['user', 'therapist', 'admin'])
    .withMessage('Valid user type is required'),
  handleValidationErrors
];

/**
 * User login validation
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Password reset validation
 */
const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  handleValidationErrors
];

/**
 * Password change validation
 */
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .custom(value => {
      const validation = SecurityService.validatePassword(value);
      if (!validation.isValid) {
        throw new Error('New password does not meet security requirements');
      }
      return true;
    }),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
  handleValidationErrors
];

/**
 * UUID parameter validation
 */
const validateUUID = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(`Valid ${paramName} is required`),
  handleValidationErrors
];

/**
 * Emotion check-in validation
 */
const validateEmotionCheckin = [
  body('emotions')
    .isArray({ min: 1 })
    .withMessage('At least one emotion is required'),
  body('emotions.*')
    .isIn(['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'anxiety', 'calm', 'excited', 'frustrated'])
    .withMessage('Valid emotion type is required'),
  body('intensity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Intensity must be between 1 and 10'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  handleValidationErrors
];

/**
 * Conflict creation validation
 */
const validateConflictCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description is required and must be less than 2000 characters'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Valid severity level is required'),
  body('category')
    .isIn(['communication', 'trust', 'intimacy', 'finances', 'family', 'work', 'other'])
    .withMessage('Valid category is required'),
  handleValidationErrors
];

/**
 * Support ticket validation
 */
const validateSupportTicket = [
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject is required and must be less than 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description is required and must be less than 2000 characters'),
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Valid priority level is required'),
  body('category')
    .isIn(['technical', 'billing', 'feature_request', 'bug_report', 'general'])
    .withMessage('Valid category is required'),
  handleValidationErrors
];

/**
 * Therapist profile validation
 */
const validateTherapistProfile = [
  body('licenseNumber')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('License number is required'),
  body('specialties')
    .isArray({ min: 1 })
    .withMessage('At least one specialty is required'),
  body('specialties.*')
    .isIn(['individual_therapy', 'couples_therapy', 'family_therapy', 'group_therapy', 'trauma_therapy', 'anxiety_therapy', 'depression_therapy', 'other'])
    .withMessage('Valid specialty is required'),
  body('experience')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('bio')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Bio must be less than 2000 characters'),
  handleValidationErrors
];

/**
 * Session creation validation
 */
const validateSessionCreation = [
  body('clientId')
    .isUUID()
    .withMessage('Valid client ID is required'),
  body('scheduledAt')
    .isISO8601()
    .withMessage('Valid scheduled date is required'),
  body('duration')
    .isInt({ min: 15, max: 180 })
    .withMessage('Duration must be between 15 and 180 minutes'),
  body('sessionType')
    .isIn(['individual', 'couples', 'family', 'group'])
    .withMessage('Valid session type is required'),
  handleValidationErrors
];

/**
 * API key validation
 */
const validateAPIKey = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('API key name is required and must be less than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('rateLimit')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Rate limit must be between 1 and 10000 requests per minute'),
  handleValidationErrors
];

/**
 * Query parameter validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'name', 'email'])
    .withMessage('Valid sort field is required'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

/**
 * Date range validation
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  query('startDate')
    .custom((value, { req }) => {
      if (value && req.query.endDate && new Date(value) > new Date(req.query.endDate)) {
        throw new Error('Start date must be before end date');
      }
      return true;
    }),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  sanitizeInput,
  securityValidation,
  validatePayloadSize,
  validateFileUpload,
  validateIPAddress,
  checkIPWhitelist,
  csrfProtection,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validatePasswordChange,
  validateUUID,
  validateEmotionCheckin,
  validateConflictCreation,
  validateSupportTicket,
  validateTherapistProfile,
  validateSessionCreation,
  validateAPIKey,
  validatePagination,
  validateDateRange
};
