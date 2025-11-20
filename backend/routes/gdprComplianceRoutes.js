const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const gdprComplianceService = require('../services/gdprComplianceService');
const {
  checkConsent,
  logDataProcessing,
  enforceDataMinimization,
  addGDPRHeaders,
  validateDataProcessingPurpose,
  checkDataRetentionCompliance,
  logConsentChanges,
  validateDataPortability,
  checkDataProcessingLawfulness
} = require('../middleware/gdprCompliance');

// Apply GDPR compliance middleware to all routes
router.use(addGDPRHeaders);

// Consent Management Routes

// Record user consent
router.post('/consent', authenticateToken, logConsentChanges, async (req, res) => {
  try {
    const { consentType, consentVersion, granted } = req.body;
    const userId = req.user.userId;

    if (!consentType || !consentVersion || typeof granted !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Consent type, version, and granted status are required',
        code: 'MISSING_CONSENT_DATA'
      });
    }

    const result = await gdprComplianceService.recordConsent(
      userId,
      consentType,
      consentVersion,
      granted,
      req.ip,
      req.get('User-Agent')
    );

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          consentType,
          consentVersion,
          granted,
          recordedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to record consent',
        code: 'CONSENT_RECORDING_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Record consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record consent',
      code: 'CONSENT_ERROR'
    });
  }
});

// Get user's current consent status
router.get('/consent/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await gdprComplianceService.getUserConsentStatus(userId);

    if (result.success) {
      res.json({
        success: true,
        data: {
          consentStatus: result.consentStatus,
          checkedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get consent status',
        code: 'CONSENT_STATUS_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get consent status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get consent status',
      code: 'CONSENT_STATUS_ERROR'
    });
  }
});

// Get user's consent history
router.get('/consent/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await gdprComplianceService.getUserConsentHistory(userId);

    if (result.success) {
      res.json({
        success: true,
        data: {
          history: result.history,
          checkedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get consent history',
        code: 'CONSENT_HISTORY_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get consent history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get consent history',
      code: 'CONSENT_HISTORY_ERROR'
    });
  }
});

// Revoke specific consent
router.post('/consent/revoke', authenticateToken, logConsentChanges, async (req, res) => {
  try {
    const { consentType } = req.body;
    const userId = req.user.userId;

    if (!consentType) {
      return res.status(400).json({
        success: false,
        message: 'Consent type is required',
        code: 'MISSING_CONSENT_TYPE'
      });
    }

    const result = await gdprComplianceService.revokeConsent(userId, consentType);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: {
          consentType,
          revokedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to revoke consent',
        code: 'CONSENT_REVOCATION_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Revoke consent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke consent',
      code: 'CONSENT_REVOCATION_ERROR'
    });
  }
});

// Data Export Routes (Right to Access)

// Export user data
router.get('/export-data', authenticateToken, validateDataPortability, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { format = 'json' } = req.query;

    const result = await gdprComplianceService.exportUserData(userId, format);

    if (result.success) {
      if (format === 'csv') {
        const csv = convertToCSV(result.data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}.csv"`);
        res.send(csv);
      } else if (format === 'xml') {
        const xml = convertToXML(result.data);
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}.xml"`);
        res.send(xml);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}.json"`);
        res.json(result.data);
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to export user data',
        code: 'DATA_EXPORT_ERROR',
        error: result.error
      });
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

// Data Deletion Routes (Right to Erasure)

// Request data deletion
router.post('/request-deletion', authenticateToken, async (req, res) => {
  try {
    const { reason, confirmation } = req.body;
    const userId = req.user.userId;

    const result = await gdprComplianceService.requestDataDeletion(userId, reason, confirmation);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          requestedAt: new Date().toISOString(),
          estimatedDeletionDate: result.estimatedDeletionDate
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        code: 'DATA_DELETION_REQUEST_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Request data deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request data deletion',
      code: 'DATA_DELETION_REQUEST_ERROR'
    });
  }
});

// Process data deletion (Admin only)
router.post('/process-deletion/:deletionRequestId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { deletionRequestId } = req.params;
    const processedBy = req.user.userId;

    const result = await gdprComplianceService.processDataDeletion(deletionRequestId, processedBy);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: {
          deletionRequestId,
          processedAt: new Date().toISOString(),
          processedBy
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        code: 'DATA_DELETION_PROCESSING_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Process data deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process data deletion',
      code: 'DATA_DELETION_PROCESSING_ERROR'
    });
  }
});

