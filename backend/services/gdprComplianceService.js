const { query } = require('../config/database');

class GDPRComplianceService {
  /**
   * Record user consent for data processing
   */
  async recordConsent(userId, consentType, consentVersion, granted, ipAddress = null, userAgent = null) {
    try {
      await query(
        `INSERT INTO consent_records (user_id, consent_type, consent_version, granted, granted_at, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId,
          consentType,
          consentVersion,
          granted,
          granted ? new Date() : null,
          ipAddress,
          userAgent
        ]
      );

      // If consent is revoked, update all previous records
      if (!granted) {
        await query(
          `UPDATE consent_records 
           SET revoked_at = NOW(), updated_at = NOW()
           WHERE user_id = $1 AND consent_type = $2 AND granted = true AND revoked_at IS NULL`,
          [userId, consentType]
        );
      }

      return { success: true, message: 'Consent recorded successfully' };
    } catch (error) {
      console.error('Record consent error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's current consent status
   */
  async getUserConsentStatus(userId) {
    try {
      const result = await query(
        `SELECT consent_type, consent_version, granted, granted_at, revoked_at
         FROM consent_records
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      const consentStatus = {};
      result.rows.forEach(row => {
        if (!consentStatus[row.consent_type] || row.granted_at > (consentStatus[row.consent_type].granted_at || new Date(0))) {
          consentStatus[row.consent_type] = {
            version: row.consent_version,
            granted: row.granted,
            grantedAt: row.granted_at,
            revokedAt: row.revoked_at,
            isActive: row.granted && !row.revoked_at
          };
        }
      });

      return { success: true, consentStatus };
    } catch (error) {
      console.error('Get user consent status error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user has valid consent for data processing
   */
  async hasValidConsent(userId, consentType) {
    try {
      const result = await query(
        `SELECT granted, revoked_at
         FROM consent_records
         WHERE user_id = $1 AND consent_type = $2
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId, consentType]
      );

      if (result.rows.length === 0) {
        return false;
      }

      const consent = result.rows[0];
      return consent.granted && !consent.revoked_at;
    } catch (error) {
      console.error('Check valid consent error:', error);
      return false;
    }
  }

  /**
   * Export all user data (Right to Access)
   */
  async exportUserData(userId, format = 'json') {
    try {
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

      // Get consent records
      const consentData = await query(
        'SELECT * FROM consent_records WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      // Get audit logs
      const auditData = await query(
        'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      // Get support tickets
      const ticketData = await query(
        'SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      const exportData = {
        user: userData.rows[0],
        emotionCheckins: emotionData.rows,
        conflicts: conflictData.rows,
        therapySessions: sessionData.rows,
        consentRecords: consentData.rows,
        auditLogs: auditData.rows,
        supportTickets: ticketData.rows,
        exportedAt: new Date().toISOString(),
        exportedBy: userId,
        dataCategories: [
          'personal_information',
          'emotion_data',
          'conflict_data',
          'therapy_sessions',
          'consent_records',
          'audit_logs',
          'support_tickets'
        ]
      };

      // Log data export
      await query(
        `INSERT INTO audit_logs (user_id, action, resource_type, details, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          userId,
          'data_export',
          'user_data',
          JSON.stringify({
            format,
            recordCount: Object.values(exportData).filter(Array.isArray).reduce((sum, arr) => sum + arr.length, 0),
            categories: exportData.dataCategories
          })
        ]
      );

      return { success: true, data: exportData };
    } catch (error) {
      console.error('Export user data error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Request data deletion (Right to Erasure)
   */
  async requestDataDeletion(userId, reason, confirmation) {
    try {
      if (confirmation !== 'DELETE_MY_DATA') {
        return { success: false, message: 'Confirmation required. Please type "DELETE_MY_DATA" to confirm.' };
      }

      // Check if deletion request already exists
      const existingRequest = await query(
        'SELECT id FROM data_deletion_requests WHERE user_id = $1 AND status IN ($2, $3)',
        [userId, 'pending', 'approved']
      );

      if (existingRequest.rows.length > 0) {
        return { success: false, message: 'Data deletion request already exists and is being processed.' };
      }

      // Create deletion request
      await query(
        `INSERT INTO data_deletion_requests (user_id, reason, status, requested_at)
         VALUES ($1, $2, $3, NOW())`,
        [userId, reason, 'pending']
      );

      // Log deletion request
      await query(
        `INSERT INTO audit_logs (user_id, action, resource_type, details, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [
          userId,
          'data_deletion_request',
          'user_account',
          JSON.stringify({ reason, confirmation })
        ]
      );

      return { 
        success: true, 
        message: 'Data deletion request submitted successfully. Your account will be deleted within 30 days.',
        estimatedDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error('Request data deletion error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process approved data deletion requests
   */
  async processDataDeletion(deletionRequestId, processedBy) {
    try {
      // Get deletion request
      const request = await query(
        'SELECT * FROM data_deletion_requests WHERE id = $1 AND status = $2',
        [deletionRequestId, 'approved']
      );

      if (request.rows.length === 0) {
        return { success: false, message: 'Deletion request not found or not approved' };
      }

      const { user_id } = request.rows[0];

      // Start transaction for data deletion
      await query('BEGIN');

      try {
        // Delete user data in order (respecting foreign key constraints)
        await query('DELETE FROM audit_logs WHERE user_id = $1', [user_id]);
        await query('DELETE FROM consent_records WHERE user_id = $1', [user_id]);
        await query('DELETE FROM emotion_checkins WHERE user_id = $1', [user_id]);
        await query('DELETE FROM conflicts WHERE user_id = $1', [user_id]);
        await query('DELETE FROM therapy_sessions WHERE client_id = $1', [user_id]);
        await query('DELETE FROM support_tickets WHERE user_id = $1', [user_id]);
        await query('DELETE FROM user_metadata WHERE user_id = $1', [user_id]);
        await query('DELETE FROM users WHERE id = $1', [user_id]);

        // Update deletion request status
        await query(
          `UPDATE data_deletion_requests 
           SET status = $1, completed_at = NOW(), processed_by = $2
           WHERE id = $3`,
          ['completed', processedBy, deletionRequestId]
        );

        await query('COMMIT');

        // Log successful deletion
        await query(
          `INSERT INTO audit_logs (action, resource_type, details, created_at)
           VALUES ($1, $2, $3, NOW())`,
          [
            'data_deletion_completed',
            'user_account',
            JSON.stringify({ 
              userId: user_id, 
              deletionRequestId, 
              processedBy 
            })
          ]
        );

        return { success: true, message: 'Data deletion completed successfully' };
      } catch (error) {
        await query('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Process data deletion error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get data processing activities
   */
  async getDataProcessingActivities() {
    try {
      const result = await query(
        'SELECT * FROM data_processing_activities WHERE is_active = true ORDER BY activity_name'
      );

      return { success: true, activities: result.rows };
    } catch (error) {
      console.error('Get data processing activities error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update data processing activity
   */
  async updateDataProcessingActivity(activityId, updates) {
    try {
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [activityId, ...Object.values(updates)];

      await query(
        `UPDATE data_processing_activities 
         SET ${setClause}, updated_at = NOW()
         WHERE id = $1`,
        values
      );

      return { success: true, message: 'Data processing activity updated successfully' };
    } catch (error) {
      console.error('Update data processing activity error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's data processing consent history
   */
  async getUserConsentHistory(userId) {
    try {
      const result = await query(
        `SELECT consent_type, consent_version, granted, granted_at, revoked_at, ip_address, user_agent
         FROM consent_records
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return { success: true, history: result.rows };
    } catch (error) {
      console.error('Get user consent history error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Revoke specific consent
   */
  async revokeConsent(userId, consentType) {
    try {
      await query(
        `UPDATE consent_records 
         SET revoked_at = NOW(), updated_at = NOW()
         WHERE user_id = $1 AND consent_type = $2 AND granted = true AND revoked_at IS NULL`,
        [userId, consentType]
      );

      // Record revocation
      await query(
        `INSERT INTO consent_records (user_id, consent_type, consent_version, granted, revoked_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [userId, consentType, '1.0', false]
      );

      return { success: true, message: 'Consent revoked successfully' };
    } catch (error) {
      console.error('Revoke consent error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get GDPR compliance status
   */
  async getGDPRComplianceStatus(userId) {
    try {
      const consentStatus = await this.getUserConsentStatus(userId);
      const processingActivities = await this.getDataProcessingActivities();

      const complianceStatus = {
        hasValidConsent: Object.values(consentStatus.consentStatus || {}).some(consent => consent.isActive),
        consentTypes: Object.keys(consentStatus.consentStatus || {}),
        dataProcessingActivities: processingActivities.activities?.length || 0,
        hasDataExportRight: true,
        hasDataDeletionRight: true,
        lastConsentUpdate: Object.values(consentStatus.consentStatus || {})
          .map(consent => consent.grantedAt)
          .filter(date => date)
          .sort()
          .pop() || null
      };

      return { success: true, complianceStatus };
    } catch (error) {
      console.error('Get GDPR compliance status error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate GDPR compliance report
   */
  async generateGDPRComplianceReport(startDate, endDate) {
    try {
      // Get consent statistics
      const consentStats = await query(
        `SELECT 
           consent_type,
           COUNT(*) as total_records,
           COUNT(CASE WHEN granted = true THEN 1 END) as granted_count,
           COUNT(CASE WHEN revoked_at IS NOT NULL THEN 1 END) as revoked_count
         FROM consent_records
         WHERE created_at BETWEEN $1 AND $2
         GROUP BY consent_type`,
        [startDate, endDate]
      );

      // Get data processing statistics
      const processingStats = await query(
        `SELECT 
           COUNT(*) as total_activities,
           COUNT(CASE WHEN is_active = true THEN 1 END) as active_activities
         FROM data_processing_activities`
      );

      // Get data deletion statistics
      const deletionStats = await query(
        `SELECT 
           COUNT(*) as total_requests,
           COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_deletions,
           COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_deletions
         FROM data_deletion_requests
         WHERE requested_at BETWEEN $1 AND $2`,
        [startDate, endDate]
      );

      const report = {
        period: { startDate, endDate },
        consentStatistics: consentStats.rows,
        dataProcessingStatistics: processingStats.rows[0],
        dataDeletionStatistics: deletionStats.rows[0],
        generatedAt: new Date().toISOString()
      };

      return { success: true, report };
    } catch (error) {
      console.error('Generate GDPR compliance report error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new GDPRComplianceService();
