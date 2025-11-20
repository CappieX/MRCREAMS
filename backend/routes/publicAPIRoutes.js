const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  authenticateAPIKey,
  checkAPIPermissions,
  logAPIUsage,
  apiRateLimit,
  validateAPIVersion,
  addAPIHeaders,
  handleAPIErrors,
  validateRequestFormat
} = require('../middleware/apiAuth');
const apiKeyService = require('../services/apiKeyService');
const analyticsService = require('../services/analyticsService');

// Apply API middleware to all routes
router.use(validateAPIVersion);
router.use(addAPIHeaders);
router.use(validateRequestFormat);
router.use(authenticateAPIKey);
router.use(apiRateLimit);
router.use(logAPIUsage);

// API Key Management Routes (require user authentication)
router.post('/keys', authenticateToken, async (req, res) => {
  try {
    const { keyName, permissions = [], rateLimit = 1000 } = req.body;
    const userId = req.user.userId;

    if (!keyName) {
      return res.status(400).json({
        success: false,
        message: 'Key name is required',
        code: 'MISSING_KEY_NAME'
      });
    }

    const result = await apiKeyService.generateAPIKey(userId, keyName, permissions, rateLimit);

    res.status(201).json(result);
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create API key',
      code: 'CREATE_KEY_ERROR'
    });
  }
});

router.get('/keys', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const keys = await apiKeyService.getUserAPIKeys(userId);

    res.json({
      success: true,
      data: { keys }
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get API keys',
      code: 'GET_KEYS_ERROR'
    });
  }
});

router.put('/keys/:keyId', authenticateToken, async (req, res) => {
  try {
    const { keyId } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const result = await apiKeyService.updateAPIKey(keyId, userId, updates);

    res.json(result);
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update API key',
      code: 'UPDATE_KEY_ERROR'
    });
  }
});

router.delete('/keys/:keyId', authenticateToken, async (req, res) => {
  try {
    const { keyId } = req.params;
    const userId = req.user.userId;

    const result = await apiKeyService.revokeAPIKey(keyId, userId);

    res.json(result);
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke API key',
      code: 'REVOKE_KEY_ERROR'
    });
  }
});

router.get('/keys/:keyId/usage', authenticateToken, async (req, res) => {
  try {
    const { keyId } = req.params;
    const userId = req.user.userId;
    const { timeRange = '30d' } = req.query;

    // Verify user owns this API key
    const keys = await apiKeyService.getUserAPIKeys(userId);
    const keyExists = keys.some(key => key.id === keyId);

    if (!keyExists) {
      return res.status(404).json({
        success: false,
        message: 'API key not found',
        code: 'KEY_NOT_FOUND'
      });
    }

    const stats = await apiKeyService.getAPIUsageStats(keyId, timeRange);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get API usage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get usage statistics',
      code: 'USAGE_STATS_ERROR'
    });
  }
});

// Public API Endpoints

// Emotion Analysis API
router.post('/emotions/analyze', checkAPIPermissions(['emotions:analyze', 'emotions:*']), async (req, res) => {
  try {
    const { text, emotions, context } = req.body;

    if (!text && !emotions) {
      return res.status(400).json({
        success: false,
        message: 'Text or emotions array is required',
        code: 'MISSING_INPUT'
      });
    }

    const aiEmotionService = require('../services/aiEmotionService');
    const analysis = await aiEmotionService.analyzeTextForEmotions(text || '', emotions || []);

    res.json({
      success: true,
      data: {
        analysis,
        timestamp: new Date().toISOString(),
        apiVersion: req.apiVersion
      }
    });
  } catch (error) {
    console.error('Emotion analysis API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze emotions',
      code: 'ANALYSIS_ERROR'
    });
  }
});

router.get('/emotions/patterns/:userId', checkAPIPermissions(['emotions:patterns', 'emotions:*']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeRange = '30d' } = req.query;

    // Check if user can access this data
    if (req.apiKey.userId !== userId && !req.apiKey.permissions.includes('admin:*')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to user data',
        code: 'ACCESS_DENIED'
      });
    }

    const timeFilter = analyticsService.getTimeFilter(timeRange);
    const patterns = await analyticsService.getEmotionTrends(userId, timeFilter);

    res.json({
      success: true,
      data: {
        patterns,
        timeRange,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Emotion patterns API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get emotion patterns',
      code: 'PATTERNS_ERROR'
    });
  }
});

// Analytics API
router.get('/analytics/user/:userId', checkAPIPermissions(['analytics:read', 'analytics:*']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeRange = '30d' } = req.query;

    // Check if user can access this data
    if (req.apiKey.userId !== userId && !req.apiKey.permissions.includes('admin:*')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to user analytics',
        code: 'ACCESS_DENIED'
      });
    }

    const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

    res.json({
      success: true,
      data: {
        analytics,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      code: 'ANALYTICS_ERROR'
    });
  }
});

// Conflict Analysis API
router.post('/conflicts/analyze', checkAPIPermissions(['conflicts:analyze', 'conflicts:*']), async (req, res) => {
  try {
    const { title, description, category, severity, participants } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
        code: 'MISSING_INPUT'
      });
    }

    const aiEmotionService = require('../services/aiEmotionService');
    const analysis = await aiEmotionService.analyzeTextForEmotions(description);

    res.json({
      success: true,
      data: {
        analysis,
        recommendations: analysis.insights || [],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Conflict analysis API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze conflict',
      code: 'ANALYSIS_ERROR'
    });
  }
});

