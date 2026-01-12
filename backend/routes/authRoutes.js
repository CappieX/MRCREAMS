const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const auditLogService = require('../services/auditLogService');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'wcreams_secret_key';

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Register a new user (Unified Registration)
router.post('/register', async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { email, password, name, user_type = 'individual', metadata = {} } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await client.query(
      'INSERT INTO users (email, password_hash, name, user_type) VALUES ($1, $2, $3, $4) RETURNING id, email, name, user_type, onboarding_completed, email_verified',
      [email, hashedPassword, name || null, user_type]
    );

    const user = newUser.rows[0];

    // Insert metadata if provided
    if (Object.keys(metadata).length > 0) {
      await client.query(
        'INSERT INTO user_metadata (user_id, metadata) VALUES ($1, $2)',
        [user.id, JSON.stringify(metadata)]
      );
    }

    // Handle therapist verification if user_type is therapist
    if (user_type === 'therapist') {
      await client.query(
        'INSERT INTO therapist_verifications (user_id, status) VALUES ($1, $2)',
        [user.id, 'pending']
      );
    }

    // Log registration
    await auditLogService.logAuthEvent(
      user.id,
      'REGISTER',
      true,
      {
        email,
        userType: user_type,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    );

    await client.query('COMMIT');

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        onboarding_completed: user.onboarding_completed,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
  } finally {
    client.release();
  }
});

