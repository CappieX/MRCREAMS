const { query } = require('../config/database');

class FeatureFlagService {
  /**
   * Get all feature flags
   */
  async getAllFlags() {
    try {
      const result = await query('SELECT * FROM feature_flags ORDER BY key');
      return result.rows.reduce((acc, row) => {
        acc[row.key] = {
          enabled: row.is_enabled,
          description: row.description,
          rules: row.rules
        };
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  /**
   * Get a specific flag status
   */
  async isEnabled(key, context = {}) {
    try {
      const result = await query('SELECT * FROM feature_flags WHERE key = $1', [key]);
      if (result.rows.length === 0) return false;

      const flag = result.rows[0];
      if (!flag.is_enabled) return false;

      // Check rules if any (basic implementation)
      if (flag.rules && Object.keys(flag.rules).length > 0) {
        // Implement targeting logic here (e.g., percentage rollout, user ID check)
        // For now, if it has rules, we just return true (assuming global enable)
        // unless specifically blocked
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error checking flag ${key}:`, error);
      return false;
    }
  }

  /**
   * Update a feature flag
   */
  async updateFlag(key, isEnabled, userId) {
    try {
      const result = await query(
        `UPDATE feature_flags 
         SET is_enabled = $1, updated_at = NOW(), updated_by = $2 
         WHERE key = $3 
         RETURNING *`,
        [isEnabled, userId, key]
      );
      return result.rows[0];
    } catch (error) {
      console.error(`Error updating flag ${key}:`, error);
      throw error;
    }
  }

  /**
   * Create a new feature flag
   */
  async createFlag(key, name, description, isEnabled = false, userId) {
    try {
      const result = await query(
        `INSERT INTO feature_flags (key, name, description, is_enabled, updated_by) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [key, name, description, isEnabled, userId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating feature flag:', error);
      throw error;
    }
  }
}

module.exports = new FeatureFlagService();
