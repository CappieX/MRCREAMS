const auditLogService = require('../services/auditLogService');
const encryptionService = require('../services/encryptionService');

/**
 * Middleware to log PHI access
 */
const logPHIAccess = (resourceType) => {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log PHI access
      if (req.user && data && data.success) {
        auditLogService.logPHIAccess(
          req.user.userId,
          'phi_access',
          resourceType,
          req.params.id || req.params.userId || 'multiple',
          {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            method: req.method
          }
        ).catch(error => {
          console.error('Failed to log PHI access:', error);
        });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to log data modifications
 */
const logDataModification = (tableName) => {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log data modification
      if (req.user && data && data.success) {
        const action = req.method === 'POST' ? 'create' : 
                      req.method === 'PUT' ? 'update' : 
                      req.method === 'DELETE' ? 'delete' : 'modify';
        
        auditLogService.logDataModification(
          req.user.userId,
          action,
          tableName,
          req.params.id || data.id || 'unknown',
          req.body, // old data (for updates, this would need to be fetched)
          data.data || req.body, // new data
          {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            method: req.method
          }
        ).catch(error => {
          console.error('Failed to log data modification:', error);
        });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Middleware to log authentication events
 */
const logAuthEvents = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Log authentication events
    if (req.path.includes('/auth/')) {
      const action = req.path.includes('/login') ? 'login' :
                    req.path.includes('/register') ? 'register' :
                    req.path.includes('/logout') ? 'logout' :
                    req.path.includes('/refresh') ? 'token_refresh' :
                    'auth_event';
      
      const success = data.success || false;
      const userId = data.data?.user?.id || req.user?.userId || null;
      
      auditLogService.logAuthEvent(
        userId,
        action,
        success,
        {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.path,
          method: req.method,
          error: data.message || null
        }
      ).catch(error => {
        console.error('Failed to log auth event:', error);
      });
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

/**
 * Middleware to encrypt PHI data before storage
 */
const encryptPHI = (phiFields) => {
  return async (req, res, next) => {
    try {
      if (req.body && req.user) {
        // Get user's PHI encryption password
        const { query } = require('../config/database');
        const userResult = await query(
          'SELECT phi_encryption_key FROM users WHERE id = $1',
          [req.user.userId]
        );
        
        if (userResult.rows.length > 0 && userResult.rows[0].phi_encryption_key) {
          const encryptionKey = userResult.rows[0].phi_encryption_key;
          
          // Encrypt PHI fields
          for (const field of phiFields) {
            if (req.body[field] && typeof req.body[field] === 'string') {
              const encrypted = encryptionService.encrypt(req.body[field], encryptionKey);
              req.body[`${field}_encrypted`] = JSON.stringify(encrypted);
              req.body[`${field}_hash`] = encryptionService.hashPHI(req.body[field]);
              delete req.body[field]; // Remove plain text
            }
          }
        }
      }
      
      next();
    } catch (error) {
      console.error('Encrypt PHI middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware to decrypt PHI data after retrieval
 */
const decryptPHI = (phiFields) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        // Get user's PHI encryption password
        const { query } = require('../config/database');
        const userResult = await query(
          'SELECT phi_encryption_key FROM users WHERE id = $1',
          [req.user.userId]
        );
        
        if (userResult.rows.length > 0 && userResult.rows[0].phi_encryption_key) {
          req.phiEncryptionKey = userResult.rows[0].phi_encryption_key;
        }
      }
      
      next();
    } catch (error) {
      console.error('Decrypt PHI middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware to check for suspicious activity
 */
const checkSuspiciousActivity = async (req, res, next) => {
  try {
    if (req.user) {
      const suspiciousPatterns = await auditLogService.checkSuspiciousActivity(req.user.userId);
      
      if (suspiciousPatterns.length > 0) {
        // Log suspicious activity
        auditLogService.logSystemEvent('suspicious_activity_detected', {
          userId: req.user.userId,
          patterns: suspiciousPatterns,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
        
        // For high severity patterns, consider additional security measures
        const highSeverityPatterns = suspiciousPatterns.filter(p => p.severity === 'high');
        if (highSeverityPatterns.length > 0) {
          // Could implement additional security measures here
          // such as requiring additional authentication, rate limiting, etc.
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Check suspicious activity middleware error:', error);
    next();
  }
};

/**
 * Middleware to enforce minimum necessary standard
 */
const enforceMinimumNecessary = (allowedFields) => {
  return (req, res, next) => {
    try {
      if (req.query.fields) {
        const requestedFields = req.query.fields.split(',');
        const unauthorizedFields = requestedFields.filter(field => !allowedFields.includes(field));
        
        if (unauthorizedFields.length > 0) {
          return res.status(403).json({
            success: false,
            message: 'Access denied: Requested fields exceed minimum necessary standard',
            code: 'MINIMUM_NECESSARY_VIOLATION',
            unauthorizedFields
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Enforce minimum necessary middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware to validate HIPAA compliance
 */
const validateHIPAACompliance = (req, res, next) => {
  try {
    // Check if user has signed BAA
    if (req.user && req.user.userType === 'therapist') {
      // This would check if therapist has signed BAA
      // Implementation would depend on how BAA is stored
    }
    
    // Check if request is from authorized source
    const authorizedSources = ['web', 'mobile', 'api'];
    const source = req.headers['x-source'] || 'web';
    
    if (!authorizedSources.includes(source)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Unauthorized source',
        code: 'UNAUTHORIZED_SOURCE'
      });
    }
    
    next();
  } catch (error) {
    console.error('Validate HIPAA compliance middleware error:', error);
    next(error);
  }
};

/**
 * Middleware to add security headers
 */
const addSecurityHeaders = (req, res, next) => {
  // HIPAA-compliant security headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  });
  
  next();
};

/**
 * Middleware to log data exports
 */
const logDataExport = (exportType) => {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log data export
      if (req.user && data && data.success) {
        auditLogService.logDataExport(
          req.user.userId,
          exportType,
          data.recordCount || 0,
          {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            method: req.method,
            format: req.query.format || 'json'
          }
        ).catch(error => {
          console.error('Failed to log data export:', error);
        });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  logPHIAccess,
  logDataModification,
  logAuthEvents,
  encryptPHI,
  decryptPHI,
  checkSuspiciousActivity,
  enforceMinimumNecessary,
  validateHIPAACompliance,
  addSecurityHeaders,
  logDataExport
};
