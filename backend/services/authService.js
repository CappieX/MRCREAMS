const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query, getClient } = require('../config/database');
const validator = require('validator');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
const generateRefreshToken = (userId) => {
  const payload = { 
    userId, 
    type: 'refresh',
    jti: crypto.randomUUID() // JWT ID for token tracking
  };
  return generateToken(payload, JWT_REFRESH_EXPIRES_IN);
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {boolean} Password match result
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate random token for email verification, password reset, etc.
 * @param {number} length - Token length
 * @returns {string} Random token
 */
const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Email validity
 */
const validateEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

/**
 * Calculate password strength score
 * @param {string} password - Password
 * @returns {number} Strength score (0-100)
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Length score
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Character variety score
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/\d/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  
  // Pattern penalties
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 10; // Common patterns
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Create user session
 * @param {string} userId - User ID
 * @param {string} ipAddress - Client IP address
 * @param {string} userAgent - Client user agent
 * @returns {Object} Session data
 */
const createUserSession = async (userId, ipAddress, userAgent) => {
  const client = await getClient();
  
  try {
    const sessionToken = generateToken({ userId, type: 'session' }, '24h');
    const refreshToken = generateRefreshToken(userId);
    
    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Store session in database
    await client.query(`
      INSERT INTO user_sessions (user_id, session_token, refresh_token, expires_at, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [userId, sessionToken, refreshToken, expiresAt, ipAddress, userAgent]);
    
    // Update user's last login
    await client.query(`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1
    `, [userId]);
    
    return {
      sessionToken,
      refreshToken,
      expiresAt
    };
  } finally {
    client.release();
  }
};

/**
 * Refresh user session
 * @param {string} refreshToken - Refresh token
 * @returns {Object} New session data
 */
const refreshUserSession = async (refreshToken) => {
  const client = await getClient();
  
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    // Check if session exists and is active
    const sessionResult = await client.query(`
      SELECT us.*, u.is_active, u.email_verified
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.refresh_token = $1 AND us.is_active = true AND us.expires_at > CURRENT_TIMESTAMP
    `, [refreshToken]);
    
    if (sessionResult.rows.length === 0) {
      throw new Error('Invalid or expired refresh token');
    }
    
    const session = sessionResult.rows[0];
    
    if (!session.is_active || !session.email_verified) {
      throw new Error('User account is not active or verified');
    }
    
    // Generate new tokens
    const newSessionToken = generateToken({ userId: session.user_id, type: 'session' }, '24h');
    const newRefreshToken = generateRefreshToken(session.user_id);
    
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 24);
    
    // Update session
    await client.query(`
      UPDATE user_sessions 
      SET session_token = $1, refresh_token = $2, expires_at = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [newSessionToken, newRefreshToken, newExpiresAt, session.id]);
    
    return {
      sessionToken: newSessionToken,
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt
    };
  } finally {
    client.release();
  }
};

/**
 * Revoke user session
 * @param {string} sessionToken - Session token
 * @returns {boolean} Success status
 */
const revokeUserSession = async (sessionToken) => {
  const client = await getClient();
  
  try {
    const result = await client.query(`
      UPDATE user_sessions 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE session_token = $1
    `, [sessionToken]);
    
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};

/**
 * Revoke all user sessions
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
const revokeAllUserSessions = async (userId) => {
  const client = await getClient();
  
  try {
    const result = await client.query(`
      UPDATE user_sessions 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
    `, [userId]);
    
    return result.rowCount > 0;
  } finally {
    client.release();
  }
};

/**
 * Clean up expired sessions
 * @returns {number} Number of sessions cleaned up
 */
const cleanupExpiredSessions = async () => {
  const client = await getClient();
  
  try {
    const result = await client.query(`
      DELETE FROM user_sessions 
      WHERE expires_at < CURRENT_TIMESTAMP OR is_active = false
    `);
    
    return result.rowCount;
  } finally {
    client.release();
  }
};

/**
 * Generate email verification token
 * @param {string} userId - User ID
 * @returns {string} Verification token
 */
const generateEmailVerificationToken = () => {
  return generateRandomToken(32);
};

/**
 * Generate password reset token
 * @param {string} userId - User ID
 * @returns {string} Reset token
 */
const generatePasswordResetToken = () => {
  return generateRandomToken(32);
};

/**
 * Generate MFA secret for TOTP
 * @returns {string} MFA secret
 */
const generateMFASecret = () => {
  return crypto.randomBytes(20).toString('base32');
};

/**
 * Generate MFA backup codes
 * @param {number} count - Number of codes to generate
 * @returns {Array} Backup codes
 */
const generateMFABackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateRandomToken,
  validateEmail,
  validatePassword,
  calculatePasswordStrength,
  createUserSession,
  refreshUserSession,
  revokeUserSession,
  revokeAllUserSessions,
  cleanupExpiredSessions,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateMFASecret,
  generateMFABackupCodes
};
