require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { query, getClient } = require('./config/database');

// Import route modules
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/adminRoutes');
const supportTicketsRouter = require('./routes/supportTickets');
const emotionAnalysisRouter = require('./routes/emotionAnalysis');
const therapistRouter = require('./routes/therapistRoutes');
const mobileRouter = require('./routes/mobileRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');
const reportingRouter = require('./routes/reportingRoutes');
const publicAPIRouter = require('./routes/publicAPIRoutes');
const integrationRouter = require('./routes/integrationRoutes');
const hipaaComplianceRouter = require('./routes/hipaaComplianceRoutes');
const gdprComplianceRouter = require('./routes/gdprComplianceRoutes');
const securityRouter = require('./routes/securityRoutes');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { configureSecurityHeaders, requestLogging, securityEventLogging, ipSecurity, userAgentValidation, requestSizeLimit, requestFrequencyLimit, httpsEnforcement, corsSecurity, apiVersioning, errorHandling, securityMonitoring } = require('./middleware/security');
const { sanitizeInput, securityValidation, validatePayloadSize } = require('./middleware/validation');
const SecurityService = require('./services/securityService');

const app = express();
// Default to 5002 for local dev (macOS often has AirPlay/AirTunes bound to :5000).
// Production/docker can still set PORT=5000 (see docker-compose/nginx).
const PORT = process.env.PORT || 5002;
const isDev = process.env.NODE_ENV !== 'production';

// Security middleware
app.use(configureSecurityHeaders());
app.use(requestLogging);
app.use(securityEventLogging);
app.use(ipSecurity);
app.use(userAgentValidation);
app.use(requestSizeLimit(1024 * 1024));
app.use(requestFrequencyLimit(60000, isDev ? 1000 : 100));
app.use(httpsEnforcement);
app.use(corsSecurity);
app.use(apiVersioning);
app.use(securityMonitoring);

// Input validation and sanitization
app.use(sanitizeInput);
app.use(securityValidation);
app.use(validatePayloadSize(1024 * 1024)); // 1MB limit

