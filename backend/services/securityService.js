const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const { body, param, query, validationResult } = require('express-validator');

class SecurityService {
  /**
   * Create rate limiter with custom configuration
   */
  static createRateLimiter(options = {}) {
    const defaultOptions = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(options.windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: 'Too many requests from this IP, please try again later',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(options.windowMs / 1000)
        });
      }
    };

    return rateLimit({ ...defaultOptions, ...options });
  }

  /**
   * Create strict rate limiter for sensitive endpoints
   */
  static createStrictRateLimiter() {
    return this.createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit to 5 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests to sensitive endpoint, please try again later',
        code: 'STRICT_RATE_LIMIT_EXCEEDED'
      }
    });
  }

  /**
   * Create auth rate limiter for login attempts
   */
  static createAuthRateLimiter() {
    return this.createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit to 5 login attempts per windowMs
      message: {
        success: false,
        message: 'Too many login attempts, please try again later',
        code: 'AUTH_RATE_LIMIT_EXCEEDED'
      },
      skipSuccessfulRequests: true // Don't count successful requests
    });
  }

  /**
   * Create API rate limiter for public API endpoints
   */
  static createAPIRateLimiter(maxRequests = 1000) {
    return this.createRateLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: maxRequests,
      message: {
        success: false,
        message: 'API rate limit exceeded, please try again later',
        code: 'API_RATE_LIMIT_EXCEEDED'
      }
    });
  }

  /**
   * Sanitize input data
   */
  static sanitizeInput(input) {
    if (typeof input === 'string') {
      // Remove potentially dangerous characters
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
    }
    return input;
  }

  /**
   * Validate email format
   */
  static validateEmail(email) {
    return validator.isEmail(email) && email.length <= 254;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  }

  /**
   * Validate UUID format
   */
  static validateUUID(uuid) {
    return validator.isUUID(uuid);
  }

  /**
   * Validate SQL injection patterns
   */
  static detectSQLInjection(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
      /(UNION\s+SELECT)/i,
      /(;\s*DROP\s+TABLE)/i,
      /(;\s*DELETE\s+FROM)/i,
      /(;\s*INSERT\s+INTO)/i,
      /(;\s*UPDATE\s+SET)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Validate XSS patterns
   */
  static detectXSS(input) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
      /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Generate secure random string
   */
  static generateSecureToken(length = 32) {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash sensitive data for logging
   */
  static hashSensitiveData(data) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
  }

  /**
   * Validate file upload
   */
  static validateFileUpload(file, allowedTypes = [], maxSize = 5 * 1024 * 1024) {
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    if (file.size > maxSize) {
      errors.push(`File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB`);
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not allowed`);
    }

    // Check for malicious file extensions
    const maliciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (maliciousExtensions.includes(fileExtension)) {
      errors.push('File type is not allowed for security reasons');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate JSON payload size
   */
  static validatePayloadSize(payload, maxSize = 1024 * 1024) { // 1MB default
    let serialized;
    try {
      if (payload === undefined || payload === null) {
        serialized = '';
      } else {
        serialized = JSON.stringify(payload);
      }
    } catch (e) {
      // Fallback for circular structures or non-serializable payloads
      serialized = String(payload ?? '');
    }

    const payloadSize = typeof serialized === 'string' ? serialized.length : 0;
    return {
      isValid: payloadSize <= maxSize,
      size: payloadSize,
      maxSize
    };
  }

  /**
   * Check for suspicious patterns in user input
   */
  static detectSuspiciousPatterns(input) {
    const suspiciousPatterns = [
      /eval\s*\(/gi,
      /function\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /document\./gi,
      /window\./gi,
      /alert\s*\(/gi,
      /confirm\s*\(/gi,
      /prompt\s*\(/gi
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Validate IP address
   */
  static validateIPAddress(ip) {
    return validator.isIP(ip);
  }

  /**
   * Check if IP is in allowed range
   */
  static isIPAllowed(ip, allowedRanges = []) {
    if (allowedRanges.length === 0) return true;
    
    return allowedRanges.some(range => {
      if (range.includes('/')) {
        // CIDR notation
        const ipaddr = require('ipaddr.js');
        try {
          const addr = ipaddr.process(ip);
          const rangeAddr = ipaddr.processCIDR(range);
          return addr.match(rangeAddr);
        } catch (e) {
          return false;
        }
      } else {
        // Exact match
        return ip === range;
      }
    });
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token, sessionToken) {
    return token && sessionToken && token === sessionToken;
  }

  /**
   * Log security events
   */
  static logSecurityEvent(eventType, details, req) {
    const { query } = require('../config/database');
    
    query(
      `INSERT INTO security_events (event_type, details, ip_address, user_agent, user_id, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        eventType,
        JSON.stringify(details),
        req.ip,
        req.get('User-Agent'),
        req.user ? req.user.userId : null
      ]
    ).catch(error => {
      console.error('Failed to log security event:', error);
    });
  }
}

module.exports = SecurityService;
