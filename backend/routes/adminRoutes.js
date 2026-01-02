const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./authRoutes'); // Kept for backward compatibility if used elsewhere, but ideally should be from middleware/auth
const { checkPermission } = require('../middleware/rbac');
const auditLogService = require('../services/auditLogService');

// Get all users (admin only)
router.get('/users', authenticateToken, checkPermission('read', 'User'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, user_type, is_active, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', authenticateToken, checkPermission('delete', 'User'), async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if user is admin (prevent deleting admins)
    const userCheck = await pool.query('SELECT user_type FROM users WHERE id = $1', [userId]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const targetUserType = userCheck.rows[0].user_type;
    const protectedRoles = ['admin', 'super_admin', 'platform_admin', 'it_admin'];

    if (protectedRoles.includes(targetUserType)) {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    
    // Log the deletion
    await auditLogService.logDataDeletion(
      req.user.id, 
      'User', 
      userId, 
      { 
        targetUserType,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get system statistics (admin only)
router.get('/stats', authenticateToken, checkPermission('read', 'Report'), async (req, res) => {
  try {
    // Get user counts
    const userCountResult = await pool.query('SELECT COUNT(*) as total FROM users');
    
    // Gender not available in users table, removed gender breakdown
    // const maleCountResult = await pool.query("SELECT COUNT(*) as male FROM users WHERE gender = 'male'");
    
    // Get conflict counts
    const conflictCountResult = await pool.query('SELECT COUNT(*) as total FROM conflicts');
    
    // Get average fight degree
    const avgFightDegreeResult = await pool.query('SELECT AVG(fight_degree) as average FROM conflicts');
    
    res.json({
      users: {
        total: parseInt(userCountResult.rows[0].total),
        // Placeholder for gender/demographics if available elsewhere
        male: 0,
        female: 0
      },
      conflicts: {
        total: parseInt(conflictCountResult.rows[0].total),
        avgFightDegree: parseFloat(avgFightDegreeResult.rows[0].average || 0).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