// Login user (supports both regular and professional login)
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 BACKEND LOGIN DEBUG - Received login request');
    const { email, password, organizationCode, role } = req.body;

    console.log('📧 Login request data:', { email, organizationCode, role, passwordLength: password ? password.length : 0 });

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    console.log('🔍 Looking up user in database:', email);
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('👤 User lookup result:', {
      found: userResult.rows.length > 0,
      userCount: userResult.rows.length
    });

    if (userResult.rows.length === 0) {
      console.log('❌ User not found in database');
      
      // Log failed login (unknown user)
      await auditLogService.logAuthEvent(
        null, 
        'LOGIN_FAILED', 
        false, 
        { email, reason: 'User not found', ipAddress: req.ip, userAgent: req.get('user-agent') }
      );

      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    console.log('👤 User data:', {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      hasPasswordHash: !!user.password_hash
    });

    // Validate password
    console.log('🔑 Comparing password for user:', user.email);
    console.log('🔑 Password hash in DB length:', user.password_hash ? user.password_hash.length : 0);
    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔑 Password valid:', validPassword);

    if (!validPassword) {
      console.log('❌ Invalid password for user:', user.email);

      // Log failed login (wrong password)
      await auditLogService.logAuthEvent(
        user.id,
        'LOGIN_FAILED',
        false,
        { email, reason: 'Invalid password', ipAddress: req.ip, userAgent: req.get('user-agent') }
      );

      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Professional login validation
    if (organizationCode && role) {
      console.log('🏢 Processing professional login with org code and role');
      // Validate organization code format and role mapping
      const orgRoleMapping = {
        'MRCREAMS-SUPER-001': ['super_admin'],
        'MRCREAMS-PLATFORM-001': ['platform_admin'],
        'MRCREAMS-ADMIN-001': ['admin'],
        'MRCREAMS-SUPPORT-001': ['support'],
        'MRCREAMS-THERAPIST-001': ['therapist'],
        'MRCREAMS-EXECUTIVE-001': ['executive']
      };

      console.log('🏢 Checking organization code:', organizationCode);
      if (!orgRoleMapping[organizationCode]) {
        console.log('❌ Invalid organization code:', organizationCode);
        return res.status(400).json({ error: 'Invalid organization code' });
      }

      console.log('👤 Checking role:', role, 'against allowed roles:', orgRoleMapping[organizationCode]);
      if (!orgRoleMapping[organizationCode].includes(role)) {
        console.log('❌ Invalid role for this organization');
        return res.status(400).json({ error: 'Invalid role for this organization' });
      }

      // Update user role if different (for professional accounts)
      if (user.user_type !== role) {
        console.log('🔄 Updating user role from', user.user_type, 'to', role);
        await pool.query('UPDATE users SET user_type = $1 WHERE id = $2', [role, user.id]);
        user.user_type = role;
      }
    }

    // Generate token
    console.log('🎫 Generating JWT token for user');
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    await auditLogService.logAuthEvent(
      user.id,
      'LOGIN_SUCCESS',
      true,
      { email, role: user.user_type, ipAddress: req.ip, userAgent: req.get('user-agent') }
    );

    console.log('✅ Login successful for user:', user.email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        onboarding_completed: user.onboarding_completed,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    console.error('💥 Backend login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, email, name, user_type, onboarding_completed, email_verified FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    res.json(user);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user (with metadata)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.user_type, u.onboarding_completed, u.email_verified,
              um.metadata
       FROM users u
       LEFT JOIN user_metadata um ON u.id = um.user_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const row = result.rows[0];
    const user = {
      id: row.id,
      email: row.email,
      name: row.name,
      user_type: row.user_type,
      onboarding_completed: row.onboarding_completed,
      email_verified: row.email_verified,
      metadata: row.metadata || {}
    };
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update current user profile (supports onboarding progress and completion)
router.put('/user/profile', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.id;
    const {
      onboardingCompleted,
      onboardingCompletedAt,
      onboardingStep,
      userType,
      relationshipContext,
      goalsPreferences,
      emotionalSnapshot,
      // Flattened basic info may include name, phone, etc.
      name,
      phone,
      timezone,
      language,
      preferences,
      onboardingData
    } = req.body;

    await client.query('BEGIN');

    const updates = [];
    const values = [];
    let idx = 1;

    if (typeof name === 'string') { updates.push(`name = $${idx++}`); values.push(name); }
    if (typeof userType === 'string') { updates.push(`user_type = $${idx++}`); values.push(userType); }
    if (typeof onboardingCompleted === 'boolean') { updates.push(`onboarding_completed = $${idx++}`); values.push(onboardingCompleted); }
    if (onboardingCompletedAt) { updates.push(`onboarding_completed_at = $${idx++}`); values.push(new Date(onboardingCompletedAt)); }
    if (typeof phone === 'string') { updates.push(`phone = $${idx++}`); values.push(phone); }
    if (typeof timezone === 'string') { updates.push(`timezone = $${idx++}`); values.push(timezone); }
    if (typeof language === 'string') { updates.push(`language = $${idx++}`); values.push(language); }
    if (preferences) { updates.push(`preferences = $${idx++}`); values.push(JSON.stringify(preferences)); }

    if (updates.length > 0) {
      values.push(userId);
      await client.query(`UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx}`, values);
    }

    const metadataPayload = {
      onboardingStep: typeof onboardingStep === 'number' ? onboardingStep : undefined,
      relationshipContext,
      goalsPreferences,
      emotionalSnapshot,
      ...(onboardingData || {})
    };

    // Clean undefined keys
    Object.keys(metadataPayload).forEach(k => metadataPayload[k] === undefined && delete metadataPayload[k]);

    if (Object.keys(metadataPayload).length > 0) {
      const metaRes = await client.query('UPDATE user_metadata SET metadata = $1 WHERE user_id = $2', [JSON.stringify(metadataPayload), userId]);
      if (metaRes.rowCount === 0) {
        await client.query('INSERT INTO user_metadata (user_id, metadata) VALUES ($1, $2)', [userId, JSON.stringify(metadataPayload)]);
      }
    }

    await client.query('COMMIT');

    const refreshed = await client.query(
      'SELECT id, email, name, user_type, onboarding_completed, email_verified FROM users WHERE id = $1',
      [userId]
    );

    res.json(refreshed.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  } finally {
    client.release();
  }
});

// Professional Login Endpoint (separate from regular login)
router.post('/professional-login', async (req, res) => {
  try {
    console.log('🔐 PROFESSIONAL LOGIN DEBUG - Received professional login request');
    const { email, password, organizationCode, role } = req.body;

    console.log('📧 Professional login data:', {
      email,
      organizationCode,
      role,
      passwordLength: password ? password.length : 0
    });

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Check if user exists
    console.log('🔍 Looking up user in database:', email);
    const userResult = await pool.query(
      'SELECT u.*, um.metadata FROM users u LEFT JOIN user_metadata um ON u.id = um.user_id WHERE u.email = $1',
      [email]
    );

    console.log('👤 User lookup result:', {
      found: userResult.rows.length > 0,
      userCount: userResult.rows.length
    });

    if (userResult.rows.length === 0) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];
    console.log('👤 User data:', {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      organizationCode: user.organization_code,
      hasPasswordHash: !!user.password_hash
    });

    // Validate password
    console.log('🔑 Comparing password for user:', user.email);
    console.log('🔑 Password hash in DB length:', user.password_hash ? user.password_hash.length : 0);

    // Handle both plain text and hashed passwords (for compatibility)
    let validPassword = false;
    if (user.password_hash === password) {
      console.log('🔑 Plain text password match');
      validPassword = true;
    } else {
      console.log('🔑 Trying bcrypt compare...');
      validPassword = await bcrypt.compare(password, user.password_hash);
      console.log('🔑 Password valid:', validPassword);
    }

    if (!validPassword) {
      console.log('❌ Invalid password for user:', user.email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Professional login validation
    if (organizationCode && role) {
      console.log('🏢 Processing professional login with org code and role');

      // Validate organization code format and role mapping
      const orgRoleMapping = {
        'MRCREAMS-SUPER-001': ['super_admin'],
        'MRCREAMS-ADMIN-001': ['admin'],
        'MRCREAMS-SUPPORT-001': ['support'],
        'MRCREAMS-THERAPIST-001': ['therapist'],
        'MRCREAMS-EXECUTIVE-001': ['executive']
      };

      console.log('🏢 Checking organization code:', organizationCode);
      if (!orgRoleMapping[organizationCode]) {
        console.log('❌ Invalid organization code:', organizationCode);
        return res.status(401).json({
          success: false,
          error: 'Invalid organization code'
        });
      }

      console.log('👤 Checking role:', role, 'against allowed roles:', orgRoleMapping[organizationCode]);
      if (!orgRoleMapping[organizationCode].includes(role)) {
        console.log('❌ Invalid role for this organization');
        return res.status(401).json({
          success: false,
          error: 'Invalid role for this organization'
        });
      }

      // Update user role if different (for professional accounts)
      if (user.user_type !== role) {
        console.log('🔄 Updating user role from', user.user_type, 'to', role);
        await pool.query('UPDATE users SET user_type = $1 WHERE id = $2', [role, user.id]);
        user.user_type = role;
      }
    }

    // Generate token
    console.log('🎫 Generating JWT token for user');
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Professional login successful for:', user.email);
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.user_type,
        organization_code: user.organization_code,
        onboarding_completed: user.onboarding_completed,
        email_verified: user.email_verified
      },
      token
    });
  } catch (error) {
    console.error('💥 Professional login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Server error during login: ' + error.message
    });
  }
});

module.exports = { router, authenticateToken };
