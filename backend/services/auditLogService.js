const { query } = require('../config/database');

class AuditLogService {
  /**
   * Log user access to PHI data
   */
  async logPHIAccess(userId, action, resourceType, resourceId, details = {}) {
    try {
      await query(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          userId,
          action,
          resourceType,
          resourceId,
          JSON.stringify(details),
          details.ipAddress || null,
          details.userAgent || null
        ]
      );
    } catch (error) {
      console.error('Audit log PHI access error:', error);
    }
  }

  /**
   * Log authentication events
   */
  async logAuthEvent(userId, action, success, details = {}) {
    try {
      await query(
        `INSERT INTO audit_logs (user_id, action, success, details, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          userId,
          action,
          success,
          JSON.stringify(details),
          details.ipAddress || null,
          details.userAgent || null
        ]
      );
    } catch (error) {
      console.error('Audit log auth event error:', error);
    }
  }

  /**
   * Log data modification events
   */
  async logDataModification(userId, action, tableName, recordId, oldData, newData, details = {}) {
    try {
      await query(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_data, new_data, details, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          userId,
          action,
          tableName,
          recordId,
          JSON.stringify(oldData),
          JSON.stringify(newData),
          JSON.stringify(details),
          details.ipAddress || null,
          details.userAgent || null
        ]
      );
    } catch (error) {
      console.error('Audit log data modification error:', error);
    }
  }

  /**
   * Log system events
   */
  async logSystemEvent(action, details = {}) {
    try {
      await query(
        `INSERT INTO audit_logs (action, details, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          action,
          JSON.stringify(details),
          details.ipAddress || null,
          details.userAgent || null
        ]
      );
    } catch (error) {
      console.error('Audit log system event error:', error);
    }
  }

  /**
   * Log data export events
   */
  async logDataExport(userId, exportType, recordCount, details = {}) {
    try {
      await query(
        `INSERT INTO audit_logs (user_id, action, resource_type, details, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          userId,
          'data_export',
          exportType,
          JSON.stringify({ recordCount, ...details }),
          details.ipAddress || null,
          details.userAgent || null
        ]
      );
    } catch (error) {
      console.error('Audit log data export error:', error);
    }
  }

  /**
   * Log data deletion events
   */
  async logDataDeletion(userId, resourceType, resourceId, details = {}) {
    try {
      await query(
        `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          userId,
          'data_deletion',
          resourceType,
          resourceId,
          JSON.stringify(details),
          details.ipAddress || null,
          details.userAgent || null
        ]
      );
    } catch (error) {
      console.error('Audit log data deletion error:', error);
    }
  }

  /**
   * Get all audit logs (for super admin/platform admin)
   */
  async getAllLogs(limit = 100, offset = 0) {
    try {
      const result = await query(
        `SELECT al.*, u.email, u.first_name, u.last_name
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         ORDER BY al.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        userEmail: row.email,
        userName: row.user_id ? `${row.first_name} ${row.last_name}` : 'System',
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        oldData: row.old_data ? JSON.parse(row.old_data) : null,
        newData: row.new_data ? JSON.parse(row.new_data) : null,
        details: row.details ? JSON.parse(row.details) : {},
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        success: row.success,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Get all audit logs error:', error);
      return [];
    }
  }

  /**
   * Get audit logs for a user
   */
  async getUserAuditLogs(userId, limit = 100, offset = 0) {
    try {
      const result = await query(
        `SELECT al.*, u.email, u.first_name, u.last_name
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         WHERE al.user_id = $1
         ORDER BY al.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        userEmail: row.email,
        userName: `${row.first_name} ${row.last_name}`,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        oldData: row.old_data ? JSON.parse(row.old_data) : null,
        newData: row.new_data ? JSON.parse(row.new_data) : null,
        details: row.details ? JSON.parse(row.details) : {},
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        success: row.success,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Get user audit logs error:', error);
      return [];
    }
  }

  /**
   * Get audit logs for a resource
   */
  async getResourceAuditLogs(resourceType, resourceId, limit = 100, offset = 0) {
    try {
      const result = await query(
        `SELECT al.*, u.email, u.first_name, u.last_name
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         WHERE al.resource_type = $1 AND al.resource_id = $2
         ORDER BY al.created_at DESC
         LIMIT $3 OFFSET $4`,
        [resourceType, resourceId, limit, offset]
      );

      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        userEmail: row.email,
        userName: `${row.first_name} ${row.last_name}`,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        oldData: row.old_data ? JSON.parse(row.old_data) : null,
        newData: row.new_data ? JSON.parse(row.new_data) : null,
        details: row.details ? JSON.parse(row.details) : {},
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        success: row.success,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Get resource audit logs error:', error);
      return [];
    }
  }

  /**
   * Get system audit logs
   */
  async getSystemAuditLogs(limit = 100, offset = 0) {
    try {
      const result = await query(
        `SELECT al.*, u.email, u.first_name, u.last_name
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         WHERE al.user_id IS NULL
         ORDER BY al.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        userEmail: row.email,
        userName: row.user_id ? `${row.first_name} ${row.last_name}` : 'System',
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id,
        oldData: row.old_data ? JSON.parse(row.old_data) : null,
        newData: row.new_data ? JSON.parse(row.new_data) : null,
        details: row.details ? JSON.parse(row.details) : {},
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        success: row.success,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Get system audit logs error:', error);
      return [];
    }
  }

  /**
   * Generate audit report
   */
  async generateAuditReport(startDate, endDate, userId = null) {
    try {
      let whereClause = 'WHERE al.created_at BETWEEN $1 AND $2';
      let params = [startDate, endDate];

      if (userId) {
        whereClause += ' AND al.user_id = $3';
        params.push(userId);
      }

      const result = await query(
        `SELECT 
           al.action,
           al.resource_type,
           COUNT(*) as event_count,
           COUNT(CASE WHEN al.success = true THEN 1 END) as success_count,
           COUNT(CASE WHEN al.success = false THEN 1 END) as failure_count
         FROM audit_logs al
         ${whereClause}
         GROUP BY al.action, al.resource_type
         ORDER BY event_count DESC`,
        params
      );

      return result.rows.map(row => ({
        action: row.action,
        resourceType: row.resource_type,
        eventCount: parseInt(row.event_count),
        successCount: parseInt(row.success_count),
        failureCount: parseInt(row.failure_count),
        successRate: row.event_count > 0 ? (parseInt(row.success_count) / parseInt(row.event_count)) * 100 : 0
      }));
    } catch (error) {
      console.error('Generate audit report error:', error);
      return [];
    }
  }

  /**
   * Get failed login attempts
   */
  async getFailedLoginAttempts(userId, hours = 24) {
    try {
      const result = await query(
        `SELECT COUNT(*) as attempt_count, MAX(created_at) as last_attempt
         FROM audit_logs
         WHERE user_id = $1 AND action = 'login' AND success = false
         AND created_at >= NOW() - INTERVAL '${hours} hours'`,
        [userId]
      );

      return result.rows[0] || { attempt_count: 0, last_attempt: null };
    } catch (error) {
      console.error('Get failed login attempts error:', error);
      return { attempt_count: 0, last_attempt: null };
    }
  }

  /**
   * Check for suspicious activity
   */
  async checkSuspiciousActivity(userId, hours = 24) {
    try {
      const suspiciousPatterns = [];

      // Check for multiple failed logins
      const failedLogins = await this.getFailedLoginAttempts(userId, hours);
      if (failedLogins.attempt_count >= 5) {
        suspiciousPatterns.push({
          type: 'multiple_failed_logins',
          severity: 'high',
          count: failedLogins.attempt_count,
          lastAttempt: failedLogins.last_attempt
        });
      }

      // Check for unusual access patterns
      const unusualAccess = await query(
        `SELECT COUNT(DISTINCT ip_address) as unique_ips
         FROM audit_logs
         WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${hours} hours'
         AND action IN ('data_access', 'phi_access')`,
        [userId]
      );

      if (unusualAccess.rows[0].unique_ips > 3) {
        suspiciousPatterns.push({
          type: 'unusual_ip_patterns',
          severity: 'medium',
          uniqueIPs: unusualAccess.rows[0].unique_ips
        });
      }

      // Check for bulk data access
      const bulkAccess = await query(
        `SELECT COUNT(*) as access_count
         FROM audit_logs
         WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${hours} hours'
         AND action = 'data_access'`,
        [userId]
      );

      if (bulkAccess.rows[0].access_count > 100) {
        suspiciousPatterns.push({
          type: 'bulk_data_access',
          severity: 'medium',
          accessCount: bulkAccess.rows[0].access_count
        });
      }

      return suspiciousPatterns;
    } catch (error) {
      console.error('Check suspicious activity error:', error);
      return [];
    }
  }

  /**
   * Archive old audit logs
   */
  async archiveOldLogs(daysOld = 365) {
    try {
      const result = await query(
        `INSERT INTO audit_logs_archive 
         SELECT * FROM audit_logs 
         WHERE created_at < NOW() - INTERVAL '${daysOld} days'`,
        []
      );

      await query(
        `DELETE FROM audit_logs 
         WHERE created_at < NOW() - INTERVAL '${daysOld} days'`,
        []
      );

      return result.rowCount;
    } catch (error) {
      console.error('Archive old logs error:', error);
      throw new Error('Failed to archive old audit logs');
    }
  }
}

module.exports = new AuditLogService();
