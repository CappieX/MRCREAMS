const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const auditLogService = require('../services/auditLogService');
const encryptionService = require('../services/encryptionService');
const {
  logPHIAccess,
  logDataModification,
  logDataExport,
  addSecurityHeaders,
  validateHIPAACompliance
} = require('../middleware/hipaaCompliance');

// Apply HIPAA compliance middleware to all routes
router.use(addSecurityHeaders);
router.use(validateHIPAACompliance);

// Get audit logs for current user
router.get('/audit-logs', authenticateToken, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const userId = req.user.userId;

    const logs = await auditLogService.getUserAuditLogs(userId, limit, offset);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: logs.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get audit logs',
      code: 'AUDIT_LOGS_ERROR'
    });
  }
});

// Get audit logs for a specific resource
router.get('/audit-logs/resource/:resourceType/:resourceId', authenticateToken, async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const logs = await auditLogService.getResourceAuditLogs(resourceType, resourceId, limit, offset);

    res.json({
      success: true,
      data: {
        logs,
        resourceType,
        resourceId,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: logs.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get resource audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resource audit logs',
      code: 'RESOURCE_AUDIT_LOGS_ERROR'
    });
  }
});

// Generate audit report (admin only)
router.get('/audit-report', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
        code: 'MISSING_DATE_RANGE'
      });
    }

    const report = await auditLogService.generateAuditReport(
      new Date(startDate),
      new Date(endDate),
      userId
    );

    res.json({
      success: true,
      data: {
        report,
        dateRange: {
          startDate,
          endDate
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Generate audit report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate audit report',
      code: 'AUDIT_REPORT_ERROR'
    });
  }
});

// Check suspicious activity
router.get('/suspicious-activity', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hours = 24 } = req.query;

    const suspiciousPatterns = await auditLogService.checkSuspiciousActivity(userId, hours);

    res.json({
      success: true,
      data: {
        suspiciousPatterns,
        timeRange: `${hours} hours`,
        checkedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Check suspicious activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check suspicious activity',
      code: 'SUSPICIOUS_ACTIVITY_ERROR'
    });
  }
});

// Get failed login attempts
router.get('/failed-logins', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hours = 24 } = req.query;

    const failedAttempts = await auditLogService.getFailedLoginAttempts(userId, hours);

    res.json({
      success: true,
      data: {
        attemptCount: failedAttempts.attempt_count,
        lastAttempt: failedAttempts.last_attempt,
        timeRange: `${hours} hours`
      }
    });
  } catch (error) {
    console.error('Get failed login attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get failed login attempts',
      code: 'FAILED_LOGINS_ERROR'
    });
  }
});

// Generate PHI encryption key
router.post('/phi-encryption-key', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required for PHI encryption',
        code: 'MISSING_PASSWORD'
      });
    }

    // Generate secure encryption key
    const encryptionKey = encryptionService.generateSecurePassword();

    // Store encrypted key in database
    const { query } = require('../config/database');
    await query(
      'UPDATE users SET phi_encryption_key = $1, updated_at = NOW() WHERE id = $2',
      [encryptionKey, userId]
    );

    // Log encryption key generation
    await auditLogService.logSystemEvent('phi_encryption_key_generated', {
      userId: userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'PHI encryption key generated successfully',
      data: {
        keyGenerated: true,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Generate PHI encryption key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PHI encryption key',
      code: 'PHI_ENCRYPTION_KEY_ERROR'
    });
  }
});