// User Management API
router.get('/users/:userId', checkAPIPermissions(['users:read', 'users:*']), async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user can access this data
    if (req.apiKey.userId !== userId && !req.apiKey.permissions.includes('admin:*')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to user data',
        code: 'ACCESS_DENIED'
      });
    }

    const { query } = require('../config/database');
    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.user_type, u.created_at,
              um.date_of_birth, um.phone_number, um.preferred_language, um.timezone
       FROM users u
       LEFT JOIN user_metadata um ON u.id = um.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          createdAt: user.created_at,
          metadata: {
            dateOfBirth: user.date_of_birth,
            phoneNumber: user.phone_number,
            preferredLanguage: user.preferred_language,
            timezone: user.timezone
          }
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      code: 'USER_ERROR'
    });
  }
});

// Webhook Management API
router.post('/webhooks', checkAPIPermissions(['webhooks:create', 'webhooks:*']), async (req, res) => {
  try {
    const { url, events, secret } = req.body;

    if (!url || !events || !Array.isArray(events)) {
      return res.status(400).json({
        success: false,
        message: 'URL and events array are required',
        code: 'MISSING_INPUT'
      });
    }

    const { query } = require('../config/database');
    const result = await query(
      `INSERT INTO webhooks (user_id, url, events, secret, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, url, events, created_at`,
      [req.apiKey.userId, url, JSON.stringify(events), secret]
    );

    const webhook = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        webhook: {
          id: webhook.id,
          url: webhook.url,
          events: JSON.parse(webhook.events),
          createdAt: webhook.created_at
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Webhook creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create webhook',
      code: 'WEBHOOK_ERROR'
    });
  }
});

router.get('/webhooks', checkAPIPermissions(['webhooks:read', 'webhooks:*']), async (req, res) => {
  try {
    const { query } = require('../config/database');
    const result = await query(
      `SELECT id, url, events, is_active, created_at, updated_at, last_triggered
       FROM webhooks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.apiKey.userId]
    );

    const webhooks = result.rows.map(row => ({
      id: row.id,
      url: row.url,
      events: JSON.parse(row.events),
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastTriggered: row.last_triggered
    }));

    res.json({
      success: true,
      data: {
        webhooks,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get webhooks',
      code: 'WEBHOOK_ERROR'
    });
  }
});

// API Status and Health Check
router.get('/status', async (req, res) => {
  try {
    const { query } = require('../config/database');
    
    // Test database connection
    const dbResult = await query('SELECT 1 as test');
    const dbStatus = dbResult.rows[0] ? 'healthy' : 'unhealthy';

    res.json({
      success: true,
      data: {
        status: 'operational',
        timestamp: new Date().toISOString(),
        version: req.apiVersion,
        services: {
          database: dbStatus,
          api: 'healthy'
        },
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Service unhealthy',
      code: 'SERVICE_ERROR'
    });
  }
});

// API Documentation endpoint
router.get('/docs', async (req, res) => {
  try {
    const documentation = {
      title: 'MR.CREAMS Public API',
      version: req.apiVersion,
      description: 'AI-Powered Emotional Intelligence Platform API',
      baseUrl: `${req.protocol}://${req.get('host')}/api/public`,
      authentication: {
        type: 'API Key',
        header: 'X-API-Key',
        description: 'Include your API key in the X-API-Key header'
      },
      endpoints: {
        'POST /emotions/analyze': {
          description: 'Analyze text for emotions',
          permissions: ['emotions:analyze'],
          parameters: {
            text: 'string (optional)',
            emotions: 'array (optional)',
            context: 'string (optional)'
          }
        },
        'GET /emotions/patterns/:userId': {
          description: 'Get emotion patterns for a user',
          permissions: ['emotions:patterns'],
          parameters: {
            userId: 'string (required)',
            timeRange: 'string (optional, default: 30d)'
          }
        },
        'GET /analytics/user/:userId': {
          description: 'Get analytics for a user',
          permissions: ['analytics:read'],
          parameters: {
            userId: 'string (required)',
            timeRange: 'string (optional, default: 30d)'
          }
        },
        'POST /conflicts/analyze': {
          description: 'Analyze conflict description',
          permissions: ['conflicts:analyze'],
          parameters: {
            title: 'string (required)',
            description: 'string (required)',
            category: 'string (optional)',
            severity: 'string (optional)',
            participants: 'array (optional)'
          }
        },
        'GET /users/:userId': {
          description: 'Get user information',
          permissions: ['users:read'],
          parameters: {
            userId: 'string (required)'
          }
        }
      },
      rateLimits: {
        default: '1000 requests per hour',
        description: 'Rate limits are applied per API key'
      },
      errorCodes: {
        'MISSING_API_KEY': 'API key is required',
        'INVALID_API_KEY': 'API key is invalid or expired',
        'RATE_LIMIT_EXCEEDED': 'Rate limit exceeded',
        'INSUFFICIENT_PERMISSIONS': 'Insufficient permissions for this operation',
        'ACCESS_DENIED': 'Access denied to requested resource'
      }
    };

    res.json({
      success: true,
      data: documentation
    });
  } catch (error) {
    console.error('Documentation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get documentation',
      code: 'DOCS_ERROR'
    });
  }
});

// Error handling middleware
router.use(handleAPIErrors);

module.exports = router;
