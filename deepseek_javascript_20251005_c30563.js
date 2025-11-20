const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { Parser } = require('json2csv');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Routes

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: err.message 
    });
  }
});

// Get all conflicts
app.get('/api/conflicts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM conflicts ORDER BY date DESC, time DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching conflicts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single conflict
app.get('/api/conflicts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM conflicts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conflict not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching conflict:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new conflict
app.post('/api/conflicts', async (req, res) => {
  const { date, time, conflict_reason, time_consumption, fight_degree, final_result, remark } = req.body;
  
  // Validation
  if (!date || !time || !conflict_reason || !time_consumption || !fight_degree) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [date, time, conflict_reason, time_consumption, fight_degree, final_result, remark]
    );
    
    res.status(201).json({
      message: 'Conflict logged successfully',
      conflict: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating conflict:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update conflict
app.put('/api/conflicts/:id', async (req, res) => {
  const { id } = req.params;
  const { date, time, conflict_reason, time_consumption, fight_degree, final_result, remark } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE conflicts 
       SET date=$1, time=$2, conflict_reason=$3, time_consumption=$4, fight_degree=$5, final_result=$6, remark=$7 
       WHERE id=$8 RETURNING *`,
      [date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conflict not found' });
    }
    
    res.json({
      message: 'Conflict updated successfully',
      conflict: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating conflict:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete conflict
app.delete('/api/conflicts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM conflicts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conflict not found' });
    }
    
    res.json({ 
      message: 'Conflict deleted successfully',
      deletedConflict: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting conflict:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export to CSV
app.get('/api/conflicts/export', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conflicts ORDER BY date DESC, time DESC');
    const conflicts = result.rows;
    
    if (conflicts.length === 0) {
      return res.status(404).json({ error: 'No data available for export' });
    }
    
    const fields = [
      'id', 
      'date', 
      'time', 
      'conflict_reason', 
      'time_consumption', 
      'fight_degree', 
      'final_result', 
      'remark', 
      'created_at'
    ];
    
    const parser = new Parser({ 
      fields,
      header: true
    });
    
    const csv = parser.parse(conflicts);
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`conflicts-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Error exporting data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics data
app.get('/api/analytics', async (req, res) => {
  try {
    // Total conflicts
    const totalConflicts = await pool.query('SELECT COUNT(*) FROM conflicts');
    
    // Average duration
    const avgDuration = await pool.query('SELECT AVG(time_consumption) FROM conflicts');
    
    // Average fight degree
    const avgFightDegree = await pool.query('SELECT AVG(fight_degree) FROM conflicts');
    
    // Max fight degree
    const maxFightDegree = await pool.query('SELECT MAX(fight_degree) FROM conflicts');
    
    // Conflicts by reason
    const conflictsByReason = await pool.query(`
      SELECT conflict_reason, COUNT(*) as count 
      FROM conflicts 
      GROUP BY conflict_reason 
      ORDER BY count DESC
    `);
    
    // Weekly trend
    const weeklyTrend = await pool.query(`
      SELECT 
        DATE_TRUNC('week', date) as week,
        COUNT(*) as conflict_count,
        AVG(fight_degree) as avg_intensity,
        AVG(time_consumption) as avg_duration
      FROM conflicts 
      GROUP BY week 
      ORDER BY week
    `);
    
    // Monthly summary
    const monthlySummary = await pool.query(`
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        COUNT(*) as conflict_count,
        AVG(fight_degree) as avg_intensity,
        AVG(time_consumption) as avg_duration
      FROM conflicts 
      GROUP BY month 
      ORDER BY month
    `);

    res.json({
      totalConflicts: parseInt(totalConflicts.rows[0].count),
      avgDuration: parseFloat(avgDuration.rows[0].avg || 0).toFixed(1),
      avgFightDegree: parseFloat(avgFightDegree.rows[0].avg || 0).toFixed(1),
      maxFightDegree: parseInt(maxFightDegree.rows[0].max || 0),
      conflictsByReason: conflictsByReason.rows,
      weeklyTrend: weeklyTrend.rows.map(row => ({
        ...row,
        week: new Date(row.week).toISOString().split('T')[0]
      })),
      monthlySummary: monthlySummary.rows
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Prediction and recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    const recentConflicts = await pool.query(`
      SELECT * FROM conflicts 
      ORDER BY date DESC, time DESC 
      LIMIT 10
    `);
    
    const conflictsByReason = await pool.query(`
      SELECT conflict_reason, COUNT(*) as count, AVG(fight_degree) as avg_intensity
      FROM conflicts 
      GROUP BY conflict_reason 
      ORDER BY count DESC
      LIMIT 5
    `);
    
    const highIntensityConflicts = await pool.query(`
      SELECT conflict_reason, COUNT(*) as count
      FROM conflicts 
      WHERE fight_degree >= 7
      GROUP BY conflict_reason 
      ORDER BY count DESC
    `);
    
    const timePatterns = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM time) as hour,
        COUNT(*) as count,
        AVG(fight_degree) as avg_intensity
      FROM conflicts 
      GROUP BY hour 
      ORDER BY count DESC
      LIMIT 3
    `);
    
    // Generate recommendations based on data patterns
    const recommendations = [];
    
    // Frequency-based recommendations
    const topReason = conflictsByReason.rows[0];
    if (topReason && topReason.count > 2) {
      recommendations.push({
        type: 'HIGH_FREQUENCY_ISSUE',
        title: 'Frequent Issue Detected',
        message: `"${topReason.conflict_reason}" is your most common conflict reason (${topReason.count} occurrences). Consider proactive communication about this topic.`,
        priority: 'high',
        suggestion: `Schedule a calm discussion about ${topReason.conflict_reason} when both are relaxed.`
      });
    }
    
    // Intensity-based recommendations
    if (highIntensityConflicts.rows.length > 0) {
      const highIntensityReason = highIntensityConflicts.rows[0];
      recommendations.push({
        type: 'HIGH_INTENSITY_ALERT',
        title: 'High-Intensity Pattern',
        message: `Conflicts about "${highIntensityReason.conflict_reason}" tend to be more intense. These discussions may need special handling.`,
        priority: 'high',
        suggestion: 'Approach this topic with extra preparation and choose optimal timing.'
      });
    }
    
    // Time-based recommendations
    const topTime = timePatterns.rows[0];
    if (topTime && topTime.count > 1) {
      const timeLabel = topTime.hour < 12 ? 'morning' : 
                       topTime.hour < 17 ? 'afternoon' : 'evening';
      recommendations.push({
        type: 'TIMING_PATTERN',
        title: 'Timing Pattern Detected',
        message: `Most conflicts occur in the ${timeLabel} (around ${topTime.hour}:00). This might not be the best time for important discussions.`,
        priority: 'medium',
        suggestion: 'Try scheduling important conversations for different times of day.'
      });
    }
    
    // Duration-based recommendations
    const longConflicts = await pool.query(`
      SELECT COUNT(*) as count 
      FROM conflicts 
      WHERE time_consumption > 60
    `);
    
    if (longConflicts.rows[0].count > 0) {
      recommendations.push({
        type: 'DURATION_ALERT',
        title: 'Long Discussions Detected',
        message: `Some conflicts last more than 60 minutes. Extended discussions can be counterproductive.`,
        priority: 'medium',
        suggestion: 'Consider taking breaks during long discussions to maintain perspective.'
      });
    }
    
    // General recommendations if no specific patterns
    if (recommendations.length === 0 && recentConflicts.rows.length > 0) {
      recommendations.push({
        type: 'GENERAL_ADVICE',
        title: 'Good Communication Foundation',
        message: 'Your conflict patterns show healthy communication habits. Keep focusing on constructive resolution.',
        priority: 'low',
        suggestion: 'Continue practicing active listening and timely resolution.'
      });
    }
    
    res.json({
      recommendations,
      recentTrends: {
        totalRecent: recentConflicts.rows.length,
        avgRecentIntensity: recentConflicts.rows.length > 0 ? 
          recentConflicts.rows.reduce((sum, conflict) => sum + conflict.fight_degree, 0) / recentConflicts.rows.length : 0,
        recentTimeframe: 'last 10 conflicts'
      },
      patterns: {
        topReasons: conflictsByReason.rows,
        peakTimes: timePatterns.rows
      }
    });
  } catch (err) {
    console.error('Error generating recommendations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`🚀 W.C.R.E.A.M.S. backend server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`🔗 API base: http://localhost:${port}/api`);
});