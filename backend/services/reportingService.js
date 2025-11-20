const { query } = require('../config/database');
const analyticsService = require('./analyticsService');

class ReportingService {
  /**
   * Generate executive dashboard report
   */
  async generateExecutiveReport(organizationId, timeRange = '30d') {
    try {
      const timeFilter = analyticsService.getTimeFilter(timeRange);

      const [
        userMetrics,
        platformMetrics,
        therapistMetrics,
        financialMetrics,
        systemMetrics
      ] = await Promise.all([
        this.getUserMetrics(organizationId, timeFilter),
        this.getPlatformMetrics(organizationId, timeFilter),
        this.getTherapistMetrics(organizationId, timeFilter),
        this.getFinancialMetrics(organizationId, timeFilter),
        this.getSystemMetrics(organizationId, timeFilter)
      ]);

      return {
        reportType: 'executive',
        organizationId,
        timeRange,
        generatedAt: new Date().toISOString(),
        metrics: {
          userMetrics,
          platformMetrics,
          therapistMetrics,
          financialMetrics,
          systemMetrics
        },
        insights: this.generateExecutiveInsights(userMetrics, platformMetrics, therapistMetrics),
        recommendations: this.generateExecutiveRecommendations(userMetrics, platformMetrics, therapistMetrics)
      };
    } catch (error) {
      console.error('Error generating executive report:', error);
      throw new Error('Failed to generate executive report');
    }
  }

  /**
   * Generate therapist performance report
   */
  async generateTherapistReport(therapistId, timeRange = '30d') {
    try {
      const timeFilter = analyticsService.getTimeFilter(timeRange);

      const [
        sessionMetrics,
        clientMetrics,
        performanceMetrics,
        engagementMetrics
      ] = await Promise.all([
        this.getTherapistSessionMetrics(therapistId, timeFilter),
        this.getTherapistClientMetrics(therapistId, timeFilter),
        this.getTherapistPerformanceMetrics(therapistId, timeFilter),
        this.getTherapistEngagementMetrics(therapistId, timeFilter)
      ]);

      return {
        reportType: 'therapist',
        therapistId,
        timeRange,
        generatedAt: new Date().toISOString(),
        metrics: {
          sessionMetrics,
          clientMetrics,
          performanceMetrics,
          engagementMetrics
        },
        insights: this.generateTherapistInsights(sessionMetrics, clientMetrics, performanceMetrics),
        recommendations: this.generateTherapistRecommendations(sessionMetrics, clientMetrics, performanceMetrics)
      };
    } catch (error) {
      console.error('Error generating therapist report:', error);
      throw new Error('Failed to generate therapist report');
    }
  }

  /**
   * Generate client progress report
   */
  async generateClientReport(clientId, timeRange = '30d') {
    try {
      const timeFilter = analyticsService.getTimeFilter(timeRange);

      const [
        emotionProgress,
        conflictResolution,
        sessionAttendance,
        goalAchievement
      ] = await Promise.all([
        this.getClientEmotionProgress(clientId, timeFilter),
        this.getClientConflictResolution(clientId, timeFilter),
        this.getClientSessionAttendance(clientId, timeFilter),
        this.getClientGoalAchievement(clientId, timeFilter)
      ]);

      return {
        reportType: 'client',
        clientId,
        timeRange,
        generatedAt: new Date().toISOString(),
        metrics: {
          emotionProgress,
          conflictResolution,
          sessionAttendance,
          goalAchievement
        },
        insights: this.generateClientInsights(emotionProgress, conflictResolution, sessionAttendance),
        recommendations: this.generateClientRecommendations(emotionProgress, conflictResolution, sessionAttendance)
      };
    } catch (error) {
      console.error('Error generating client report:', error);
      throw new Error('Failed to generate client report');
    }
  }

