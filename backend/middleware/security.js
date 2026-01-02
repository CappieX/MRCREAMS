const helmet = require('helmet');
const SecurityService = require('../services/securityService');

/**
 * Configure Helmet security headers
 */
const configureSecurityHeaders = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    permissionsPolicy: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
      usb: [],
      magnetometer: [],
      gyroscope: [],
      accelerometer: []
    }
  });
};

/**
 * Request logging middleware
 */
const requestLogging = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
  
  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    
    // Log security events for error responses
    if (res.statusCode >= 400) {
      SecurityService.logSecurityEvent('error_response', {
        statusCode: res.statusCode,
        endpoint: req.path,
        method: req.method,
        duration: duration
      }, req);
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

/**
 * Security event logging middleware
 */
const securityEventLogging = (req, res, next) => {
  // Log suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//g, // Directory traversal
    /<script/gi, // XSS attempts
    /union\s+select/gi, // SQL injection
    /javascript:/gi, // JavaScript protocol
    /eval\s*\(/gi, // Code injection
    /document\.cookie/gi, // Cookie access
    /window\.location/gi // Location manipulation
  ];

  const input = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(input)) {
      SecurityService.logSecurityEvent('suspicious_request', {
        pattern: pattern.toString(),
        input: SecurityService.hashSensitiveData(input),
        endpoint: req.path,
        method: req.method
      }, req);
    }
  });

  next();
};

/**
 * IP-based security middleware
 */
const ipSecurity = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  // Check for suspicious IP patterns
  const suspiciousIPs = [
    /^0\.0\.0\.0$/, // Invalid IP
    /^127\.0\.0\.1$/, // Localhost (if not expected)
    /^::1$/, // IPv6 localhost
    /^192\.168\./, // Private network (if not expected)
    /^10\./, // Private network (if not expected)
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./ // Private network (if not expected)
  ];

  // Only flag as suspicious if not in development
  if (process.env.NODE_ENV === 'production') {
    suspiciousIPs.forEach(pattern => {
      if (pattern.test(ip)) {
        SecurityService.logSecurityEvent('suspicious_ip', {
          ip: ip,
          endpoint: req.path,
          method: req.method
        }, req);
      }
    });
  }

  next();
};

/**
 * User agent validation middleware
 */
const userAgentValidation = (req, res, next) => {
  const userAgent = req.get('User-Agent');
  
  if (!userAgent) {
    SecurityService.logSecurityEvent('missing_user_agent', {
      endpoint: req.path,
      method: req.method
    }, req);
    
    return res.status(400).json({
      success: false,
      message: 'User-Agent header is required',
      code: 'MISSING_USER_AGENT'
    });
  }

  // Check for suspicious user agents
  const suspiciousUserAgents = [
    /sqlmap/gi,
    /nikto/gi,
    /nmap/gi,
    /masscan/gi,
    /zap/gi,
    /burp/gi,
    /wget/gi,
    /curl/gi,
    /python/gi,
    /bot/gi,
    /crawler/gi,
    /spider/gi
  ];

  suspiciousUserAgents.forEach(pattern => {
    if (pattern.test(userAgent)) {
      SecurityService.logSecurityEvent('suspicious_user_agent', {
        userAgent: SecurityService.hashSensitiveData(userAgent),
        endpoint: req.path,
        method: req.method
      }, req);
    }
  });

  next();
};

/**
 * Request size limiting middleware
 */
const requestSizeLimit = (maxSize = 1024 * 1024) => { // 1MB default
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    
    if (contentLength > maxSize) {
      SecurityService.logSecurityEvent('request_too_large', {
        contentLength: contentLength,
        maxSize: maxSize,
        endpoint: req.path,
        method: req.method
      }, req);
      
      return res.status(413).json({
        success: false,
        message: 'Request too large',
        code: 'REQUEST_TOO_LARGE',
        maxSize: maxSize
      });
    }
    
    next();
  };
};

/**
 * Request frequency limiting middleware
 */
