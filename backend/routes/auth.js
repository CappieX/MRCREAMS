const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');
const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  generateRefreshToken,
  verifyToken,
  validateEmail, 
  validatePassword,
  createUserSession,
  refreshUserSession,
  revokeUserSession,
  revokeAllUserSessions,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateMFASecret,
  generateMFABackupCodes
} = require('../services/authService');
const { 
  sendEmailVerification, 
  sendPasswordReset, 
  sendWelcomeEmail,
  sendMFASetup 
} = require('../services/emailService');
const { authenticateToken, requireRole, auditLog } = require('../middleware/auth');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');

    const { email, password, name, userType, metadata, organizationCode } = req.body;

    // Validate input
    if (!email || !password || !name || !userType) {
      return res.status(400).json({
        error: 'Missing required fields',
        code: 'MISSING_FIELDS'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet requirements',
        code: 'WEAK_PASSWORD',
        details: passwordValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Get organization ID if organizationCode is provided
    let organizationId = null;
    if (organizationCode) {
      const orgResult = await client.query(
        'SELECT id FROM organizations WHERE code = $1',
        [organizationCode]
      );
      if (orgResult.rows.length > 0) {
        organizationId = orgResult.rows[0].id;
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();

    // Insert user
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, name, user_type, organization_id, email_verification_token, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, email, name, user_type, organization_id, onboarding_completed, email_verified, created_at`,
      [email.toLowerCase(), hashedPassword, name, userType, organizationId, emailVerificationToken]
    );

    const userId = userResult.rows[0].id;

    // Save user-type specific metadata
    if (metadata && Object.keys(metadata).length > 0) {
      await client.query(
        `INSERT INTO user_metadata (user_id, metadata, updated_at)
         VALUES ($1, $2, NOW())`,
        [userId, JSON.stringify(metadata)]
      );
    }

    // For therapists, create verification record
    if (userType === 'therapist') {
      await client.query(
        `INSERT INTO therapist_verifications (user_id, status, submitted_at)
         VALUES ($1, 'pending', NOW())`,
        [userId]
      );
    }

    await client.query('COMMIT');

    // Send email verification
    await sendEmailVerification(email, name, emailVerificationToken);

    // Send welcome email
    await sendWelcomeEmail(email, name, userType);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: userId,
        email: userResult.rows[0].email,
        name: userResult.rows[0].name,
        userType: userResult.rows[0].user_type,
        organizationId: userResult.rows[0].organization_id,
        onboardingCompleted: userResult.rows[0].onboarding_completed,
        emailVerified: userResult.rows[0].email_verified
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration',
      code: 'REGISTRATION_ERROR'
    });
  } finally {
    client.release();
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Get user from database
    const userResult = await query(`
      SELECT u.*, o.name as organization_name, o.code as organization_code
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      WHERE u.email = $1 AND u.is_active = true
    `, [email.toLowerCase()]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = userResult.rows[0];

    // Check password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Create session
    const session = await createUserSession(
      user.id,
      req.ip,
      req.get('User-Agent')
    );

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.user_type,
      organizationId: user.organization_id
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        organizationCode: user.organization_code,
        onboardingCompleted: user.onboarding_completed,
        emailVerified: user.email_verified
      },
      token,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login',
      code: 'LOGIN_ERROR'
    });
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Refresh session
    const session = await refreshUserSession(refreshToken);

    // Generate new JWT token
    const decoded = verifyToken(refreshToken);
    const token = generateToken({
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
      organizationId: decoded.organizationId
    });

    res.json({
      message: 'Token refreshed successfully',
      token,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      error: 'Invalid or expired refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await revokeUserSession(token);
    }

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error during logout',
      code: 'LOGOUT_ERROR'
    });
  }
});

/**
 * @route POST /api/auth/logout-all
 * @desc Logout from all devices
 * @access Private
 */
router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    await revokeAllUserSessions(req.user.id);

    res.json({
      message: 'Logged out from all devices'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      error: 'Internal server error during logout',
      code: 'LOGOUT_ALL_ERROR'
    });
  }
});

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email address
 * @access Public
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Verification token is required',
        code: 'MISSING_TOKEN'
      });
    }

    // Find user with this verification token
    const userResult = await query(
      'SELECT id, email, name FROM users WHERE email_verification_token = $1 AND email_verified = false',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired verification token',
        code: 'INVALID_TOKEN'
      });
    }

    const user = userResult.rows[0];

    // Update user as verified
    await query(
      'UPDATE users SET email_verified = true, email_verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      error: 'Internal server error during email verification',
      code: 'VERIFICATION_ERROR'
    });
  }
});

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend email verification
 * @access Public
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        code: 'MISSING_EMAIL'
      });
    }

    // Get user
    const userResult = await query(
      'SELECT id, email, name, email_verified FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    if (user.email_verified) {
      return res.status(400).json({
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED'
      });
    }

    // Generate new verification token
    const verificationToken = generateEmailVerificationToken();

    // Update user with new token
    await query(
      'UPDATE users SET email_verification_token = $1 WHERE id = $2',
      [verificationToken, user.id]
    );

    // Send verification email
    await sendEmailVerification(user.email, user.name, verificationToken);

    res.json({
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'RESEND_ERROR'
    });
  }
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        code: 'MISSING_EMAIL'
      });
    }

    // Get user
    const userResult = await query(
      'SELECT id, email, name FROM users WHERE email = $1 AND is_active = true',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if user exists or not
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

    // Update user with reset token
    await query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );

    // Send reset email
    await sendPasswordReset(user.email, user.name, resetToken);

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'FORGOT_PASSWORD_ERROR'
    });
  }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password
 * @access Public
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        error: 'Token and password are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet requirements',
        code: 'WEAK_PASSWORD',
        details: passwordValidation.errors
      });
    }

    // Find user with valid reset token
    const userResult = await query(
      'SELECT id, email, name FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid or expired reset token',
        code: 'INVALID_TOKEN'
      });
    }

    const user = userResult.rows[0];

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    await query(
      'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    // Revoke all user sessions for security
    await revokeAllUserSessions(user.id);

    res.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'RESET_PASSWORD_ERROR'
    });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Get user metadata
    const metadataResult = await query(
      'SELECT metadata FROM user_metadata WHERE user_id = $1',
      [req.user.id]
    );

    const metadata = metadataResult.rows.length > 0 ? metadataResult.rows[0].metadata : {};

    res.json({
      user: {
        ...req.user,
        metadata
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'GET_USER_ERROR'
    });
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticateToken, auditLog('profile_update', 'users'), async (req, res) => {
  try {
    const { name, phone, timezone, language, preferences } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (phone) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (timezone) {
      updates.push(`timezone = $${paramCount}`);
      values.push(timezone);
      paramCount++;
    }

    if (language) {
      updates.push(`language = $${paramCount}`);
      values.push(language);
      paramCount++;
    }

    if (preferences) {
      updates.push(`preferences = $${paramCount}`);
      values.push(JSON.stringify(preferences));
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        code: 'NO_UPDATES'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user.id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
});

module.exports = router;