  /**
   * Export report in various formats
   */
  async exportReport(reportData, format = 'pdf') {
    try {
      switch (format.toLowerCase()) {
        case 'pdf':
          return await this.generatePDFReport(reportData);
        case 'excel':
          return await this.generateExcelReport(reportData);
        case 'csv':
          return await this.generateCSVReport(reportData);
        case 'json':
          return JSON.stringify(reportData, null, 2);
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }

  /**
   * Get user metrics for executive dashboard
   */
  async getUserMetrics(organizationId, timeFilter) {
    try {
      // Total users
      const totalUsers = await query(
        'SELECT COUNT(*) as count FROM users WHERE created_at >= $1',
        [timeFilter]
      );

      // Active users (users with activity in the last 7 days)
      const activeUsers = await query(
        `SELECT COUNT(DISTINCT user_id) as count FROM (
           SELECT user_id FROM emotion_checkins WHERE created_at >= NOW() - INTERVAL '7 days'
           UNION
           SELECT user_id FROM conflicts WHERE created_at >= NOW() - INTERVAL '7 days'
           UNION
           SELECT therapist_id as user_id FROM therapy_sessions WHERE scheduled_at >= NOW() - INTERVAL '7 days'
         ) active_activities`,
        []
      );

      // New users this period
      const newUsers = await query(
        'SELECT COUNT(*) as count FROM users WHERE created_at >= $1',
        [timeFilter]
      );

      // User retention rate
      const retentionRate = await query(
        `SELECT 
           COUNT(CASE WHEN created_at >= $1 THEN 1 END) as new_users,
           COUNT(CASE WHEN created_at < $1 AND last_login >= $1 THEN 1 END) as returning_users
         FROM users`,
        [timeFilter]
      );

      const retention = retentionRate.rows[0];
      const retentionPercentage = retention.new_users > 0 
        ? (retention.returning_users / retention.new_users) * 100 
        : 0;

      return {
        totalUsers: parseInt(totalUsers.rows[0].count),
        activeUsers: parseInt(activeUsers.rows[0].count),
        newUsers: parseInt(newUsers.rows[0].count),
        retentionRate: Math.round(retentionPercentage * 100) / 100
      };
    } catch (error) {
      console.error('Error getting user metrics:', error);
      return { totalUsers: 0, activeUsers: 0, newUsers: 0, retentionRate: 0 };
    }
  }

  /**
   * Get platform metrics
   */
  async getPlatformMetrics(organizationId, timeFilter) {
    try {
      // Total emotion check-ins
      const emotionCheckins = await query(
        'SELECT COUNT(*) as count FROM emotion_checkins WHERE created_at >= $1',
        [timeFilter]
      );

      // Total conflicts logged
      const conflicts = await query(
        'SELECT COUNT(*) as count FROM conflicts WHERE created_at >= $1',
        [timeFilter]
      );

      // Total therapy sessions
      const sessions = await query(
        'SELECT COUNT(*) as count FROM therapy_sessions WHERE scheduled_at >= $1',
        [timeFilter]
      );

      // Average session duration
      const avgSessionDuration = await query(
        'SELECT AVG(duration_minutes) as avg_duration FROM therapy_sessions WHERE scheduled_at >= $1 AND duration_minutes IS NOT NULL',
        [timeFilter]
      );

      return {
        totalEmotionCheckins: parseInt(emotionCheckins.rows[0].count),
        totalConflicts: parseInt(conflicts.rows[0].count),
        totalSessions: parseInt(sessions.rows[0].count),
        averageSessionDuration: parseFloat(avgSessionDuration.rows[0].avg_duration || 0)
      };
    } catch (error) {
      console.error('Error getting platform metrics:', error);
      return { totalEmotionCheckins: 0, totalConflicts: 0, totalSessions: 0, averageSessionDuration: 0 };
    }
  }

  /**
   * Get therapist metrics
   */
  async getTherapistMetrics(organizationId, timeFilter) {
    try {
      // Total therapists
      const totalTherapists = await query(
        'SELECT COUNT(*) as count FROM users WHERE user_type = \'therapist\' AND created_at >= $1',
        [timeFilter]
      );

      // Active therapists
      const activeTherapists = await query(
        `SELECT COUNT(DISTINCT therapist_id) as count 
         FROM therapy_sessions 
         WHERE scheduled_at >= $1`,
        [timeFilter]
      );

      // Average sessions per therapist
      const avgSessionsPerTherapist = await query(
        `SELECT AVG(session_count) as avg_sessions FROM (
           SELECT therapist_id, COUNT(*) as session_count
           FROM therapy_sessions
           WHERE scheduled_at >= $1
           GROUP BY therapist_id
         ) therapist_sessions`,
        [timeFilter]
      );

      // Client satisfaction (mock data for now)
      const clientSatisfaction = await query(
        'SELECT AVG(CAST(COALESCE(metadata->>\'satisfaction_score\', \'0\') AS NUMERIC)) as avg_satisfaction FROM user_metadata WHERE user_type = \'client\'',
        []
      );

      return {
        totalTherapists: parseInt(totalTherapists.rows[0].count),
        activeTherapists: parseInt(activeTherapists.rows[0].count),
        averageSessionsPerTherapist: parseFloat(avgSessionsPerTherapist.rows[0].avg_sessions || 0),
        clientSatisfaction: parseFloat(clientSatisfaction.rows[0].avg_satisfaction || 0)
      };
    } catch (error) {
      console.error('Error getting therapist metrics:', error);
      return { totalTherapists: 0, activeTherapists: 0, averageSessionsPerTherapist: 0, clientSatisfaction: 0 };
    }
  }

  /**
   * Get financial metrics
   */
  async getFinancialMetrics(organizationId, timeFilter) {
    try {
      // This would typically connect to payment/billing system
      // For now, return mock data structure
      return {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        averageRevenuePerUser: 0,
        churnRate: 0,
        customerLifetimeValue: 0
      };
    } catch (error) {
      console.error('Error getting financial metrics:', error);
      return { totalRevenue: 0, monthlyRecurringRevenue: 0, averageRevenuePerUser: 0, churnRate: 0, customerLifetimeValue: 0 };
    }
  }

  /**
   * Get system metrics
   */
  async getSystemMetrics(organizationId, timeFilter) {
    try {
      // System uptime, performance metrics, etc.
      return {
        uptime: 99.9,
        averageResponseTime: 150,
        errorRate: 0.1,
        activeConnections: 0
      };
    } catch (error) {
      console.error('Error getting system metrics:', error);
      return { uptime: 0, averageResponseTime: 0, errorRate: 0, activeConnections: 0 };
    }
  }

  /**
   * Get therapist session metrics
   */
  async getTherapistSessionMetrics(therapistId, timeFilter) {
    try {
      const sessions = await query(
        `SELECT 
           COUNT(*) as total_sessions,
           COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
           COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_sessions,
           AVG(duration_minutes) as avg_duration,
           SUM(duration_minutes) as total_duration
         FROM therapy_sessions
         WHERE therapist_id = $1 AND scheduled_at >= $2`,
        [therapistId, timeFilter]
      );

      const sessionData = sessions.rows[0];
      const completionRate = sessionData.total_sessions > 0 
        ? (parseInt(sessionData.completed_sessions) / parseInt(sessionData.total_sessions)) * 100 
        : 0;

      return {
        totalSessions: parseInt(sessionData.total_sessions),
        completedSessions: parseInt(sessionData.completed_sessions),
        cancelledSessions: parseInt(sessionData.cancelled_sessions),
        completionRate: Math.round(completionRate * 100) / 100,
        averageDuration: parseFloat(sessionData.avg_duration || 0),
        totalDuration: parseFloat(sessionData.total_duration || 0)
      };
    } catch (error) {
      console.error('Error getting therapist session metrics:', error);
      return { totalSessions: 0, completedSessions: 0, cancelledSessions: 0, completionRate: 0, averageDuration: 0, totalDuration: 0 };
    }
  }

  /**
   * Get therapist client metrics
   */
  async getTherapistClientMetrics(therapistId, timeFilter) {
    try {
      const clients = await query(
        `SELECT 
           COUNT(DISTINCT client_id) as total_clients,
           COUNT(DISTINCT CASE WHEN s.scheduled_at >= $2 THEN client_id END) as active_clients
         FROM therapy_sessions s
         WHERE s.therapist_id = $1`,
        [therapistId, timeFilter]
      );

      const clientData = clients.rows[0];

      return {
        totalClients: parseInt(clientData.total_clients),
        activeClients: parseInt(clientData.active_clients)
      };
    } catch (error) {
      console.error('Error getting therapist client metrics:', error);
      return { totalClients: 0, activeClients: 0 };
    }
  }

  /**
   * Get therapist performance metrics
   */
  async getTherapistPerformanceMetrics(therapistId, timeFilter) {
    try {
      // This would include client satisfaction, progress metrics, etc.
      return {
        clientSatisfactionScore: 4.5,
        averageClientProgress: 75,
        goalAchievementRate: 80,
        clientRetentionRate: 85
      };
    } catch (error) {
      console.error('Error getting therapist performance metrics:', error);
      return { clientSatisfactionScore: 0, averageClientProgress: 0, goalAchievementRate: 0, clientRetentionRate: 0 };
    }
  }

  /**
   * Get therapist engagement metrics
   */
  async getTherapistEngagementMetrics(therapistId, timeFilter) {
    try {
      const engagement = await query(
        `SELECT 
           COUNT(DISTINCT DATE(scheduled_at)) as active_days,
           COUNT(*) as total_sessions,
           MAX(scheduled_at) as last_session
         FROM therapy_sessions
         WHERE therapist_id = $1 AND scheduled_at >= $2`,
        [therapistId, timeFilter]
      );

      const engagementData = engagement.rows[0];

      return {
        activeDays: parseInt(engagementData.active_days),
        totalSessions: parseInt(engagementData.total_sessions),
        lastSession: engagementData.last_session
      };
    } catch (error) {
      console.error('Error getting therapist engagement metrics:', error);
      return { activeDays: 0, totalSessions: 0, lastSession: null };
    }
  }

  /**
   * Generate executive insights
   */
  generateExecutiveInsights(userMetrics, platformMetrics, therapistMetrics) {
    const insights = [];

    if (userMetrics.retentionRate > 80) {
      insights.push({
        type: 'positive',
        message: `High user retention rate of ${userMetrics.retentionRate}% indicates strong platform engagement`,
        impact: 'high'
      });
    }

    if (platformMetrics.totalEmotionCheckins > 1000) {
      insights.push({
        type: 'positive',
        message: `Strong user engagement with ${platformMetrics.totalEmotionCheckins} emotion check-ins`,
        impact: 'medium'
      });
    }

    if (therapistMetrics.clientSatisfaction < 4.0) {
      insights.push({
        type: 'warning',
        message: `Client satisfaction score of ${therapistMetrics.clientSatisfaction} needs improvement`,
        impact: 'high'
      });
    }

    return insights;
  }

  /**
   * Generate executive recommendations
   */
  generateExecutiveRecommendations(userMetrics, platformMetrics, therapistMetrics) {
    const recommendations = [];

    if (userMetrics.retentionRate < 70) {
      recommendations.push({
        priority: 'high',
        action: 'Improve user onboarding and engagement strategies',
        expectedImpact: 'Increase retention rate by 15-20%'
      });
    }

    if (therapistMetrics.averageSessionsPerTherapist < 10) {
      recommendations.push({
        priority: 'medium',
        action: 'Provide additional training and support for therapists',
        expectedImpact: 'Increase therapist productivity and client satisfaction'
      });
    }

    return recommendations;
  }

  /**
   * Generate therapist insights
   */
  generateTherapistInsights(sessionMetrics, clientMetrics, performanceMetrics) {
    const insights = [];

    if (sessionMetrics.completionRate > 90) {
      insights.push({
        type: 'positive',
        message: `Excellent session completion rate of ${sessionMetrics.completionRate}%`,
        impact: 'high'
      });
    }

    if (clientMetrics.activeClients > 10) {
      insights.push({
        type: 'positive',
        message: `Managing ${clientMetrics.activeClients} active clients effectively`,
        impact: 'medium'
      });
    }

    return insights;
  }

  /**
   * Generate therapist recommendations
   */
  generateTherapistRecommendations(sessionMetrics, clientMetrics, performanceMetrics) {
    const recommendations = [];

    if (sessionMetrics.completionRate < 80) {
      recommendations.push({
        priority: 'high',
        action: 'Review session scheduling and client communication',
        expectedImpact: 'Improve session completion rate'
      });
    }

    return recommendations;
  }

  /**
   * Generate client insights
   */
  generateClientInsights(emotionProgress, conflictResolution, sessionAttendance) {
    const insights = [];

    if (emotionProgress.progressScore > 80) {
      insights.push({
        type: 'positive',
        message: `Excellent emotional progress with score of ${emotionProgress.progressScore}`,
        impact: 'high'
      });
    }

    return insights;
  }

  /**
   * Generate client recommendations
   */
  generateClientRecommendations(emotionProgress, conflictResolution, sessionAttendance) {
    const recommendations = [];

    if (sessionAttendance.attendanceRate < 80) {
      recommendations.push({
        priority: 'medium',
        action: 'Improve session attendance consistency',
        expectedImpact: 'Better therapeutic outcomes'
      });
    }

    return recommendations;
  }

  /**
   * Generate PDF report (placeholder)
   */
  async generatePDFReport(reportData) {
    // This would integrate with a PDF generation library like Puppeteer or PDFKit
    return {
      format: 'pdf',
      content: 'PDF content would be generated here',
      filename: `report-${reportData.reportType}-${Date.now()}.pdf`
    };
  }

  /**
   * Generate Excel report (placeholder)
   */
  async generateExcelReport(reportData) {
    // This would integrate with an Excel generation library like ExcelJS
    return {
      format: 'excel',
      content: 'Excel content would be generated here',
      filename: `report-${reportData.reportType}-${Date.now()}.xlsx`
    };
  }

  /**
   * Generate CSV report
   */
  async generateCSVReport(reportData) {
    const csvLines = [];
    
    // Add report metadata
    csvLines.push('Report Type,Value');
    csvLines.push(`Generated At,${reportData.generatedAt}`);
    csvLines.push(`Time Range,${reportData.timeRange}`);
    
    // Add metrics based on report type
    if (reportData.reportType === 'executive') {
      csvLines.push('Metric,Value');
      csvLines.push(`Total Users,${reportData.metrics.userMetrics.totalUsers}`);
      csvLines.push(`Active Users,${reportData.metrics.userMetrics.activeUsers}`);
      csvLines.push(`Retention Rate,${reportData.metrics.userMetrics.retentionRate}%`);
    }
    
    return {
      format: 'csv',
      content: csvLines.join('\n'),
      filename: `report-${reportData.reportType}-${Date.now()}.csv`
    };
  }

  // Additional helper methods for client reports
  async getClientEmotionProgress(clientId, timeFilter) {
    // Implementation for client emotion progress
    return { progressScore: 75, trend: 'improving', insights: [] };
  }

  async getClientConflictResolution(clientId, timeFilter) {
    // Implementation for client conflict resolution
    return { resolutionRate: 80, averageResolutionTime: 3.5, insights: [] };
  }

  async getClientSessionAttendance(clientId, timeFilter) {
    // Implementation for client session attendance
    return { attendanceRate: 85, totalSessions: 12, insights: [] };
  }

  async getClientGoalAchievement(clientId, timeFilter) {
    // Implementation for client goal achievement
    return { achievementRate: 70, goalsCompleted: 5, insights: [] };
  }
}

module.exports = new ReportingService();
