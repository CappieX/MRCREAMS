const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth'); // Use middleware/auth directly
const auditLogService = require('../services/auditLogService');
const featureFlagService = require('../services/featureFlagService');
const apiKeyService = require('../services/apiKeyService');
const reportingService = require('../services/reportingService');

// Middleware for Platform Admin
const isPlatformAdmin = async (req, res, next) => {
  try {
    const role = (req.user && (req.user.userType || req.user.user_type || req.user.role)) || null;
    if (role !== 'platform_admin') {
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
    sender: req.user.userId || req.user.id,
    message,
    severity,
    target,
    ipAddress: req.ip
  });

  res.json({ success: true, message: 'Broadcast sent successfully' });
});

// =============================
// Users Management
// =============================
router.get('/users', async (req, res) => {
  try {
    const { status = 'all', userType = 'all', q = '', limit = 20, offset = 0, sort = 'created_at', order = 'desc', from, to } = req.query;
    const values = [];
    const where = [];
    let idx = 1;

    if (status !== 'all') {
      where.push(`is_active = $${idx++}`);
      values.push(status === 'active');
    }
    if (userType !== 'all') {
      where.push(`user_type = $${idx++}`);
      values.push(userType);
    }
    if (q) {
      where.push(`(LOWER(name) LIKE $${idx} OR LOWER(email) LIKE $${idx})`);
      values.push(`%${q.toLowerCase()}%`);
      idx++;
    }
    if (from) {
      where.push(`created_at >= $${idx++}`);
      values.push(new Date(from));
    }
    if (to) {
      where.push(`created_at <= $${idx++}`);
      values.push(new Date(to));
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const orderClause = ['name','email','created_at','user_type','is_active'].includes(sort) ? `ORDER BY ${sort} ${order.toLowerCase() === 'asc' ? 'ASC' : 'DESC'}` : 'ORDER BY created_at DESC';

    const list = await pool.query(
      `SELECT id, name, email, user_type, is_active, created_at 
       FROM users 
       ${whereClause}
       ${orderClause}
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, parseInt(limit), parseInt(offset)]
    );

    const count = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      values
    );

    res.json({
      users: list.rows,
      pagination: { total: parseInt(count.rows[0].total), limit: parseInt(limit), offset: parseInt(offset) }
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userRes = await pool.query(
      `SELECT id, name, email, user_type, is_active, created_at FROM users WHERE id = $1`,
      [id]
    );
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const conflictsRes = await pool.query(
      `SELECT id, date, time, conflict_reason, fight_degree, time_consumption, final_result, remark 
       FROM conflicts WHERE user_id = $1 ORDER BY date DESC, time DESC LIMIT 50`,
      [id]
    );

    const activityLogs = await auditLogService.getUserAuditLogs(id, 50, 0);

    res.json({ user: userRes.rows[0], conflicts: conflictsRes.rows, activityLogs });
  } catch (error) {
    console.error('User detail error:', error);
    res.status(500).json({ error: 'Failed to fetch user detail' });
  }
});

router.post('/users/bulk-actions', async (req, res) => {
  try {
    const { action, userIds = [] } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) return res.status(400).json({ error: 'No users provided' });

    if (!['activate', 'deactivate'].includes(action)) return res.status(400).json({ error: 'Invalid action' });

    const activeValue = action === 'activate';
    await pool.query(`UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = ANY($2::int[])`, [activeValue, userIds]);

    await auditLogService.logSystemEvent('USER_BULK_UPDATE', { action, userIds, adminId: req.user.userId || req.user.id });
    res.json({ success: true, message: `Users ${action}d successfully` });
  } catch (error) {
    console.error('Bulk actions error:', error);
    res.status(500).json({ error: 'Failed to perform bulk action' });
  }
});

// =============================
// Conflicts Administration
// =============================
router.get('/conflicts', async (req, res) => {
  try {
    const { status = 'all', intensity = 'all', duration = 'all', limit = 20, offset = 0 } = req.query;
    const where = [];
    const values = [];
    let i = 1;

    if (status !== 'all') {
      where.push(`final_result = $${i++}`);
      values.push(status);
    }
    if (intensity !== 'all') {
      where.push(`fight_degree >= $${i++}`);
      values.push(parseInt(intensity));
    }
    if (duration !== 'all') {
      where.push(`time_consumption >= $${i++}`);
      values.push(parseInt(duration));
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const rows = await pool.query(
      `SELECT id, user_id, date, time, conflict_reason, fight_degree, time_consumption, final_result 
       FROM conflicts ${whereClause}
       ORDER BY date DESC, time DESC
       LIMIT $${i} OFFSET $${i + 1}`,
      [...values, parseInt(limit), parseInt(offset)]
    );
    res.json(rows.rows);
  } catch (error) {
    console.error('Get conflicts error:', error);
    res.status(500).json({ error: 'Failed to fetch conflicts' });
  }
});

router.get('/conflicts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await pool.query(
      `SELECT c.*, u.name as user_name, u.email as user_email 
       FROM conflicts c JOIN users u ON c.user_id = u.id WHERE c.id = $1`,
      [id]
    );
    if (detail.rows.length === 0) return res.status(404).json({ error: 'Conflict not found' });

    const timeline = await auditLogService.getResourceAuditLogs('conflicts', id, 50, 0);

    res.json({ conflict: detail.rows[0], timeline, resolutionProgress: { score: 0.7 } });
  } catch (error) {
    console.error('Conflict detail error:', error);
    res.status(500).json({ error: 'Failed to fetch conflict detail' });
  }
});

router.post('/conflicts/:id/escalate', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, severity = 'high' } = req.body;
    await auditLogService.logSystemEvent('CONFLICT_ESCALATED', { conflictId: id, reason, severity, adminId: req.user.userId || req.user.id });
    res.json({ success: true, message: 'Conflict escalated' });
  } catch (error) {
    console.error('Conflict escalate error:', error);
    res.status(500).json({ error: 'Failed to escalate conflict' });
  }
});

router.get('/conflicts/export', async (req, res) => {
  try {
    const rows = await pool.query(`SELECT id, user_id, date, time, conflict_reason, fight_degree, time_consumption, final_result FROM conflicts ORDER BY date DESC LIMIT 1000`);
    const header = 'id,user_id,date,time,conflict_reason,fight_degree,time_consumption,final_result\n';
    const csvBody = rows.rows.map(r => `${r.id},${r.user_id},${r.date},${r.time},"${(r.conflict_reason||'').replace(/"/g,'\"')}",${r.fight_degree},${r.time_consumption},"${(r.final_result||'').replace(/"/g,'\"')}"`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="conflicts_export.csv"');
    res.send(header + csvBody);
  } catch (error) {
    console.error('Conflicts export error:', error);
    res.status(500).json({ error: 'Failed to export conflicts' });
  }
});

// =============================
// Professionals Management
// =============================
router.get('/professionals/verification-queue', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tv.user_id, u.name, u.email, tv.status, tv.license_number, tv.license_state, tv.credentials, tv.reviewed_at
       FROM therapist_verifications tv JOIN users u ON tv.user_id = u.id
       WHERE tv.status = 'pending' ORDER BY tv.reviewed_at DESC NULLS LAST`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Verification queue error:', error);
    res.status(500).json({ error: 'Failed to fetch verification queue' });
  }
});

router.get('/professionals/:id/credentials', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT tv.*, u.name, u.email FROM therapist_verifications tv JOIN users u ON tv.user_id = u.id WHERE tv.user_id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Credentials not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Credential review error:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

router.get('/professionals/metrics', async (req, res) => {
  try {
    const timeFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const metrics = await reportingService.getTherapistMetrics(null, timeFilter);
    res.json(metrics);
  } catch (error) {
    console.error('Professional metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

router.get('/professionals/availability', async (req, res) => {
  try {
    const { from = new Date().toISOString(), days = 14 } = req.query;
    const result = await pool.query(
      `SELECT ts.therapist_id, u.name as therapist_name, ts.scheduled_at, ts.status
       FROM therapy_sessions ts JOIN users u ON ts.therapist_id = u.id
       WHERE ts.scheduled_at >= $1 AND ts.scheduled_at < CURRENT_DATE + INTERVAL '${parseInt(days)} days'
       ORDER BY ts.scheduled_at ASC`,
      [new Date(from)]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Availability calendar error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// =============================
// Analytics Hub
// =============================
router.get('/analytics/conflicts-trend', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(date) as day, COUNT(*) as count FROM conflicts GROUP BY DATE(date) ORDER BY day DESC LIMIT 30`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Conflicts trend error:', error);
    res.status(500).json({ error: 'Failed to fetch conflict trend' });
  }
});

router.get('/analytics/emotions-heatmap', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT conflict_reason as category, COUNT(*) as value FROM conflicts GROUP BY conflict_reason`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Emotions heatmap error:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap' });
  }
});

router.get('/analytics/user-retention', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DATE(created_at) as cohort, COUNT(*) as users FROM users GROUP BY DATE(created_at) ORDER BY cohort DESC LIMIT 12`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('User retention error:', error);
    res.status(500).json({ error: 'Failed to fetch retention' });
  }
});

router.get('/analytics/geographic', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(um.metadata->>'country', 'Unknown') as country, COUNT(*) as users
       FROM user_metadata um GROUP BY COALESCE(um.metadata->>'country','Unknown') ORDER BY users DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Geographic distribution error:', error);
    res.status(500).json({ error: 'Failed to fetch geographic distribution' });
  }
});

router.get('/analytics/usage-peaks', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT date_part('hour', time::time) as hour, COUNT(*) as count FROM conflicts GROUP BY date_part('hour', time::time) ORDER BY hour`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Usage peaks error:', error);
    res.status(500).json({ error: 'Failed to fetch usage peaks' });
  }
});

router.get('/analytics/export', async (req, res) => {
  try {
    const { type = 'csv' } = req.query;
    const data = await pool.query(`SELECT * FROM conflicts ORDER BY date DESC LIMIT 500`);
    if (type === 'csv') {
      const cols = Object.keys(data.rows[0] || {});
      const header = cols.join(',') + '\n';
      const body = data.rows.map(r => cols.map(c => `"${String(r[c]||'').replace(/"/g,'\"')}"`).join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="analytics_export.csv"');
      res.send(header + body);
    } else {
      res.json({ success: true, data: data.rows });
    }
  } catch (error) {
    console.error('Analytics export error:', error);
    res.status(500).json({ error: 'Failed to export analytics' });
  }
});

// =============================
// System Settings
// =============================
router.get('/api-keys', async (req, res) => {
  try {
    const result = await pool.query(`SELECT ak.id, ak.user_id, u.email, ak.key_name, ak.permissions, ak.rate_limit, ak.is_active, ak.created_at, ak.last_used FROM api_keys ak JOIN users u ON ak.user_id = u.id ORDER BY ak.created_at DESC LIMIT 100`);
    res.json(result.rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      email: r.email,
      keyName: r.key_name,
      permissions: JSON.parse(r.permissions || '[]'),
      rateLimit: r.rate_limit,
      isActive: r.is_active,
      createdAt: r.created_at,
      lastUsed: r.last_used
    })));
  } catch (error) {
    console.error('API keys list error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

router.post('/api-keys/rotate', async (req, res) => {
  try {
    const { userId, keyName = 'Rotated Key', permissions = [], rateLimit = 1000 } = req.body;
    const created = await apiKeyService.generateAPIKey(userId, keyName, permissions, rateLimit);
    res.json(created);
  } catch (error) {
    console.error('API key rotate error:', error);
    res.status(500).json({ error: 'Failed to rotate API key' });
  }
});

// Email Templates (in-memory for now)
const emailTemplates = {
  system_alert: { subject: 'System Alert', body: 'An alert occurred: {{details}}' },
  broadcast_message: { subject: 'Announcement', body: 'Hello {{segment}}, {{message}}' }
};

router.get('/email/templates', async (_req, res) => {
  res.json(emailTemplates);
});

router.put('/email/templates/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { subject, body } = req.body;
    emailTemplates[key] = { subject, body };
    await auditLogService.logSystemEvent('EMAIL_TEMPLATE_UPDATED', { key, subjectPreview: subject?.slice(0,50), adminId: req.user.userId || req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Content Moderation categories and emotion labels (mock store)
let moderationConfig = {
  categories: ['Communication', 'Trust', 'Finance', 'Family'],
  emotions: ['joy','sadness','anger','fear','surprise','disgust']
};

router.get('/moderation', async (_req, res) => {
  res.json(moderationConfig);
});

router.put('/moderation', async (req, res) => {
  try {
    const { categories, emotions } = req.body;
    moderationConfig = { categories: categories || moderationConfig.categories, emotions: emotions || moderationConfig.emotions };
    await auditLogService.logSystemEvent('MODERATION_CONFIG_UPDATED', { adminId: req.user.userId || req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update moderation config' });
  }
});

// Backup Controls (trigger only)
router.post('/backup/trigger', async (_req, res) => {
  try {
    await auditLogService.logSystemEvent('BACKUP_TRIGGERED', { adminId: _req.user.userId || _req.user.id });
    res.json({ success: true, message: 'Backup triggered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger backup' });
  }
});

// =============================
// Notification Center
// =============================
router.get('/notifications', async (_req, res) => {
  try {
    const logs = await auditLogService.getAllLogs(50, 0);
    const notifications = logs.filter(l => ['BROADCAST_MESSAGE','ALERT','SYSTEM_ALERT'].includes(l.action)).map(l => ({
      id: l.id,
      title: l.action,
      message: l.message || l.details || '',
      severity: l.severity || 'info',
      createdAt: l.createdAt
    }));
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/notifications', async (req, res) => {
  try {
    const { title, message, severity = 'info', segment = 'all' } = req.body;
    await auditLogService.logSystemEvent('ALERT', { title, message, severity, segment, adminId: req.user.userId || req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

router.post('/notifications/schedule', async (req, res) => {
  try {
    const { title, message, severity = 'info', scheduledFor } = req.body;
    await auditLogService.logSystemEvent('SCHEDULED_ANNOUNCEMENT', { title, message, severity, scheduledFor, adminId: req.user.userId || req.user.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to schedule announcement' });
  }
});

module.exports = router;
