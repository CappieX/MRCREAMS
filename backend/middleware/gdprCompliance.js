const gdprComplianceService = require('../services/gdprComplianceService');

/**
 * Middleware to check consent before processing data
 */
const checkConsent = (consentType) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        const hasConsent = await gdprComplianceService.hasValidConsent(req.user.userId, consentType);
        
        if (!hasConsent) {
          return res.status(403).json({
            success: false,
            message: 'Consent required for data processing',
            code: 'CONSENT_REQUIRED',
            consentType: consentType
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Check consent middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware to log data processing activities
 */
const logDataProcessing = (activityName, dataCategories) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        // Log data processing activity
        const { query } = require('../config/database');
        await query(
          `INSERT INTO audit_logs (user_id, action, resource_type, details, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [
            req.user.userId,
            'data_processing',
            activityName,
            JSON.stringify({
              dataCategories,
              endpoint: req.path,
              method: req.method,
              ipAddress: req.ip,
              userAgent: req.get('User-Agent')
            })
          ]
        );
      }
      
      next();
    } catch (error) {
      console.error('Log data processing middleware error:', error);
      next();
    }
  };
};

/**
 * Middleware to enforce data minimization
 */
const enforceDataMinimization = (allowedFields) => {
  return (req, res, next) => {
    try {
      // Filter request body to only include allowed fields
      if (req.body && typeof req.body === 'object') {
        const filteredBody = {};
        allowedFields.forEach(field => {
          if (req.body.hasOwnProperty(field)) {
            filteredBody[field] = req.body[field];
          }
        });
        req.body = filteredBody;
      }
      
      next();
    } catch (error) {
      console.error('Enforce data minimization middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware to add GDPR headers
 */
const addGDPRHeaders = (req, res, next) => {
  res.set({
    'X-GDPR-Compliant': 'true',
    'X-Data-Processing': 'consent-based',
    'X-Data-Retention': 'policy-based',
    'X-Data-Export': 'available',
    'X-Data-Deletion': 'available'
  });
  
  next();
};

/**
 * Middleware to validate data processing purpose
 */
const validateDataProcessingPurpose = (allowedPurposes) => {
  return (req, res, next) => {
    try {
      const purpose = req.headers['x-data-purpose'] || req.body.purpose;
      
      if (purpose && !allowedPurposes.includes(purpose)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid data processing purpose',
          code: 'INVALID_PURPOSE',
          allowedPurposes
        });
      }
      
      next();
    } catch (error) {
      console.error('Validate data processing purpose middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware to check data retention compliance
 */
const checkDataRetentionCompliance = async (req, res, next) => {
  try {
    if (req.user) {
      const { query } = require('../config/database');
      
      // Check if user's data exceeds retention period
      const retentionCheck = await query(
        `SELECT 
           u.created_at,
           drp.retention_period_days,
           drp.data_type
         FROM users u
         CROSS JOIN data_retention_policies drp
         WHERE u.id = $1 AND drp.data_type = 'user_data' AND drp.is_active = true`,
        [req.user.userId]
      );
      
      if (retentionCheck.rows.length > 0) {
        const { created_at, retention_period_days } = retentionCheck.rows[0];
        const retentionDate = new Date(created_at);
        retentionDate.setDate(retentionDate.getDate() + retention_period_days);
        
        if (new Date() > retentionDate) {
          return res.status(410).json({
            success: false,
            message: 'Data retention period exceeded',
            code: 'DATA_RETENTION_EXCEEDED',
            retentionDate: retentionDate.toISOString()
          });
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Check data retention compliance middleware error:', error);
    next();
  }
};

/**
 * Middleware to anonymize data for analytics
 */
const anonymizeData = (fieldsToAnonymize) => {
  return (req, res, next) => {
    try {
      if (req.body && typeof req.body === 'object') {
        fieldsToAnonymize.forEach(field => {
          if (req.body[field]) {
            // Simple anonymization - replace with hash
            const crypto = require('crypto');
            req.body[`${field}_anonymized`] = crypto.createHash('sha256')
              .update(req.body[field])
              .digest('hex')
              .substring(0, 8);
            delete req.body[field];
          }
        });
      }
      
      next();
    } catch (error) {
      console.error('Anonymize data middleware error:', error);
      next(error);
    }
  };
};

/**
 * Middleware to log consent changes
 */
const logConsentChanges = async (req, res, next) => {
  try {
    if (req.user && req.path.includes('/consent')) {
      const originalJson = res.json;
      
      res.json = function(data) {
        // Log consent changes
        if (data && data.success) {
          const { query } = require('../config/database');
          query(
            `INSERT INTO audit_logs (user_id, action, resource_type, details, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [
              req.user.userId,
              'consent_change',
              'consent_records',
              JSON.stringify({
                endpoint: req.path,
                method: req.method,
                ipAddress: req.ip,
                userAgent: req.get('User-Agent'),
                consentData: req.body
              })
            ]
          ).catch(error => {
            console.error('Failed to log consent change:', error);
          });
        }
        
        return originalJson.call(this, data);
      };
    }
    
    next();
  } catch (error) {
    console.error('Log consent changes middleware error:', error);
    next();
  }
};

/**
 * Middleware to validate data portability
 */
const validateDataPortability = (req, res, next) => {
  try {
    const format = req.query.format || 'json';
    const allowedFormats = ['json', 'csv', 'xml'];
    
    if (!allowedFormats.includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid export format',
        code: 'INVALID_FORMAT',
        allowedFormats
      });
    }
    
    next();
  } catch (error) {
    console.error('Validate data portability middleware error:', error);
    next(error);
  }
};

/**
 * Middleware to check data processing lawfulness
 */
const checkDataProcessingLawfulness = (legalBasis) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        const { query } = require('../config/database');
        
        // Check if data processing is lawful based on legal basis
        const lawfulnessCheck = await query(
          `SELECT legal_basis FROM data_processing_activities 
           WHERE is_active = true AND legal_basis = $1`,
          [legalBasis]
        );
        
        if (lawfulnessCheck.rows.length === 0) {
          return res.status(403).json({
            success: false,
            message: 'Data processing not lawful under specified legal basis',
            code: 'UNLAWFUL_PROCESSING',
            legalBasis
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Check data processing lawfulness middleware error:', error);
      next(error);
    }
  };
};

module.exports = {
  checkConsent,
  logDataProcessing,
  enforceDataMinimization,
  addGDPRHeaders,
  validateDataProcessingPurpose,
  checkDataRetentionCompliance,
  anonymizeData,
  logConsentChanges,
  validateDataPortability,
  checkDataProcessingLawfulness
};