// Export user data (GDPR/HIPAA compliance)
router.get('/export-data', authenticateToken, logDataExport('user_data'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { format = 'json' } = req.query;

    const { query } = require('../config/database');
    
    // Get all user data
    const userData = await query(
      `SELECT u.*, um.* FROM users u
       LEFT JOIN user_metadata um ON u.id = um.user_id
       WHERE u.id = $1`,
      [userId]
    );

    // Get emotion check-ins
    const emotionData = await query(
      'SELECT * FROM emotion_checkins WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Get conflicts
    const conflictData = await query(
      'SELECT * FROM conflicts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Get therapy sessions
    const sessionData = await query(
      'SELECT * FROM therapy_sessions WHERE client_id = $1 ORDER BY scheduled_at DESC',
      [userId]
    );

    const exportData = {
      user: userData.rows[0],
      emotionCheckins: emotionData.rows,
      conflicts: conflictData.rows,
      therapySessions: sessionData.rows,
      exportedAt: new Date().toISOString(),
      exportedBy: userId
    };

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(exportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}.csv"`);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}.json"`);
      res.json(exportData);
    }
  } catch (error) {
    console.error('Export user data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export user data',
      code: 'DATA_EXPORT_ERROR'
    });
  }
});

// Request data deletion (Right to erasure)
router.post('/request-deletion', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reason, confirmation } = req.body;

    if (!confirmation || confirmation !== 'DELETE_MY_DATA') {
      return res.status(400).json({
        success: false,
        message: 'Confirmation required. Please type "DELETE_MY_DATA" to confirm.',
        code: 'CONFIRMATION_REQUIRED'
      });
    }

    // Log deletion request
    await auditLogService.logDataDeletion(userId, 'user_account', userId, {
      reason: reason || 'User requested data deletion',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Mark account for deletion (don't actually delete yet for audit purposes)
    const { query } = require('../config/database');
    await query(
      `UPDATE users SET 
       status = 'pending_deletion',
       deletion_requested_at = NOW(),
       deletion_reason = $1,
       updated_at = NOW()
       WHERE id = $2`,
      [reason || 'User requested data deletion', userId]
    );

    res.json({
      success: true,
      message: 'Data deletion request submitted successfully. Your account will be deleted within 30 days.',
      data: {
        requestedAt: new Date().toISOString(),
        estimatedDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('Request data deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request data deletion',
      code: 'DATA_DELETION_ERROR'
    });
  }
});

// Get compliance status
router.get('/compliance-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { query } = require('../config/database');
    
    // Check if user has PHI encryption key
    const userResult = await query(
      'SELECT phi_encryption_key, status FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];
    const hasEncryptionKey = !!user.phi_encryption_key;
    const accountStatus = user.status;

    // Check recent audit logs
    const recentLogs = await auditLogService.getUserAuditLogs(userId, 10, 0);
    const hasRecentActivity = recentLogs.length > 0;

    // Check for suspicious activity
    const suspiciousPatterns = await auditLogService.checkSuspiciousActivity(userId, 24);

    const complianceStatus = {
      hipaaCompliant: hasEncryptionKey && accountStatus === 'active',
      gdprCompliant: accountStatus === 'active',
      encryptionEnabled: hasEncryptionKey,
      accountStatus: accountStatus,
      hasRecentActivity: hasRecentActivity,
      suspiciousActivityDetected: suspiciousPatterns.length > 0,
      lastActivity: recentLogs.length > 0 ? recentLogs[0].createdAt : null,
      complianceScore: calculateComplianceScore({
        hasEncryptionKey,
        accountStatus,
        hasRecentActivity,
        suspiciousPatterns: suspiciousPatterns.length
      })
    };

    res.json({
      success: true,
      data: {
        complianceStatus,
        checkedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get compliance status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get compliance status',
      code: 'COMPLIANCE_STATUS_ERROR'
    });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  const lines = [];
  
  // Add headers
  lines.push('Data Type,Field,Value');
  
  // Add user data
  if (data.user) {
    Object.entries(data.user).forEach(([key, value]) => {
      lines.push(`User,${key},"${value}"`);
    });
  }
  
  // Add emotion check-ins
  data.emotionCheckins.forEach((checkin, index) => {
    Object.entries(checkin).forEach(([key, value]) => {
      lines.push(`Emotion Check-in ${index + 1},${key},"${value}"`);
    });
  });
  
  // Add conflicts
  data.conflicts.forEach((conflict, index) => {
    Object.entries(conflict).forEach(([key, value]) => {
      lines.push(`Conflict ${index + 1},${key},"${value}"`);
    });
  });
  
  return lines.join('\n');
}

// Helper function to calculate compliance score
function calculateComplianceScore(factors) {
  let score = 0;
  
  if (factors.hasEncryptionKey) score += 30;
  if (factors.accountStatus === 'active') score += 25;
  if (factors.hasRecentActivity) score += 20;
  if (factors.suspiciousPatterns === 0) score += 25;
  
  return Math.min(100, score);
}

module.exports = router;
