const { query } = require('../config/database');
const crypto = require('crypto');

class APIKeyService {
  /**
   * Generate a new API key
   */
  async generateAPIKey(userId, keyName, permissions = [], rateLimit = 1000) {
    try {
      // Generate API key
      const apiKey = this.generateSecureKey();
      const keyHash = this.hashKey(apiKey);

      // Store API key in database
      const result = await query(
        `INSERT INTO api_keys (user_id, key_name, key_hash, permissions, rate_limit, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING id, key_name, permissions, rate_limit, created_at`,
        [userId, keyName, keyHash, JSON.stringify(permissions), rateLimit]
      );

      const keyData = result.rows[0];

      return {
        success: true,
        data: {
          id: keyData.id,
          keyName: keyData.key_name,
          apiKey: apiKey, // Only returned once during creation
          permissions: JSON.parse(keyData.permissions),
          rateLimit: keyData.rate_limit,
          createdAt: keyData.created_at
        }
      };
    } catch (error) {
      console.error('Error generating API key:', error);
      throw new Error('Failed to generate API key');
    }
  }

  /**
   * Validate API key
   */
  async validateAPIKey(apiKey) {
    try {
      const keyHash = this.hashKey(apiKey);
      
      const result = await query(
        `SELECT ak.id, ak.user_id, ak.key_name, ak.permissions, ak.rate_limit, ak.is_active,
                u.email, u.user_type, u.first_name, u.last_name
         FROM api_keys ak
         JOIN users u ON ak.user_id = u.id
         WHERE ak.key_hash = $1 AND ak.is_active = true`,
        [keyHash]
      );

      if (result.rows.length === 0) {
        return { valid: false, message: 'Invalid API key' };
      }

      const keyData = result.rows[0];

      // Check rate limit
      const rateLimitCheck = await this.checkRateLimit(keyData.id);
      if (!rateLimitCheck.allowed) {
        return { 
          valid: false, 
          message: 'Rate limit exceeded',
          retryAfter: rateLimitCheck.retryAfter
        };
      }

      return {
        valid: true,
        data: {
          keyId: keyData.id,
          userId: keyData.user_id,
          keyName: keyData.key_name,
          permissions: JSON.parse(keyData.permissions),
          rateLimit: keyData.rate_limit,
          user: {
            email: keyData.email,
            userType: keyData.user_type,
            firstName: keyData.first_name,
            lastName: keyData.last_name
          }
        }
      };
    } catch (error) {
      console.error('Error validating API key:', error);
      return { valid: false, message: 'API key validation failed' };
    }
  }

