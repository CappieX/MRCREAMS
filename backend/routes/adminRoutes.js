const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('./authRoutes');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, gender, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if user is admin (prevent deleting admins)
    const userCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (userCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get system statistics (admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get user counts
    const userCountResult = await pool.query('SELECT COUNT(*) as total FROM users');
    const maleCountResult = await pool.query("SELECT COUNT(*) as male FROM users WHERE gender = 'male'");
    const femaleCountResult = await pool.query("SELECT COUNT(*) as female FROM users WHERE gender = 'female'");
    
    // Get conflict counts
    const conflictCountResult = await pool.query('SELECT COUNT(*) as total FROM conflicts');
    
    // Get average fight degree
    const avgFightDegreeResult = await pool.query('SELECT AVG(fight_degree) as average FROM conflicts');
    
    res.json({
      users: {
        total: parseInt(userCountResult.rows[0].total),
        male: parseInt(maleCountResult.rows[0].male),
        female: parseInt(femaleCountResult.rows[0].female)
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