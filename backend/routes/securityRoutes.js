const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const SecurityService = require('../services/securityService');
const { query } = require('../config/database');

// Apply authentication to all security routes
router.use(authenticateToken);

// Get security events
router.get('/events', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { limit = 100, offset = 0, eventType, severity, startDate, endDate } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (eventType) {
      paramCount++;
      whereClause += ` AND event_type = $${paramCount}`;
      params.push(eventType);
    }

    if (severity) {
      paramCount++;
      whereClause += ` AND severity = $${paramCount}`;
      params.push(severity);
    }

    if (startDate) {
      paramCount++;
      whereClause += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      whereClause += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
    }

    paramCount++;
    whereClause += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    whereClause += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await query(
      `SELECT se.*, u.email, u.first_name, u.last_name
       FROM security_events se
       LEFT JOIN users u ON se.user_id = u.id
       ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        events: result.rows.map(row => ({
          id: row.id,
          eventType: row.event_type,
          details: row.details,
          ipAddress: row.ip_address,
          userAgent: row.user_agent,
          userId: row.user_id,
          userEmail: row.email,
          userName: row.user_id ? `${row.first_name} ${row.last_name}` : null,
          endpoint: row.endpoint,
          method: row.method,
          severity: row.severity,
          resolved: row.resolved,
          resolvedAt: row.resolved_at,
          resolvedBy: row.resolved_by,
          resolutionNotes: row.resolution_notes,
          createdAt: row.created_at
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: result.rows.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get security events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get security events',
      code: 'SECURITY_EVENTS_ERROR'
    });
  }
});

// Get security alerts
router.get('/alerts', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { limit = 50, offset = 0, severity, acknowledged, resolved } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (severity) {
      paramCount++;
      whereClause += ` AND severity = $${paramCount}`;
      params.push(severity);
    }

    if (acknowledged !== undefined) {
      paramCount++;
      whereClause += ` AND acknowledged = $${paramCount}`;
      params.push(acknowledged === 'true');
    }

    if (resolved !== undefined) {
      paramCount++;
      whereClause += ` AND resolved = $${paramCount}`;
      params.push(resolved === 'true');
    }

    paramCount++;
    whereClause += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    whereClause += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await query(
      `SELECT sa.*, u.email, u.first_name, u.last_name, 
              ack.email as ack_email, ack.first_name as ack_first_name, ack.last_name as ack_last_name,
              res.email as res_email, res.first_name as res_first_name, res.last_name as res_last_name
       FROM security_alerts sa
       LEFT JOIN users u ON sa.user_id = u.id
       LEFT JOIN users ack ON sa.acknowledged_by = ack.id
       LEFT JOIN users res ON sa.resolved_by = res.id
       ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        alerts: result.rows.map(row => ({
          id: row.id,
          alertType: row.alert_type,
          severity: row.severity,
          title: row.title,
          description: row.description,
          details: row.details,
          ipAddress: row.ip_address,
          userId: row.user_id,
          userEmail: row.email,
          userName: row.user_id ? `${row.first_name} ${row.last_name}` : null,
          endpoint: row.endpoint,
          method: row.method,
          acknowledged: row.acknowledged,
          acknowledgedAt: row.acknowledged_at,
          acknowledgedBy: row.acknowledged_by,
          acknowledgedByEmail: row.ack_email,
          acknowledgedByName: row.acknowledged_by ? `${row.ack_first_name} ${row.ack_last_name}` : null,
          resolved: row.resolved,
          resolvedAt: row.resolved_at,
          resolvedBy: row.resolved_by,
          resolvedByEmail: row.res_email,
          resolvedByName: row.resolved_by ? `${row.res_first_name} ${row.res_last_name}` : null,
          resolutionNotes: row.resolution_notes,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: result.rows.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get security alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get security alerts',
      code: 'SECURITY_ALERTS_ERROR'
    });
  }
});

// Acknowledge security alert
router.post('/alerts/:alertId/acknowledge', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes } = req.body;
    const userId = req.user.userId;

    const result = await query(
      `UPDATE security_alerts 
       SET acknowledged = true, acknowledged_at = NOW(), acknowledged_by = $1, updated_at = NOW()
       WHERE id = $2 AND acknowledged = false
       RETURNING *`,
      [userId, alertId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found or already acknowledged',
        code: 'ALERT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Alert acknowledged successfully',
      data: {
        alertId: alertId,
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy: userId
      }
    });
  } catch (error) {
    console.error('Acknowledge security alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to acknowledge security alert',
      code: 'ACKNOWLEDGE_ALERT_ERROR'
    });
  }
});

// Resolve security alert
router.post('/alerts/:alertId/resolve', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { alertId } = req.params;
    const { resolutionNotes } = req.body;
    const userId = req.user.userId;

    const result = await query(
      `UPDATE security_alerts 
       SET resolved = true, resolved_at = NOW(), resolved_by = $1, resolution_notes = $2, updated_at = NOW()
       WHERE id = $3 AND resolved = false
       RETURNING *`,
      [userId, resolutionNotes, alertId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found or already resolved',
        code: 'ALERT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Alert resolved successfully',
      data: {
        alertId: alertId,
        resolvedAt: new Date().toISOString(),
        resolvedBy: userId,
        resolutionNotes: resolutionNotes
      }
    });
  } catch (error) {
    console.error('Resolve security alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve security alert',
      code: 'RESOLVE_ALERT_ERROR'
    });
  }
});

