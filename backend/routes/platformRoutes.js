const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth'); // Use middleware/auth directly
const auditLogService = require('../services/auditLogService');
const featureFlagService = require('../services/featureFlagService');

// Middleware for Platform Admin
const isPlatformAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.userType !== 'platform_admin') {
      return res.status(403).json({ error: 'Access denied. Platform Admin privileges required.' });
    }
    next();
  } catch (error) {
    console.error('Platform Admin check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Apply middleware
router.use(authenticateToken);
router.use(isPlatformAdmin);

// Get System Health (Mocked for now, but could be real)
router.get('/health', async (req, res) => {
  try {
    // Check DB connection
    const start = Date.now();
    await pool.query('SELECT 1');
    const dbLatency = Date.now() - start;

    const healthData = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date(),
      database: {
        status: 'connected',
        latency: `${dbLatency}ms`
      },
      memory: process.memoryUsage(),
      system: {
        platform: process.platform,
        nodeVersion: process.version
      }
    };
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      database: 'disconnected'
    });
  }
});

// Get Audit Logs
router.get('/audit-logs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const logs = await auditLogService.getAllLogs(limit, offset);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// System Configuration
router.get('/config', async (req, res) => {
  try {
    const flags = await featureFlagService.getAllFlags();
    
    // Convert DB flags to frontend format
    const config = {
      maintenanceMode: flags['maintenance_mode']?.enabled || false,
      allowRegistration: true, // This could be another flag
      featureFlags: {
        betaFeatures: flags['beta_features']?.enabled || false,
        newAnalytics: flags['new_analytics']?.enabled || false
      },
      // Raw flags for advanced view
      allFlags: flags
    };
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

router.post('/config', async (req, res) => {
  try {
    const { featureFlags, maintenanceMode, dynamicFlags } = req.body;
    
    // Update individual flags (legacy support for specific keys)
    if (maintenanceMode !== undefined) {
      await featureFlagService.updateFlag('maintenance_mode', maintenanceMode, req.user.id);
    }
    
    if (featureFlags) {
      if (featureFlags.betaFeatures !== undefined) {
        await featureFlagService.updateFlag('beta_features', featureFlags.betaFeatures, req.user.id);
      }
      if (featureFlags.newAnalytics !== undefined) {
        await featureFlagService.updateFlag('new_analytics', featureFlags.newAnalytics, req.user.id);
      }
    }

    // Handle dynamic flag updates
    if (dynamicFlags && typeof dynamicFlags === 'object') {
      for (const [key, value] of Object.entries(dynamicFlags)) {
        await featureFlagService.updateFlag(key, value, req.user.id);
      }
    }
    
    // Log configuration update
    await auditLogService.logSystemEvent('UPDATE_CONFIG', {
      updatedBy: req.user.id,
      changes: req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({ success: true, message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

// Broadcast Message
router.post('/broadcast', async (req, res) => {
  const { message, severity, target } = req.body;
  // Here we would save to notifications table or trigger websocket
  console.log(`BROADCAST [${severity}]: ${message} to ${target}`);
  
  // Log broadcast
  await auditLogService.logSystemEvent('BROADCAST_MESSAGE', {
    sender: req.user.id,
    message,
    severity,
    target,
    ipAddress: req.ip
  });

  res.json({ success: true, message: 'Broadcast sent successfully' });
});

module.exports = router;