// Basic security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev && (req.ip === '127.0.0.1' || req.ip === '::1' || req.hostname === 'localhost')
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 100 : 20,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev && (req.ip === '127.0.0.1' || req.ip === '::1' || req.hostname === 'localhost')
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// API routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/v1/support', supportTicketsRouter);
app.use('/api/emotions', emotionAnalysisRouter);
app.use('/api/therapists', therapistRouter);
app.use('/api/mobile', mobileRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/reports', reportingRouter);
app.use('/api/public', publicAPIRouter);
app.use('/api/integrations', integrationRouter);
app.use('/api/hipaa', hipaaComplianceRouter);
app.use('/api/gdpr', gdprComplianceRouter);
app.use('/api/security', securityRouter);

// Protected routes middleware - require valid JWT for private APIs
const protectRoute = authenticateToken;

// Conflicts API endpoints (migrated to PostgreSQL)
app.get('/api/conflicts', protectRoute, async (req, res) => {
  try {
    let queryText = `
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM conflicts c
      JOIN users u ON c.user_id = u.id
    `;
    let params = [];

    // If user is admin, show all conflicts, otherwise only show user's conflicts
    if (req.user && !req.user.isAdmin) {
      queryText += ' WHERE c.user_id = $1';
      params.push(req.user.id);
    }

    queryText += ' ORDER BY c.date DESC, c.time DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching conflicts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/conflicts/:id', protectRoute, async (req, res) => {
  try {
    const { id } = req.params;
    let queryText = `
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM conflicts c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    let params = [id];

    // If not admin, only allow access to own conflicts
    if (req.user && !req.user.isAdmin) {
      queryText += ' AND c.user_id = $2';
      params.push(req.user.id);
    }

    const result = await query(queryText, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conflict not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching conflict:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/conflicts', protectRoute, async (req, res) => {
  try {
    const { date, time, conflict_reason, description, time_consumption, fight_degree, final_result, remark, partner_id } = req.body;

    // Validate required fields
    if (!date || !time || !conflict_reason || !time_consumption || !fight_degree) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const queryText = `
      INSERT INTO conflicts (date, time, conflict_reason, description, time_consumption, fight_degree, final_result, remark, user_id, partner_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const params = [date, time, conflict_reason, description, time_consumption, fight_degree, final_result, remark, req.user.id, partner_id];

    const result = await query(queryText, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating conflict:', err);
    res.status(500).json({ error: 'Failed to save conflict. Please try again.' });
  }
});

app.put('/api/conflicts/:id', protectRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, conflict_reason, description, time_consumption, fight_degree, final_result, remark, partner_id } = req.body;

    let queryText = `
      UPDATE conflicts 
      SET date = $1, time = $2, conflict_reason = $3, description = $4, time_consumption = $5, 
          fight_degree = $6, final_result = $7, remark = $8, partner_id = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
    `;
    let params = [date, time, conflict_reason, description, time_consumption, fight_degree, final_result, remark, partner_id, id];

    // If not admin, only allow updating own conflicts
    if (req.user && !req.user.isAdmin) {
      queryText += ' AND user_id = $11';
      params.push(req.user.id);
    }

    queryText += ' RETURNING *';

    const result = await query(queryText, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conflict not found or you do not have permission to update it' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating conflict:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/conflicts/:id', protectRoute, async (req, res) => {
  try {
    const { id } = req.params;

    let queryText = 'DELETE FROM conflicts WHERE id = $1';
    let params = [id];

    // If not admin, only allow deleting own conflicts
    if (req.user && !req.user.isAdmin) {
      queryText += ' AND user_id = $2';
      params.push(req.user.id);
    }

    queryText += ' RETURNING id';

    const result = await query(queryText, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conflict not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Conflict deleted successfully' });
  } catch (err) {
    console.error('Error deleting conflict:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Analytics endpoint (enhanced for PostgreSQL)
app.get('/api/analytics', protectRoute, async (req, res) => {
  try {
    let whereClause = '';
    let params = [];

    // If not admin, only count user's conflicts
    if (req.user && !req.user.isAdmin) {
      whereClause = 'WHERE user_id = $1';
      params.push(req.user.id);
    }

    // Get total conflicts
    const totalResult = await query(`SELECT COUNT(*) FROM conflicts ${whereClause}`, params);
    const totalConflicts = parseInt(totalResult.rows[0].count);

    // Get conflicts by reason
    const reasonQuery = `
      SELECT conflict_reason as name, COUNT(*) as value 
      FROM conflicts 
      ${whereClause}
      GROUP BY conflict_reason 
      ORDER BY value DESC
    `;
    const reasonResult = await query(reasonQuery, params);

    // Get average fight degree
    const avgDegreeQuery = `SELECT AVG(fight_degree) as avg_degree FROM conflicts ${whereClause}`;
    const avgDegreeResult = await query(avgDegreeQuery, params);
    const avgFightDegree = avgDegreeResult.rows[0].avg_degree ? parseFloat(avgDegreeResult.rows[0].avg_degree).toFixed(1) : '0.0';

    // Get average time consumption
    const avgTimeQuery = `SELECT AVG(time_consumption) as avg_time FROM conflicts ${whereClause}`;
    const avgTimeResult = await query(avgTimeQuery, params);
    const avgTimeConsumption = avgTimeResult.rows[0].avg_time ? parseFloat(avgTimeResult.rows[0].avg_time).toFixed(1) : '0.0';

    // Get monthly trends
    const monthlyQuery = `
      SELECT
        TO_CHAR(date, 'YYYY-MM') as month,
        COUNT(*) as count,
        AVG(fight_degree) as avg_degree
      FROM conflicts
      ${whereClause}
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month
    `;
    const monthlyResult = await query(monthlyQuery, params);

    res.json({
      totalConflicts,
      conflictsByReason: reasonResult.rows,
      avgFightDegree,
      avgTimeConsumption,
      monthlyTrends: monthlyResult.rows
    });
  } catch (err) {
    console.error('Error generating analytics:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Recommendations endpoint (enhanced)
app.get('/api/recommendations', async (req, res) => {
  try {
    // Get most common conflict reasons
    const commonReasonsQuery = `
      SELECT conflict_reason, COUNT(*) as count
      FROM conflicts
      GROUP BY conflict_reason
      ORDER BY count DESC
      LIMIT 3
    `;
    const commonReasonsResult = await query(commonReasonsQuery);

    // Get highest fight degree conflicts
    const highIntensityQuery = `
      SELECT * FROM conflicts
      WHERE fight_degree >= 8
      ORDER BY fight_degree DESC, date DESC
      LIMIT 3
    `;
    const highIntensityResult = await query(highIntensityQuery);

    // Get longest conflicts
    const longConflictsQuery = `
      SELECT * FROM conflicts
      WHERE time_consumption >= 60
      ORDER BY time_consumption DESC, date DESC
      LIMIT 3
    `;
    const longConflictsResult = await query(longConflictsQuery);

    res.json({
      commonReasons: commonReasonsResult.rows,
      highIntensityConflicts: highIntensityResult.rows,
      longConflicts: longConflictsResult.rows
    });
  } catch (err) {
    console.error('Error generating recommendations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  const { closePool } = require('./config/database');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  const { closePool } = require('./config/database');
  await closePool();
  process.exit(0);
});

// Error handling middleware
app.use(errorHandling);

// Start server
app.listen(PORT, () => {
  console.log(`MR.CREAMS API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: PostgreSQL`);
  console.log(`Security hardening enabled: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}`);
});