// Get IP blacklist
router.get('/ip-blacklist', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const result = await query(
      `SELECT * FROM ip_blacklist 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: {
        blacklistedIPs: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: result.rows.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get IP blacklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get IP blacklist',
      code: 'IP_BLACKLIST_ERROR'
    });
  }
});

// Block IP address
router.post('/ip-blacklist', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { ipAddress, reason, durationHours = 24, permanent = false } = req.body;

    if (!ipAddress) {
      return res.status(400).json({
        success: false,
        message: 'IP address is required',
        code: 'MISSING_IP_ADDRESS'
      });
    }

    if (!SecurityService.validateIPAddress(ipAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IP address format',
        code: 'INVALID_IP_ADDRESS'
      });
    }

    const result = await query(
      `SELECT block_ip_address($1, $2, $3, $4) as success`,
      [ipAddress, reason || 'Security violation', durationHours, permanent]
    );

    if (result.rows[0].success) {
      SecurityService.logSecurityEvent('ip_blocked', {
        ipAddress: ipAddress,
        reason: reason,
        durationHours: durationHours,
        permanent: permanent,
        blockedBy: req.user.userId
      }, req);

      res.status(201).json({
        success: true,
        message: 'IP address blocked successfully',
        data: {
          ipAddress: ipAddress,
          reason: reason,
          durationHours: durationHours,
          permanent: permanent,
          blockedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to block IP address',
        code: 'BLOCK_IP_ERROR'
      });
    }
  } catch (error) {
    console.error('Block IP address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to block IP address',
      code: 'BLOCK_IP_ERROR'
    });
  }
});

// Unblock IP address
router.delete('/ip-blacklist/:ipAddress', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { ipAddress } = req.params;

    const result = await query(
      `SELECT unblock_ip_address($1) as success`,
      [ipAddress]
    );

    if (result.rows[0].success) {
      SecurityService.logSecurityEvent('ip_unblocked', {
        ipAddress: ipAddress,
        unblockedBy: req.user.userId
      }, req);

      res.json({
        success: true,
        message: 'IP address unblocked successfully',
        data: {
          ipAddress: ipAddress,
          unblockedAt: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to unblock IP address',
        code: 'UNBLOCK_IP_ERROR'
      });
    }
  } catch (error) {
    console.error('Unblock IP address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unblock IP address',
      code: 'UNBLOCK_IP_ERROR'
    });
  }
});

// Get security metrics
router.get('/metrics', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
        code: 'MISSING_DATE_RANGE'
      });
    }

    const result = await query(
      `SELECT * FROM get_security_metrics($1, $2)`,
      [startDate, endDate]
    );

    res.json({
      success: true,
      data: {
        metrics: result.rows,
        dateRange: {
          startDate: startDate,
          endDate: endDate
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get security metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get security metrics',
      code: 'SECURITY_METRICS_ERROR'
    });
  }
});

// Generate security report
router.get('/report', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
        code: 'MISSING_DATE_RANGE'
      });
    }

    const result = await query(
      `SELECT * FROM generate_security_report($1, $2)`,
      [startDate, endDate]
    );

    res.json({
      success: true,
      data: {
        report: result.rows,
        dateRange: {
          startDate: startDate,
          endDate: endDate
        },
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Generate security report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate security report',
      code: 'SECURITY_REPORT_ERROR'
    });
  }
});

// Get failed login attempts
router.get('/failed-logins', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { limit = 100, offset = 0, email, ipAddress } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (email) {
      paramCount++;
      whereClause += ` AND email = $${paramCount}`;
      params.push(email);
    }

    if (ipAddress) {
      paramCount++;
      whereClause += ` AND ip_address = $${paramCount}`;
      params.push(ipAddress);
    }

    paramCount++;
    whereClause += ` ORDER BY last_attempt DESC LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    whereClause += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await query(
      `SELECT * FROM failed_login_attempts ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        failedLogins: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: result.rows.length === parseInt(limit)
        }
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

// Get rate limit violations
router.get('/rate-limits', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { limit = 100, offset = 0, ipAddress, endpoint } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (ipAddress) {
      paramCount++;
      whereClause += ` AND ip_address = $${paramCount}`;
      params.push(ipAddress);
    }

    if (endpoint) {
      paramCount++;
      whereClause += ` AND endpoint = $${paramCount}`;
      params.push(endpoint);
    }

    paramCount++;
    whereClause += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    whereClause += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await query(
      `SELECT * FROM rate_limit_violations ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        violations: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: result.rows.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get rate limit violations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rate limit violations',
      code: 'RATE_LIMIT_VIOLATIONS_ERROR'
    });
  }
});

// Clean up old security data
router.post('/cleanup', requireRole(['admin']), async (req, res) => {
  try {
    const { daysOld = 90 } = req.body;

    const result = await query(
      `SELECT cleanup_old_security_events($1) as deleted_count`,
      [daysOld]
    );

    res.json({
      success: true,
      message: 'Security data cleanup completed',
      data: {
        deletedCount: result.rows[0].deleted_count,
        daysOld: daysOld,
        cleanedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Cleanup security data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup security data',
      code: 'SECURITY_CLEANUP_ERROR'
    });
  }
});

// Check if IP is blocked
router.get('/check-ip/:ipAddress', requireRole(['admin', 'security']), async (req, res) => {
  try {
    const { ipAddress } = req.params;

    if (!SecurityService.validateIPAddress(ipAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IP address format',
        code: 'INVALID_IP_ADDRESS'
      });
    }

    const result = await query(
      `SELECT is_ip_blocked($1) as is_blocked`,
      [ipAddress]
    );

    res.json({
      success: true,
      data: {
        ipAddress: ipAddress,
        isBlocked: result.rows[0].is_blocked,
        checkedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Check IP blocked status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check IP blocked status',
      code: 'CHECK_IP_ERROR'
    });
  }
});

module.exports = router;
