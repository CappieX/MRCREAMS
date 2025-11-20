const { query } = require('../config/database');

class AnalyticsService {
  /**
   * Get comprehensive analytics for a user
   */
  async getUserAnalytics(userId, timeRange = '30d') {
    try {
      const timeFilter = this.getTimeFilter(timeRange);
      
      const [
        emotionTrends,
        conflictAnalytics,
        sessionAnalytics,
        progressMetrics,
        behavioralInsights
      ] = await Promise.all([
        this.getEmotionTrends(userId, timeFilter),
        this.getConflictAnalytics(userId, timeFilter),
        this.getSessionAnalytics(userId, timeFilter),
        this.getProgressMetrics(userId, timeFilter),
        this.getBehavioralInsights(userId, timeFilter)
      ]);

      return {
        timeRange,
        emotionTrends,
        conflictAnalytics,
        sessionAnalytics,
        progressMetrics,
        behavioralInsights,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw new Error('Failed to generate user analytics');
    }
  }

  /**
   * Get emotion trends over time
   */
  async getEmotionTrends(userId, timeFilter) {
    try {
      // Get daily emotion averages
      const dailyTrends = await query(
        `SELECT 
           DATE(created_at) as date,
           AVG(intensity) as avg_intensity,
           COUNT(*) as checkin_count,
           array_agg(DISTINCT emotion) as emotions
         FROM emotion_checkins
         WHERE user_id = $1 AND created_at >= $2
         GROUP BY DATE(created_at)
         ORDER BY date DESC
         LIMIT 30`,
        [userId, timeFilter]
      );

      // Get emotion frequency
      const emotionFrequency = await query(
        `SELECT 
           emotion,
           COUNT(*) as frequency,
           AVG(intensity) as avg_intensity,
           MAX(intensity) as max_intensity,
           MIN(intensity) as min_intensity
         FROM emotion_checkins
         WHERE user_id = $1 AND created_at >= $2
         GROUP BY emotion
         ORDER BY frequency DESC`,
        [userId, timeFilter]
      );

      // Get weekly patterns
      const weeklyPatterns = await query(
        `SELECT 
           EXTRACT(DOW FROM created_at) as day_of_week,
           AVG(intensity) as avg_intensity,
           COUNT(*) as checkin_count
         FROM emotion_checkins
         WHERE user_id = $1 AND created_at >= $2
         GROUP BY EXTRACT(DOW FROM created_at)
         ORDER BY day_of_week`,
        [userId, timeFilter]
      );

      return {
        dailyTrends: dailyTrends.rows,
        emotionFrequency: emotionFrequency.rows,
        weeklyPatterns: weeklyPatterns.rows,
        totalCheckins: dailyTrends.rows.reduce((sum, row) => sum + parseInt(row.checkin_count), 0)
      };
    } catch (error) {
      console.error('Error getting emotion trends:', error);
      return { dailyTrends: [], emotionFrequency: [], weeklyPatterns: [], totalCheckins: 0 };
    }
  }

  /**
   * Get conflict analytics
   */
  async getConflictAnalytics(userId, timeFilter) {
    try {
      // Get conflict trends
      const conflictTrends = await query(
        `SELECT 
           DATE(created_at) as date,
           COUNT(*) as conflict_count,
           AVG(CASE 
             WHEN severity = 'low' THEN 1
             WHEN severity = 'medium' THEN 2
             WHEN severity = 'high' THEN 3
             WHEN severity = 'critical' THEN 4
             ELSE 2
           END) as avg_severity_score
         FROM conflicts
         WHERE user_id = $1 AND created_at >= $2
         GROUP BY DATE(created_at)
         ORDER BY date DESC
         LIMIT 30`,
        [userId, timeFilter]
      );

      // Get conflict categories
      const categoryBreakdown = await query(
        `SELECT 
           category,
           COUNT(*) as count,
           AVG(CASE 
             WHEN severity = 'low' THEN 1
             WHEN severity = 'medium' THEN 2
             WHEN severity = 'high' THEN 3
             WHEN severity = 'critical' THEN 4
             ELSE 2
           END) as avg_severity
         FROM conflicts
         WHERE user_id = $1 AND created_at >= $2
         GROUP BY category
         ORDER BY count DESC`,
        [userId, timeFilter]
      );

      // Get resolution patterns
      const resolutionPatterns = await query(
        `SELECT 
           c.category,
           c.severity,
           COUNT(*) as total_conflicts,
           COUNT(CASE WHEN c.resolved_at IS NOT NULL THEN 1 END) as resolved_conflicts,
           AVG(EXTRACT(EPOCH FROM (c.resolved_at - c.created_at))/86400) as avg_resolution_days
         FROM conflicts c
         WHERE c.user_id = $1 AND c.created_at >= $2
         GROUP BY c.category, c.severity
         ORDER BY total_conflicts DESC`,
        [userId, timeFilter]
      );

      return {
        conflictTrends: conflictTrends.rows,
        categoryBreakdown: categoryBreakdown.rows,
        resolutionPatterns: resolutionPatterns.rows,
        totalConflicts: conflictTrends.rows.reduce((sum, row) => sum + parseInt(row.conflict_count), 0)
      };
    } catch (error) {
      console.error('Error getting conflict analytics:', error);
      return { conflictTrends: [], categoryBreakdown: [], resolutionPatterns: [], totalConflicts: 0 };
    }
  }

  /**
   * Get session analytics (for therapists)
   */
  async getSessionAnalytics(userId, timeFilter) {
    try {
      // Check if user is a therapist
      const userResult = await query(
        'SELECT user_type FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0 || userResult.rows[0].user_type !== 'therapist') {
        return { sessions: [], clientMetrics: [], sessionTrends: [] };
      }

      // Get session trends
      const sessionTrends = await query(
        `SELECT 
           DATE(scheduled_at) as date,
           COUNT(*) as session_count,
           AVG(duration_minutes) as avg_duration,
           COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions
         FROM therapy_sessions
         WHERE therapist_id = $1 AND scheduled_at >= $2
         GROUP BY DATE(scheduled_at)
         ORDER BY date DESC
         LIMIT 30`,
        [userId, timeFilter]
      );

      // Get client metrics
      const clientMetrics = await query(
        `SELECT 
           c.id as client_id,
           c.first_name,
           c.last_name,
           COUNT(s.id) as total_sessions,
           COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
           AVG(s.duration_minutes) as avg_duration,
           MAX(s.scheduled_at) as last_session
         FROM therapy_sessions s
         JOIN users c ON s.client_id = c.id
         WHERE s.therapist_id = $1 AND s.scheduled_at >= $2
         GROUP BY c.id, c.first_name, c.last_name
         ORDER BY total_sessions DESC`,
        [userId, timeFilter]
      );

      return {
        sessionTrends: sessionTrends.rows,
        clientMetrics: clientMetrics.rows,
        totalSessions: sessionTrends.rows.reduce((sum, row) => sum + parseInt(row.session_count), 0)
      };
    } catch (error) {
      console.error('Error getting session analytics:', error);
      return { sessionTrends: [], clientMetrics: [], totalSessions: 0 };
    }
  }

  /**
   * Get progress metrics
   */
  async getProgressMetrics(userId, timeFilter) {
    try {
      // Get emotion stability score
      const emotionStability = await query(
        `SELECT 
           STDDEV(intensity) as intensity_volatility,
           COUNT(*) as total_checkins,
           AVG(intensity) as avg_intensity
         FROM emotion_checkins
         WHERE user_id = $1 AND created_at >= $2`,
        [userId, timeFilter]
      );

      // Get conflict resolution rate
      const conflictResolution = await query(
        `SELECT 
           COUNT(*) as total_conflicts,
           COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) as resolved_conflicts,
           AVG(CASE 
             WHEN resolved_at IS NOT NULL 
             THEN EXTRACT(EPOCH FROM (resolved_at - created_at))/86400 
             ELSE NULL 
           END) as avg_resolution_days
         FROM conflicts
         WHERE user_id = $1 AND created_at >= $2`,
        [userId, timeFilter]
      );

      // Get engagement score
      const engagementScore = await query(
        `SELECT 
           COUNT(DISTINCT DATE(created_at)) as active_days,
           COUNT(*) as total_activities,
           COUNT(CASE WHEN table_name = 'emotion_checkins' THEN 1 END) as emotion_checkins,
           COUNT(CASE WHEN table_name = 'conflicts' THEN 1 END) as conflicts_logged
         FROM (
           SELECT created_at, 'emotion_checkins' as table_name FROM emotion_checkins WHERE user_id = $1 AND created_at >= $2
           UNION ALL
           SELECT created_at, 'conflicts' as table_name FROM conflicts WHERE user_id = $1 AND created_at >= $2
         ) combined_activities`,
        [userId, timeFilter]
      );

      const stabilityData = emotionStability.rows[0] || {};
      const resolutionData = conflictResolution.rows[0] || {};
      const engagementData = engagementScore.rows[0] || {};

      // Calculate progress score (0-100)
      const progressScore = this.calculateProgressScore(
        stabilityData,
        resolutionData,
        engagementData
      );

      return {
        emotionStability: {
          volatility: parseFloat(stabilityData.intensity_volatility || 0),
          averageIntensity: parseFloat(stabilityData.avg_intensity || 0),
          totalCheckins: parseInt(stabilityData.total_checkins || 0)
        },
        conflictResolution: {
          totalConflicts: parseInt(resolutionData.total_conflicts || 0),
          resolvedConflicts: parseInt(resolutionData.resolved_conflicts || 0),
          resolutionRate: resolutionData.total_conflicts > 0 
            ? (parseInt(resolutionData.resolved_conflicts || 0) / parseInt(resolutionData.total_conflicts)) * 100 
            : 0,
          averageResolutionDays: parseFloat(resolutionData.avg_resolution_days || 0)
        },
        engagement: {
          activeDays: parseInt(engagementData.active_days || 0),
          totalActivities: parseInt(engagementData.total_activities || 0),
          emotionCheckins: parseInt(engagementData.emotion_checkins || 0),
          conflictsLogged: parseInt(engagementData.conflicts_logged || 0)
        },
        progressScore
      };
    } catch (error) {
      console.error('Error getting progress metrics:', error);
      return {
        emotionStability: { volatility: 0, averageIntensity: 0, totalCheckins: 0 },
        conflictResolution: { totalConflicts: 0, resolvedConflicts: 0, resolutionRate: 0, averageResolutionDays: 0 },
        engagement: { activeDays: 0, totalActivities: 0, emotionCheckins: 0, conflictsLogged: 0 },
        progressScore: 0
      };
    }
  }

  /**
   * Get behavioral insights
   */
  async getBehavioralInsights(userId, timeFilter) {
    try {
      // Get emotion patterns
      const emotionPatterns = await query(
        `SELECT 
           emotion,
           COUNT(*) as frequency,
           AVG(intensity) as avg_intensity,
           COUNT(CASE WHEN EXTRACT(HOUR FROM created_at) BETWEEN 6 AND 12 THEN 1 END) as morning_count,
           COUNT(CASE WHEN EXTRACT(HOUR FROM created_at) BETWEEN 13 AND 18 THEN 1 END) as afternoon_count,
           COUNT(CASE WHEN EXTRACT(HOUR FROM created_at) BETWEEN 19 AND 23 THEN 1 END) as evening_count
         FROM emotion_checkins
         WHERE user_id = $1 AND created_at >= $2
         GROUP BY emotion
         ORDER BY frequency DESC`,
        [userId, timeFilter]
      );

      // Get trigger patterns
      const triggerPatterns = await query(
        `SELECT 
           context,
           COUNT(*) as frequency,
           array_agg(DISTINCT emotion) as associated_emotions,
           AVG(intensity) as avg_intensity
         FROM emotion_checkins
         WHERE user_id = $1 AND created_at >= $2 AND context IS NOT NULL
         GROUP BY context
         ORDER BY frequency DESC
         LIMIT 10`,
        [userId, timeFilter]
      );

      // Get conflict triggers
      const conflictTriggers = await query(
        `SELECT 
           category,
           COUNT(*) as frequency,
           AVG(CASE 
             WHEN severity = 'low' THEN 1
             WHEN severity = 'medium' THEN 2
             WHEN severity = 'high' THEN 3
             WHEN severity = 'critical' THEN 4
             ELSE 2
           END) as avg_severity
         FROM conflicts
         WHERE user_id = $1 AND created_at >= $2
         GROUP BY category
         ORDER BY frequency DESC`,
        [userId, timeFilter]
      );

      return {
        emotionPatterns: emotionPatterns.rows,
        triggerPatterns: triggerPatterns.rows,
        conflictTriggers: conflictTriggers.rows,
        insights: this.generateInsights(emotionPatterns.rows, triggerPatterns.rows, conflictTriggers.rows)
      };
    } catch (error) {
      console.error('Error getting behavioral insights:', error);
      return { emotionPatterns: [], triggerPatterns: [], conflictTriggers: [], insights: [] };
    }
  }

  /**
   * Get organization-wide analytics (for admins)
   */
  async getOrganizationAnalytics(organizationId, timeRange = '30d') {
    try {
      const timeFilter = this.getTimeFilter(timeRange);

      const [
        userMetrics,
        emotionAnalytics,
        conflictAnalytics,
        therapistMetrics
      ] = await Promise.all([
        this.getUserMetrics(organizationId, timeFilter),
        this.getOrganizationEmotionAnalytics(organizationId, timeFilter),
        this.getOrganizationConflictAnalytics(organizationId, timeFilter),
        this.getTherapistMetrics(organizationId, timeFilter)
      ]);

      return {
        timeRange,
        userMetrics,
        emotionAnalytics,
        conflictAnalytics,
        therapistMetrics,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting organization analytics:', error);
      throw new Error('Failed to generate organization analytics');
    }
  }

  /**
   * Helper methods
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

  calculateProgressScore(stabilityData, resolutionData, engagementData) {
    let score = 0;

    // Emotion stability (30% weight)
    const volatility = parseFloat(stabilityData.intensity_volatility || 0);
    const stabilityScore = Math.max(0, 100 - (volatility * 20));
    score += (stabilityScore * 0.3);

    // Conflict resolution (40% weight)
    const resolutionRate = resolutionData.total_conflicts > 0 
      ? (parseInt(resolutionData.resolved_conflicts || 0) / parseInt(resolutionData.total_conflicts)) * 100 
      : 100;
    score += (resolutionRate * 0.4);

    // Engagement (30% weight)
    const activeDays = parseInt(engagementData.active_days || 0);
    const engagementScore = Math.min(100, (activeDays / 30) * 100);
    score += (engagementScore * 0.3);

    return Math.round(score);
  }

  generateInsights(emotionPatterns, triggerPatterns, conflictTriggers) {
    const insights = [];

    // Emotion insights
    if (emotionPatterns.length > 0) {
      const topEmotion = emotionPatterns[0];
      insights.push({
        type: 'emotion',
        message: `Your most frequent emotion is ${topEmotion.emotion} (${topEmotion.frequency} times)`,
        recommendation: `Consider exploring what triggers ${topEmotion.emotion} and how to manage it effectively.`
      });
    }

    // Trigger insights
    if (triggerPatterns.length > 0) {
      const topTrigger = triggerPatterns[0];
      insights.push({
        type: 'trigger',
        message: `"${topTrigger.context}" appears to be a common trigger for emotional responses`,
        recommendation: `Develop coping strategies for situations involving ${topTrigger.context}.`
      });
    }

    // Conflict insights
    if (conflictTriggers.length > 0) {
      const topConflict = conflictTriggers[0];
      insights.push({
        type: 'conflict',
        message: `Most conflicts occur in the ${topConflict.category} category`,
        recommendation: `Focus on improving communication and conflict resolution skills in ${topConflict.category} situations.`
      });
    }

    return insights;
  }

  async getUserMetrics(organizationId, timeFilter) {
    // Implementation for organization user metrics
    return { totalUsers: 0, activeUsers: 0, newUsers: 0 };
  }

  async getOrganizationEmotionAnalytics(organizationId, timeFilter) {
    // Implementation for organization emotion analytics
    return { totalCheckins: 0, emotionDistribution: [], trends: [] };
  }

  async getOrganizationConflictAnalytics(organizationId, timeFilter) {
    // Implementation for organization conflict analytics
    return { totalConflicts: 0, resolutionRate: 0, categoryBreakdown: [] };
  }

  async getTherapistMetrics(organizationId, timeFilter) {
    // Implementation for therapist metrics
    return { totalTherapists: 0, activeTherapists: 0, sessionMetrics: [] };
  }
}

module.exports = new AnalyticsService();