const requestFrequencyLimit = (windowMs = 60000, maxRequests = 100) => { // 1 minute, 100 requests
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    }
    
    // Count requests for this IP
    const ipRequests = Array.from(requests.entries())
      .filter(([key, timestamp]) => key.startsWith(ip) && timestamp >= windowStart)
      .length;
    
    if (ipRequests >= maxRequests) {
      SecurityService.logSecurityEvent('frequency_limit_exceeded', {
        ip: ip,
        requestCount: ipRequests,
        maxRequests: maxRequests,
        windowMs: windowMs,
        endpoint: req.path,
        method: req.method
      }, req);
      
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
        code: 'FREQUENCY_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    // Record this request
    requests.set(`${ip}-${now}`, now);
    
    next();
  };
};

/**
 * Session security middleware
 */
const sessionSecurity = (req, res, next) => {
  if (req.session) {
    // Regenerate session ID periodically
    if (!req.session.regeneratedAt || Date.now() - req.session.regeneratedAt > 300000) { // 5 minutes
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration error:', err);
        } else {
          req.session.regeneratedAt = Date.now();
        }
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

/**
 * HTTPS enforcement middleware
 */
const httpsEnforcement = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Check if request is secure
    if (!req.secure && req.get('X-Forwarded-Proto') !== 'https') {
      SecurityService.logSecurityEvent('insecure_request', {
        endpoint: req.path,
        method: req.method,
        protocol: req.protocol
      }, req);
      
      return res.redirect(301, `https://${req.get('Host')}${req.url}`);
    }
  }
  
  next();
};

/**
 * CORS security middleware
 */
const corsSecurity = (req, res, next) => {
  const origin = req.get('Origin');
  const defaultDevOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : defaultDevOrigins;
  
  if (origin && !allowedOrigins.includes(origin)) {
    SecurityService.logSecurityEvent('cors_violation', {
      origin: origin,
      allowedOrigins: allowedOrigins,
      endpoint: req.path,
      method: req.method
    }, req);
    
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      code: 'CORS_VIOLATION'
    });
  }
  
  next();
};

/**
 * API versioning middleware
 */
const apiVersioning = (req, res, next) => {
  const apiVersion =
    req.get('API-Version') ||
    req.get('X-API-Version') ||
    req.query.apiVersion ||
    'v1';

  if (apiVersion && !['v1'].includes(apiVersion)) {
    return res.status(400).json({
      success: false,
      message: 'Unsupported API version',
      code: 'UNSUPPORTED_API_VERSION',
      supportedVersions: ['v1']
    });
  }

  req.apiVersion = apiVersion;
  next();
};

/**
 * Error handling middleware
 */
const errorHandling = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Log security-related errors
  if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
    SecurityService.logSecurityEvent('connection_error', {
      error: err.message,
      code: err.code,
      endpoint: req.path,
      method: req.method
    }, req);
  }
  
  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: err.stack })
  });
};

/**
 * Security monitoring middleware
 */
const securityMonitoring = (req, res, next) => {
  // Monitor for potential attacks
  const attackPatterns = [
    { pattern: /\.\.\//g, type: 'directory_traversal' },
    { pattern: /<script/gi, type: 'xss' },
    { pattern: /union\s+select/gi, type: 'sql_injection' },
    { pattern: /javascript:/gi, type: 'javascript_injection' },
    { pattern: /eval\s*\(/gi, type: 'code_injection' },
    { pattern: /document\.cookie/gi, type: 'cookie_access' },
    { pattern: /window\.location/gi, type: 'location_manipulation' }
  ];

  const input = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
  
  attackPatterns.forEach(({ pattern, type }) => {
    if (pattern.test(input)) {
      SecurityService.logSecurityEvent('attack_pattern_detected', {
        attackType: type,
        pattern: pattern.toString(),
        input: SecurityService.hashSensitiveData(input),
        endpoint: req.path,
        method: req.method
      }, req);
    }
  });

  next();
};

module.exports = {
  configureSecurityHeaders,
  requestLogging,
  securityEventLogging,
  ipSecurity,
  userAgentValidation,
  requestSizeLimit,
  requestFrequencyLimit,
  sessionSecurity,
  httpsEnforcement,
  corsSecurity,
  apiVersioning,
  errorHandling,
  securityMonitoring
};
