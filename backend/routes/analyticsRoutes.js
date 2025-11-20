const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const analyticsService = require('../services/analyticsService');

// Get user analytics
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeRange = '30d' } = req.query;
    const requestingUserId = req.user.userId;

    // Check if user can access this analytics (own data or admin)
    if (userId !== requestingUserId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own analytics.'
      });
    }

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate user analytics'
    });
  }
});

// Get current user analytics
router.get('/my-analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('My analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analytics'
    });
  }
});

// Get organization analytics (admin only)
router.get('/organization/:organizationId', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { timeRange = '30d' } = req.query;

    const analytics = await analyticsService.getOrganizationAnalytics(organizationId, timeRange);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Organization analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate organization analytics'
    });
  }
});

// Get emotion trends
router.get('/emotions/trends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    const trends = await analyticsService.getEmotionTrends(userId, analyticsService.getTimeFilter(timeRange));

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Emotion trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emotion trends'
    });
  }
});

// Get conflict analytics
router.get('/conflicts/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    const analytics = await analyticsService.getConflictAnalytics(userId, analyticsService.getTimeFilter(timeRange));

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Conflict analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conflict analytics'
    });
  }
});

// Get session analytics (therapist only)
router.get('/sessions/analytics', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    const analytics = await analyticsService.getSessionAnalytics(userId, analyticsService.getTimeFilter(timeRange));

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Session analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get session analytics'
    });
  }
});

// Get progress metrics
router.get('/progress/metrics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    const metrics = await analyticsService.getProgressMetrics(userId, analyticsService.getTimeFilter(timeRange));

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Progress metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get progress metrics'
    });
  }
});

// Get behavioral insights
router.get('/insights/behavioral', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    const insights = await analyticsService.getBehavioralInsights(userId, analyticsService.getTimeFilter(timeRange));

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Behavioral insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get behavioral insights'
    });
  }
});

// Get dashboard summary
router.get('/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    const [
      emotionTrends,
      conflictAnalytics,
      progressMetrics,
      behavioralInsights
    ] = await Promise.all([
      analyticsService.getEmotionTrends(userId, analyticsService.getTimeFilter(timeRange)),
      analyticsService.getConflictAnalytics(userId, analyticsService.getTimeFilter(timeRange)),
      analyticsService.getProgressMetrics(userId, analyticsService.getTimeFilter(timeRange)),
      analyticsService.getBehavioralInsights(userId, analyticsService.getTimeFilter(timeRange))
    ]);

    // Get session analytics if user is therapist
    let sessionAnalytics = null;
    if (req.user.userType === 'therapist' || req.user.userType === 'admin') {
      sessionAnalytics = await analyticsService.getSessionAnalytics(userId, analyticsService.getTimeFilter(timeRange));
    }

    const summary = {
      timeRange,
      emotionTrends: {
        totalCheckins: emotionTrends.totalCheckins,
        topEmotions: emotionTrends.emotionFrequency.slice(0, 5),
        weeklyPattern: emotionTrends.weeklyPatterns
      },
      conflictAnalytics: {
        totalConflicts: conflictAnalytics.totalConflicts,
        categoryBreakdown: conflictAnalytics.categoryBreakdown.slice(0, 5),
        resolutionRate: conflictAnalytics.resolutionPatterns.length > 0 
          ? conflictAnalytics.resolutionPatterns.reduce((sum, pattern) => 
              sum + (pattern.resolved_conflicts / pattern.total_conflicts), 0) / conflictAnalytics.resolutionPatterns.length * 100
          : 0
      },
      progressMetrics: {
        progressScore: progressMetrics.progressScore,
        emotionStability: progressMetrics.emotionStability,
        engagement: progressMetrics.engagement
      },
      behavioralInsights: {
        insights: behavioralInsights.insights.slice(0, 3),
        topTriggers: behavioralInsights.triggerPatterns.slice(0, 3)
      },
      sessionAnalytics: sessionAnalytics ? {
        totalSessions: sessionAnalytics.totalSessions,
        clientCount: sessionAnalytics.clientMetrics.length
      } : null
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate dashboard summary'
    });
  }
});

// Export analytics data
router.get('/export/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeRange = '30d', format = 'json' } = req.query;
    const requestingUserId = req.user.userId;

    // Check if user can access this analytics (own data or admin)
    if (userId !== requestingUserId && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only export your own analytics.'
      });
    }

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertAnalyticsToCSV(analytics);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}-${timeRange}.csv"`);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}-${timeRange}.json"`);
      res.json(analytics);
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export analytics'
    });
  }
});

// Helper function to convert analytics to CSV
function convertAnalyticsToCSV(analytics) {
  const lines = [];
  
  // Add headers
  lines.push('Metric,Value,Details');
  
  // Add emotion trends
  lines.push(`Total Emotion Check-ins,${analytics.emotionTrends.totalCheckins},`);
  analytics.emotionTrends.emotionFrequency.forEach(emotion => {
    lines.push(`Emotion: ${emotion.emotion},${emotion.frequency},Avg Intensity: ${emotion.avg_intensity}`);
  });
  
  // Add conflict analytics
  lines.push(`Total Conflicts,${analytics.conflictAnalytics.totalConflicts},`);
  analytics.conflictAnalytics.categoryBreakdown.forEach(category => {
    lines.push(`Conflict Category: ${category.category},${category.count},Avg Severity: ${category.avg_severity}`);
  });
  
  // Add progress metrics
  lines.push(`Progress Score,${analytics.progressMetrics.progressScore},`);
  lines.push(`Emotion Volatility,${analytics.progressMetrics.emotionStability.volatility},`);
  lines.push(`Active Days,${analytics.progressMetrics.engagement.activeDays},`);
  
  return lines.join('\n');
}

module.exports = router;