  /**
   * Get user's API keys
   */
  async getUserAPIKeys(userId) {
    try {
      const result = await query(
        `SELECT id, key_name, permissions, rate_limit, is_active, created_at, updated_at, last_used
         FROM api_keys
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows.map(row => ({
        id: row.id,
        keyName: row.key_name,
        permissions: JSON.parse(row.permissions),
        rateLimit: row.rate_limit,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastUsed: row.last_used
      }));
    } catch (error) {
      console.error('Error getting user API keys:', error);
      return [];
    }
  }

  /**
   * Update API key
   */
  async updateAPIKey(keyId, userId, updates) {
    try {
      const { keyName, permissions, rateLimit, isActive } = updates;
      
      const setClause = [];
      const values = [];
      let paramCount = 1;

      if (keyName !== undefined) {
        setClause.push(`key_name = $${paramCount++}`);
        values.push(keyName);
      }

      if (permissions !== undefined) {
        setClause.push(`permissions = $${paramCount++}`);
        values.push(JSON.stringify(permissions));
      }

      if (rateLimit !== undefined) {
        setClause.push(`rate_limit = $${paramCount++}`);
        values.push(rateLimit);
      }

      if (isActive !== undefined) {
        setClause.push(`is_active = $${paramCount++}`);
        values.push(isActive);
      }

      if (setClause.length === 0) {
        throw new Error('No updates provided');
      }

      setClause.push(`updated_at = NOW()`);
      values.push(keyId, userId);

      const result = await query(
        `UPDATE api_keys 
         SET ${setClause.join(', ')}
         WHERE id = $${paramCount++} AND user_id = $${paramCount++}
         RETURNING id, key_name, permissions, rate_limit, is_active, updated_at`,
        values
      );

      if (result.rows.length === 0) {
        throw new Error('API key not found or access denied');
      }

      const keyData = result.rows[0];

      return {
        success: true,
        data: {
          id: keyData.id,
          keyName: keyData.key_name,
          permissions: JSON.parse(keyData.permissions),
          rateLimit: keyData.rate_limit,
          isActive: keyData.is_active,
          updatedAt: keyData.updated_at
        }
      };
    } catch (error) {
      console.error('Error updating API key:', error);
      throw new Error('Failed to update API key');
    }
  }

  /**
   * Revoke API key
   */
  async revokeAPIKey(keyId, userId) {
    try {
      const result = await query(
        `UPDATE api_keys 
         SET is_active = false, updated_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING id, key_name`,
        [keyId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('API key not found or access denied');
      }

      return {
        success: true,
        message: 'API key revoked successfully',
        data: {
          id: result.rows[0].id,
          keyName: result.rows[0].key_name
        }
      };
    } catch (error) {
      console.error('Error revoking API key:', error);
      throw new Error('Failed to revoke API key');
    }
  }

  /**
   * Log API usage
   */
  async logAPIUsage(keyId, endpoint, method, responseTime, statusCode) {
    try {
      await query(
        `INSERT INTO api_usage_logs (key_id, endpoint, method, response_time_ms, status_code, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [keyId, endpoint, method, responseTime, statusCode]
      );

      // Update last used timestamp
      await query(
        'UPDATE api_keys SET last_used = NOW() WHERE id = $1',
        [keyId]
      );
    } catch (error) {
      console.error('Error logging API usage:', error);
    }
  }

  /**
   * Get API usage statistics
   */
  async getAPIUsageStats(keyId, timeRange = '30d') {
    try {
      const timeFilter = this.getTimeFilter(timeRange);

      const stats = await query(
        `SELECT 
           COUNT(*) as total_requests,
           COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END) as successful_requests,
           COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_requests,
           AVG(response_time_ms) as avg_response_time,
           MAX(response_time_ms) as max_response_time,
           MIN(response_time_ms) as min_response_time
         FROM api_usage_logs
         WHERE key_id = $1 AND created_at >= $2`,
        [keyId, timeFilter]
      );

      const endpointStats = await query(
        `SELECT 
           endpoint,
           method,
           COUNT(*) as request_count,
           AVG(response_time_ms) as avg_response_time,
           COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count
         FROM api_usage_logs
         WHERE key_id = $1 AND created_at >= $2
         GROUP BY endpoint, method
         ORDER BY request_count DESC`,
        [keyId, timeFilter]
      );

      const dailyStats = await query(
        `SELECT 
           DATE(created_at) as date,
           COUNT(*) as request_count,
           AVG(response_time_ms) as avg_response_time
         FROM api_usage_logs
         WHERE key_id = $1 AND created_at >= $2
         GROUP BY DATE(created_at)
         ORDER BY date DESC
         LIMIT 30`,
        [keyId, timeFilter]
      );

      const statsData = stats.rows[0];
      const successRate = statsData.total_requests > 0 
        ? (parseInt(statsData.successful_requests) / parseInt(statsData.total_requests)) * 100 
        : 0;

      return {
        timeRange,
        totalRequests: parseInt(statsData.total_requests),
        successfulRequests: parseInt(statsData.successful_requests),
        errorRequests: parseInt(statsData.error_requests),
        successRate: Math.round(successRate * 100) / 100,
        averageResponseTime: parseFloat(statsData.avg_response_time || 0),
        maxResponseTime: parseFloat(statsData.max_response_time || 0),
        minResponseTime: parseFloat(statsData.min_response_time || 0),
        endpointStats: endpointStats.rows.map(row => ({
          endpoint: row.endpoint,
          method: row.method,
          requestCount: parseInt(row.request_count),
          averageResponseTime: parseFloat(row.avg_response_time || 0),
          errorCount: parseInt(row.error_count)
        })),
        dailyStats: dailyStats.rows.map(row => ({
          date: row.date,
          requestCount: parseInt(row.request_count),
          averageResponseTime: parseFloat(row.avg_response_time || 0)
        }))
      };
    } catch (error) {
      console.error('Error getting API usage stats:', error);
      return {
        timeRange,
        totalRequests: 0,
        successfulRequests: 0,
        errorRequests: 0,
        successRate: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        endpointStats: [],
        dailyStats: []
      };
    }
  }

  /**
   * Check rate limit for API key
   */
  async checkRateLimit(keyId) {
    try {
      const result = await query(
        `SELECT rate_limit FROM api_keys WHERE id = $1`,
        [keyId]
      );

      if (result.rows.length === 0) {
        return { allowed: false, retryAfter: 0 };
      }

      const rateLimit = result.rows[0].rate_limit;
      const windowStart = new Date(Date.now() - 60 * 60 * 1000); // 1 hour window

      const usageCount = await query(
        `SELECT COUNT(*) as count FROM api_usage_logs 
         WHERE key_id = $1 AND created_at >= $2`,
        [keyId, windowStart]
      );

      const currentUsage = parseInt(usageCount.rows[0].count);
      const allowed = currentUsage < rateLimit;

      return {
        allowed,
        currentUsage,
        rateLimit,
        retryAfter: allowed ? 0 : 3600 // 1 hour retry after
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return { allowed: false, retryAfter: 0 };
    }
  }

  /**
   * Generate secure API key
   */
  generateSecureKey() {
    const prefix = 'mrcreams_';
    const randomBytes = crypto.randomBytes(32);
    const key = randomBytes.toString('hex');
    return `${prefix}${key}`;
  }

  /**
   * Hash API key for storage
   */
  hashKey(apiKey) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Get time filter for date ranges
   */
  getTimeFilter(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}

module.exports = new APIKeyService();
