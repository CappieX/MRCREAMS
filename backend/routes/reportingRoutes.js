const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const reportingService = require('../services/reportingService');

// Generate executive dashboard report
router.get('/executive/:organizationId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { timeRange = '30d', format = 'json' } = req.query;

    const report = await reportingService.generateExecutiveReport(organizationId, timeRange);

    if (format === 'json') {
      res.json({
        success: true,
        data: report
      });
    } else {
      const exportedReport = await reportingService.exportReport(report, format);
      res.setHeader('Content-Type', getContentType(format));
      res.setHeader('Content-Disposition', `attachment; filename="${exportedReport.filename}"`);
      res.send(exportedReport.content);
    }
  } catch (error) {
    console.error('Executive report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate executive report'
    });
  }
});

// Generate therapist performance report
router.get('/therapist/:therapistId', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { therapistId } = req.params;
    const { timeRange = '30d', format = 'json' } = req.query;
    const requestingUserId = req.user.userId;

    // Check if user can access this report (own data or admin)
    if (therapistId !== requestingUserId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own reports.'
      });
    }

    const report = await reportingService.generateTherapistReport(therapistId, timeRange);

    if (format === 'json') {
      res.json({
        success: true,
        data: report
      });
    } else {
      const exportedReport = await reportingService.exportReport(report, format);
      res.setHeader('Content-Type', getContentType(format));
      res.setHeader('Content-Disposition', `attachment; filename="${exportedReport.filename}"`);
      res.send(exportedReport.content);
    }
  } catch (error) {
    console.error('Therapist report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate therapist report'
    });
  }
});

// Generate client progress report
router.get('/client/:clientId', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { clientId } = req.params;
    const { timeRange = '30d', format = 'json' } = req.query;
    const requestingUserId = req.user.userId;

    // Check if user can access this report (therapist with this client or admin)
    if (req.user.userType !== 'admin') {
      // Check if the requesting therapist has sessions with this client
      const { query } = require('../config/database');
      const clientCheck = await query(
        'SELECT COUNT(*) as count FROM therapy_sessions WHERE therapist_id = $1 AND client_id = $2',
        [requestingUserId, clientId]
      );

      if (parseInt(clientCheck.rows[0].count) === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only view reports for your own clients.'
        });
      }
    }

    const report = await reportingService.generateClientReport(clientId, timeRange);

    if (format === 'json') {
      res.json({
        success: true,
        data: report
      });
    } else {
      const exportedReport = await reportingService.exportReport(report, format);
      res.setHeader('Content-Type', getContentType(format));
      res.setHeader('Content-Disposition', `attachment; filename="${exportedReport.filename}"`);
      res.send(exportedReport.content);
    }
  } catch (error) {
    console.error('Client report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate client report'
    });
  }
});

// Generate my therapist report (for current user)
router.get('/my-therapist-report', authenticateToken, requireRole(['therapist']), async (req, res) => {
  try {
    const therapistId = req.user.userId;
    const { timeRange = '30d', format = 'json' } = req.query;

    const report = await reportingService.generateTherapistReport(therapistId, timeRange);

    if (format === 'json') {
      res.json({
        success: true,
        data: report
      });
    } else {
      const exportedReport = await reportingService.exportReport(report, format);
      res.setHeader('Content-Type', getContentType(format));
      res.setHeader('Content-Disposition', `attachment; filename="${exportedReport.filename}"`);
      res.send(exportedReport.content);
    }
  } catch (error) {
    console.error('My therapist report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate therapist report'
    });
  }
});

// Generate my client report (for current user)
router.get('/my-client-report', authenticateToken, requireRole(['client']), async (req, res) => {
  try {
    const clientId = req.user.userId;
    const { timeRange = '30d', format = 'json' } = req.query;

    const report = await reportingService.generateClientReport(clientId, timeRange);

    if (format === 'json') {
      res.json({
        success: true,
        data: report
      });
    } else {
      const exportedReport = await reportingService.exportReport(report, format);
      res.setHeader('Content-Type', getContentType(format));
      res.setHeader('Content-Disposition', `attachment; filename="${exportedReport.filename}"`);
      res.send(exportedReport.content);
    }
  } catch (error) {
    console.error('My client report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate client report'
    });
  }
});