// Data Processing Activities Routes

// Get data processing activities
router.get('/data-processing-activities', async (req, res) => {
  try {
    const result = await gdprComplianceService.getDataProcessingActivities();

    if (result.success) {
      res.json({
        success: true,
        data: {
          activities: result.activities,
          retrievedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get data processing activities',
        code: 'DATA_PROCESSING_ACTIVITIES_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get data processing activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get data processing activities',
      code: 'DATA_PROCESSING_ACTIVITIES_ERROR'
    });
  }
});

// Update data processing activity (Admin only)
router.put('/data-processing-activities/:activityId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { activityId } = req.params;
    const updates = req.body;

    const result = await gdprComplianceService.updateDataProcessingActivity(activityId, updates);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: {
          activityId,
          updatedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update data processing activity',
        code: 'DATA_PROCESSING_ACTIVITY_UPDATE_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Update data processing activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update data processing activity',
      code: 'DATA_PROCESSING_ACTIVITY_UPDATE_ERROR'
    });
  }
});

// GDPR Compliance Status Routes

// Get GDPR compliance status
router.get('/compliance-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await gdprComplianceService.getGDPRComplianceStatus(userId);

    if (result.success) {
      res.json({
        success: true,
        data: {
          complianceStatus: result.complianceStatus,
          checkedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to get GDPR compliance status',
        code: 'GDPR_COMPLIANCE_STATUS_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Get GDPR compliance status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get GDPR compliance status',
      code: 'GDPR_COMPLIANCE_STATUS_ERROR'
    });
  }
});

// Generate GDPR compliance report (Admin only)
router.get('/compliance-report', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
        code: 'MISSING_DATE_RANGE'
      });
    }

    const result = await gdprComplianceService.generateGDPRComplianceReport(startDate, endDate);

    if (result.success) {
      res.json({
        success: true,
        data: {
          report: result.report,
          generatedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to generate GDPR compliance report',
        code: 'GDPR_COMPLIANCE_REPORT_ERROR',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Generate GDPR compliance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate GDPR compliance report',
      code: 'GDPR_COMPLIANCE_REPORT_ERROR'
    });
  }
});

// Helper functions

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
  
  // Add consent records
  data.consentRecords.forEach((consent, index) => {
    Object.entries(consent).forEach(([key, value]) => {
      lines.push(`Consent Record ${index + 1},${key},"${value}"`);
    });
  });
  
  return lines.join('\n');
}

function convertToXML(data) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<userData>\n';
  
  // Add user data
  if (data.user) {
    xml += '  <user>\n';
    Object.entries(data.user).forEach(([key, value]) => {
      xml += `    <${key}>${value}</${key}>\n`;
    });
    xml += '  </user>\n';
  }
  
  // Add emotion check-ins
  xml += '  <emotionCheckins>\n';
  data.emotionCheckins.forEach((checkin, index) => {
    xml += `    <checkin id="${index + 1}">\n`;
    Object.entries(checkin).forEach(([key, value]) => {
      xml += `      <${key}>${value}</${key}>\n`;
    });
    xml += '    </checkin>\n';
  });
  xml += '  </emotionCheckins>\n';
  
  // Add conflicts
  xml += '  <conflicts>\n';
  data.conflicts.forEach((conflict, index) => {
    xml += `    <conflict id="${index + 1}">\n`;
    Object.entries(conflict).forEach(([key, value]) => {
      xml += `      <${key}>${value}</${key}>\n`;
    });
    xml += '    </conflict>\n';
  });
  xml += '  </conflicts>\n';
  
  // Add consent records
  xml += '  <consentRecords>\n';
  data.consentRecords.forEach((consent, index) => {
    xml += `    <consent id="${index + 1}">\n`;
    Object.entries(consent).forEach(([key, value]) => {
      xml += `      <${key}>${value}</${key}>\n`;
    });
    xml += '    </consent>\n';
  });
  xml += '  </consentRecords>\n';
  
  xml += '</userData>';
  return xml;
}

module.exports = router;
