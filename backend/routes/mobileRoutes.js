const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const pushNotificationService = require('../services/pushNotificationService');
const { query } = require('../config/database');

// Mobile-optimized authentication endpoints
router.post('/auth/register-mobile', async (req, res) => {
  try {
    const { email, password, firstName, lastName, userType, deviceToken, platform } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, user_type, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, first_name, last_name, user_type, created_at`,
      [email, hashedPassword, firstName, lastName, userType]
    );

    const user = result.rows[0];

    // Register device token if provided
    if (deviceToken) {
      await pushNotificationService.registerDeviceToken(user.id, deviceToken, platform || 'mobile');
    }

    // Generate JWT tokens
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type,
          createdAt: user.created_at
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Mobile registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mobile-optimized login
router.post('/auth/login-mobile', async (req, res) => {
  try {
    const { email, password, deviceToken, platform } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, user_type FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Register device token if provided
    if (deviceToken) {
      await pushNotificationService.registerDeviceToken(user.id, deviceToken, platform || 'mobile');
    }

    // Generate JWT tokens
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, userType: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          userType: user.user_type
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Mobile login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Device token management
router.post('/notifications/register-token', authenticateToken, async (req, res) => {
  try {
    const { deviceToken, platform } = req.body;
    const userId = req.user.userId;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    const result = await pushNotificationService.registerDeviceToken(
      userId,
      deviceToken,
      platform || 'mobile'
    );

    res.json(result);
  } catch (error) {
    console.error('Token registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register device token'
    });
  }
});

router.delete('/notifications/unregister-token', authenticateToken, async (req, res) => {
  try {
    const { deviceToken } = req.body;
    const userId = req.user.userId;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    const result = await pushNotificationService.unregisterDeviceToken(userId, deviceToken);

    res.json(result);
  } catch (error) {
    console.error('Token unregistration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister device token'
    });
  }
});

// Mobile-optimized emotion check-in
router.post('/emotions/checkin-mobile', authenticateToken, async (req, res) => {
  try {
    const { emotions, intensity, notes, context } = req.body;
    const userId = req.user.userId;

    if (!emotions || !Array.isArray(emotions)) {
      return res.status(400).json({
        success: false,
        message: 'Emotions array is required'
      });
    }

    // Store emotion check-in
    const result = await query(
      `INSERT INTO emotion_checkins (user_id, emotions, intensity, notes, context, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, created_at`,
      [userId, JSON.stringify(emotions), intensity || 5, notes, context]
    );

    const checkin = result.rows[0];

    // Get AI analysis
    const aiEmotionService = require('../services/aiEmotionService');
    const analysis = await aiEmotionService.analyzeTextForEmotions(
      notes || emotions.join(' '),
      emotions
    );

    res.json({
      success: true,
      message: 'Emotion check-in recorded',
      data: {
        checkin: {
          id: checkin.id,
          emotions,
          intensity,
          notes,
          context,
          createdAt: checkin.created_at
        },
        analysis
      }
    });
  } catch (error) {
    console.error('Mobile emotion check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record emotion check-in'
    });
  }
});

// Mobile-optimized conflict submission
router.post('/conflicts/submit-mobile', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, severity, participants, location } = req.body;
    const userId = req.user.userId;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const result = await query(
      `INSERT INTO conflicts (user_id, title, description, category, severity, participants, location, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, title, description, category, severity, participants, location, created_at`,
      [userId, title, description, category, severity, JSON.stringify(participants || []), location]
    );

    const conflict = result.rows[0];

    // Get AI analysis
    const aiEmotionService = require('../services/aiEmotionService');
    const analysis = await aiEmotionService.analyzeTextForEmotions(description);

    res.json({
      success: true,
      message: 'Conflict submitted successfully',
      data: {
        conflict: {
          id: conflict.id,
          title: conflict.title,
          description: conflict.description,
          category: conflict.category,
          severity: conflict.severity,
          participants: JSON.parse(conflict.participants || '[]'),
          location: conflict.location,
          createdAt: conflict.created_at
        },
        analysis
      }
    });
  } catch (error) {
    console.error('Mobile conflict submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit conflict'
    });
  }
});

// Mobile-optimized therapist session management
router.get('/therapist/sessions-mobile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, offset = 0 } = req.query;

    // Verify user is a therapist
    const userResult = await query(
      'SELECT user_type FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].user_type !== 'therapist') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Therapist role required.'
      });
    }

    const result = await query(
      `SELECT s.id, s.title, s.description, s.scheduled_at, s.duration_minutes, s.status,
              c.first_name as client_first_name, c.last_name as client_last_name, c.email as client_email
       FROM therapy_sessions s
       LEFT JOIN users c ON s.client_id = c.id
       WHERE s.therapist_id = $1
       ORDER BY s.scheduled_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const sessions = result.rows.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      scheduledAt: session.scheduled_at,
      durationMinutes: session.duration_minutes,
      status: session.status,
      client: {
        firstName: session.client_first_name,
        lastName: session.client_last_name,
        email: session.client_email
      }
    }));

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: sessions.length === parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Mobile therapist sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions'
    });
  }
});

// Mobile-optimized user profile
router.get('/profile/mobile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.user_type, u.created_at,
              um.date_of_birth, um.phone_number, um.preferred_language, um.timezone,
              um.notification_preferences, um.privacy_settings
       FROM users u
       LEFT JOIN user_metadata um ON u.id = um.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
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
            timezone: user.timezone,
            notificationPreferences: user.notification_preferences ? JSON.parse(user.notification_preferences) : {},
            privacySettings: user.privacy_settings ? JSON.parse(user.privacy_settings) : {}
          }
        }
      }
    });
  } catch (error) {
    console.error('Mobile profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Mobile-optimized dashboard data
router.get('/dashboard/mobile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get recent emotion check-ins
    const emotionResult = await query(
      `SELECT emotions, intensity, notes, created_at
       FROM emotion_checkins
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Get recent conflicts
    const conflictResult = await query(
      `SELECT id, title, description, category, severity, created_at
       FROM conflicts
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Get emotion patterns
    const patternResult = await query(
      `SELECT emotion, COUNT(*) as frequency, AVG(intensity) as avg_intensity
       FROM emotion_checkins
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY emotion
       ORDER BY frequency DESC
       LIMIT 10`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        recentEmotions: emotionResult.rows.map(row => ({
          emotions: JSON.parse(row.emotions || '[]'),
          intensity: row.intensity,
          notes: row.notes,
          createdAt: row.created_at
        })),
        recentConflicts: conflictResult.rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          severity: row.severity,
          createdAt: row.created_at
        })),
        emotionPatterns: patternResult.rows.map(row => ({
          emotion: row.emotion,
          frequency: parseInt(row.frequency),
          averageIntensity: parseFloat(row.avg_intensity)
        }))
      }
    });
  } catch (error) {
    console.error('Mobile dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

module.exports = router;