// Get report templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const templates = [
      {
        id: 'executive-summary',
        name: 'Executive Summary',
        description: 'High-level overview of platform performance and key metrics',
        roles: ['admin'],
        timeRanges: ['7d', '30d', '90d', '1y'],
        formats: ['json', 'pdf', 'excel', 'csv']
      },
      {
        id: 'therapist-performance',
        name: 'Therapist Performance Report',
        description: 'Detailed analysis of therapist performance and client outcomes',
        roles: ['therapist', 'admin'],
        timeRanges: ['7d', '30d', '90d'],
        formats: ['json', 'pdf', 'excel', 'csv']
      },
      {
        id: 'client-progress',
        name: 'Client Progress Report',
        description: 'Comprehensive analysis of client progress and therapeutic outcomes',
        roles: ['therapist', 'client', 'admin'],
        timeRanges: ['7d', '30d', '90d'],
        formats: ['json', 'pdf', 'excel', 'csv']
      },
      {
        id: 'engagement-analytics',
        name: 'Engagement Analytics',
        description: 'User engagement patterns and platform usage analytics',
        roles: ['admin'],
        timeRanges: ['7d', '30d', '90d', '1y'],
        formats: ['json', 'excel', 'csv']
      }
    ];

    // Filter templates based on user role
    const userRole = req.user.userType;
    const availableTemplates = templates.filter(template => 
      template.roles.includes(userRole)
    );

    res.json({
      success: true,
      data: {
        templates: availableTemplates,
        userRole
      }
    });
  } catch (error) {
    console.error('Report templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report templates'
    });
  }
});

// Schedule automated reports
router.post('/schedule', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { reportType, organizationId, frequency, recipients, format } = req.body;

    // Validate required fields
    if (!reportType || !organizationId || !frequency || !recipients) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: reportType, organizationId, frequency, recipients'
      });
    }

    // This would integrate with a job scheduling system like Bull or Agenda
    const scheduleId = `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store schedule configuration
    const { query } = require('../config/database');
    await query(
      `INSERT INTO report_schedules (id, report_type, organization_id, frequency, recipients, format, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [scheduleId, reportType, organizationId, frequency, JSON.stringify(recipients), format, req.user.userId]
    );

    res.json({
      success: true,
      message: 'Report schedule created successfully',
      data: {
        scheduleId,
        reportType,
        frequency,
        nextRun: calculateNextRun(frequency)
      }
    });
  } catch (error) {
    console.error('Schedule report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule report'
    });
  }
});

// Get scheduled reports
router.get('/schedules', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { query } = require('../config/database');
    const schedules = await query(
      `SELECT id, report_type, organization_id, frequency, recipients, format, 
              created_by, created_at, last_run, next_run, is_active
       FROM report_schedules
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: {
        schedules: schedules.rows.map(schedule => ({
          id: schedule.id,
          reportType: schedule.report_type,
          organizationId: schedule.organization_id,
          frequency: schedule.frequency,
          recipients: JSON.parse(schedule.recipients || '[]'),
          format: schedule.format,
          createdBy: schedule.created_by,
          createdAt: schedule.created_at,
          lastRun: schedule.last_run,
          nextRun: schedule.next_run,
          isActive: schedule.is_active
        }))
      }
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get scheduled reports'
    });
  }
});

// Cancel scheduled report
router.delete('/schedules/:scheduleId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const { query } = require('../config/database');
    await query(
      'UPDATE report_schedules SET is_active = false WHERE id = $1',
      [scheduleId]
    );

    res.json({
      success: true,
      message: 'Report schedule cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel report schedule'
    });
  }
});

// Helper functions
function getContentType(format) {
  switch (format.toLowerCase()) {
    case 'pdf':
      return 'application/pdf';
    case 'excel':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'csv':
      return 'text/csv';
    case 'json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

function calculateNextRun(frequency) {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}

module.exports = router;
