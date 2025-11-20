const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');
const { authenticateToken, requireRole, requireOwnership, auditLog } = require('../middleware/auth');

/**
 * @route GET /api/therapists/profile
 * @desc Get therapist profile
 * @access Private (Therapist)
 */
router.get('/profile', authenticateToken, requireRole('therapist'), async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        u.*,
        um.metadata,
        tv.status as verification_status,
        tv.license_number,
        tv.license_state,
        tv.years_experience,
        tv.specializations,
        tv.credentials,
        tv.reviewed_at,
        tv.notes as verification_notes
      FROM users u
      LEFT JOIN user_metadata um ON u.id = um.user_id
      LEFT JOIN therapist_verifications tv ON u.id = tv.user_id
      WHERE u.id = $1
    `, [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Therapist profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    const profile = result.rows[0];
    
    res.json({
      profile: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        phone: profile.phone,
        timezone: profile.timezone,
        language: profile.language,
        preferences: profile.preferences,
        metadata: profile.metadata,
        verification: {
          status: profile.verification_status,
          licenseNumber: profile.license_number,
          licenseState: profile.license_state,
          yearsExperience: profile.years_experience,
          specializations: profile.specializations,
          credentials: profile.credentials,
          reviewedAt: profile.reviewed_at,
          notes: profile.verification_notes
        },
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });

  } catch (error) {
    console.error('Get therapist profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'PROFILE_ERROR'
    });
  }
});

/**
 * @route PUT /api/therapists/profile
 * @desc Update therapist profile
 * @access Private (Therapist)
 */
router.put('/profile', authenticateToken, requireRole('therapist'), auditLog('therapist_profile_update', 'users'), async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      timezone, 
      language, 
      preferences,
      metadata 
    } = req.body;

    const client = await getClient();
    
    try {
      await client.query('BEGIN');

      // Update user profile
      const userUpdates = [];
      const userValues = [];
      let paramCount = 1;

      if (name) {
        userUpdates.push(`name = $${paramCount}`);
        userValues.push(name);
        paramCount++;
      }
      if (phone) {
        userUpdates.push(`phone = $${paramCount}`);
        userValues.push(phone);
        paramCount++;
      }
      if (timezone) {
        userUpdates.push(`timezone = $${paramCount}`);
        userValues.push(timezone);
        paramCount++;
      }
      if (language) {
        userUpdates.push(`language = $${paramCount}`);
        userValues.push(language);
        paramCount++;
      }
      if (preferences) {
        userUpdates.push(`preferences = $${paramCount}`);
        userValues.push(JSON.stringify(preferences));
        paramCount++;
      }

      if (userUpdates.length > 0) {
        userUpdates.push(`updated_at = NOW()`);
        userValues.push(req.user.id);
        
        await client.query(
          `UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${paramCount}`,
          userValues
        );
      }

      // Update metadata
      if (metadata) {
        await client.query(`
          INSERT INTO user_metadata (user_id, metadata, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (user_id) DO UPDATE SET
            metadata = EXCLUDED.metadata,
            updated_at = NOW()
        `, [req.user.id, JSON.stringify(metadata)]);
      }

      await client.query('COMMIT');

      res.json({
        message: 'Therapist profile updated successfully'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Update therapist profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
});

/**
 * @route GET /api/therapists/clients
 * @desc Get therapist's clients
 * @access Private (Therapist)
 */
router.get('/clients', authenticateToken, requireRole('therapist'), async (req, res) => {
  try {
    const { status = 'active', limit = 50, offset = 0 } = req.query;

    const result = await query(`
      SELECT 
        tc.id as relationship_id,
        tc.status,
        tc.start_date,
        tc.end_date,
        tc.notes,
        tc.treatment_plan,
        u.id as client_id,
        u.name as client_name,
        u.email as client_email,
        u.created_at as client_since,
        um.metadata as client_metadata
      FROM therapist_clients tc
      JOIN users u ON tc.client_id = u.id
      LEFT JOIN user_metadata um ON u.id = um.user_id
      WHERE tc.therapist_id = $1
        AND ($2 = 'all' OR tc.status = $2)
      ORDER BY tc.start_date DESC
      LIMIT $3 OFFSET $4
    `, [req.user.id, status, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM therapist_clients tc
      WHERE tc.therapist_id = $1
        AND ($2 = 'all' OR tc.status = $2)
    `, [req.user.id, status]);

    res.json({
      clients: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < parseInt(countResult.rows[0].total)
      },
      status: status
    });

  } catch (error) {
    console.error('Get therapist clients error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'GET_CLIENTS_ERROR'
    });
  }
});

/**
 * @route POST /api/therapists/clients
 * @desc Add new client
 * @access Private (Therapist)
 */
router.post('/clients', authenticateToken, requireRole('therapist'), auditLog('client_added', 'therapist_clients'), async (req, res) => {
  try {
    const { clientId, startDate, notes, treatmentPlan } = req.body;

    if (!clientId) {
      return res.status(400).json({
        error: 'Client ID is required',
        code: 'MISSING_CLIENT_ID'
      });
    }

    // Verify client exists and is not already assigned
    const clientCheck = await query(`
      SELECT 
        u.id,
        u.name,
        u.user_type,
        tc.id as existing_relationship
      FROM users u
      LEFT JOIN therapist_clients tc ON u.id = tc.client_id AND tc.therapist_id = $1 AND tc.status = 'active'
      WHERE u.id = $2
    `, [req.user.id, clientId]);

    if (clientCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Client not found',
        code: 'CLIENT_NOT_FOUND'
      });
    }

    const client = clientCheck.rows[0];

    if (client.user_type !== 'individual') {
      return res.status(400).json({
        error: 'Only individual users can be added as clients',
        code: 'INVALID_CLIENT_TYPE'
      });
    }

    if (client.existing_relationship) {
      return res.status(400).json({
        error: 'Client is already assigned to you',
        code: 'CLIENT_ALREADY_ASSIGNED'
      });
    }

    // Create therapist-client relationship
    const result = await query(`
      INSERT INTO therapist_clients (therapist_id, client_id, start_date, notes, treatment_plan)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      req.user.id,
      clientId,
      startDate || new Date(),
      notes,
      treatmentPlan ? JSON.stringify(treatmentPlan) : null
    ]);

    res.status(201).json({
      message: 'Client added successfully',
      relationship: result.rows[0],
      client: {
        id: client.id,
        name: client.name
      }
    });

  } catch (error) {
    console.error('Add client error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'ADD_CLIENT_ERROR'
    });
  }
});

/**
 * @route PUT /api/therapists/clients/:clientId
 * @desc Update client relationship
 * @access Private (Therapist)
 */
router.put('/clients/:clientId', authenticateToken, requireRole('therapist'), auditLog('client_relationship_update', 'therapist_clients'), async (req, res) => {
  try {
    const { clientId } = req.params;
    const { status, notes, treatmentPlan, endDate } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`);
      values.push(notes);
      paramCount++;
    }
    if (treatmentPlan) {
      updates.push(`treatment_plan = $${paramCount}`);
      values.push(JSON.stringify(treatmentPlan));
      paramCount++;
    }
    if (endDate) {
      updates.push(`end_date = $${paramCount}`);
      values.push(endDate);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        code: 'NO_UPDATES'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user.id, clientId);

    const result = await query(`
      UPDATE therapist_clients 
      SET ${updates.join(', ')}
      WHERE therapist_id = $${paramCount} AND client_id = $${paramCount + 1}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Client relationship not found',
        code: 'RELATIONSHIP_NOT_FOUND'
      });
    }

    res.json({
      message: 'Client relationship updated successfully',
      relationship: result.rows[0]
    });

  } catch (error) {
    console.error('Update client relationship error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'UPDATE_CLIENT_ERROR'
    });
  }
});

/**
 * @route GET /api/therapists/sessions
 * @desc Get therapist's sessions
 * @access Private (Therapist)
 */
router.get('/sessions', authenticateToken, requireRole('therapist'), async (req, res) => {
  try {
    const { status, limit = 50, offset = 0, days = 30 } = req.query;

    let whereClause = 'WHERE ts.therapist_id = $1';
    let params = [req.user.id];
    let paramCount = 1;

    if (status && status !== 'all') {
      paramCount++;
      whereClause += ` AND ts.status = $${paramCount}`;
      params.push(status);
    }

    if (days && days !== 'all') {
      paramCount++;
      whereClause += ` AND ts.scheduled_at >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'`;
    }

    const result = await query(`
      SELECT 
        ts.id,
        ts.scheduled_at,
        ts.duration_minutes,
        ts.status,
        ts.session_notes,
        ts.homework_assigned,
        ts.next_session_date,
        ts.session_recording_url,
        ts.ai_transcript,
        ts.ai_insights,
        ts.created_at,
        ts.updated_at,
        u.id as client_id,
        u.name as client_name,
        u.email as client_email
      FROM therapy_sessions ts
      JOIN users u ON ts.client_id = u.id
      ${whereClause}
      ORDER BY ts.scheduled_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM therapy_sessions ts
      ${whereClause}
    `, params);

    res.json({
      sessions: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < parseInt(countResult.rows[0].total)
      },
      filters: {
        status: status || 'all',
        days: days || 'all'
      }
    });

  } catch (error) {
    console.error('Get therapist sessions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'GET_SESSIONS_ERROR'
    });
  }
});

/**
 * @route POST /api/therapists/sessions
 * @desc Create new therapy session
 * @access Private (Therapist)
 */
router.post('/sessions', authenticateToken, requireRole('therapist'), auditLog('session_created', 'therapy_sessions'), async (req, res) => {
  try {
    const { 
      clientId, 
      scheduledAt, 
      durationMinutes = 60, 
      sessionNotes, 
      homeworkAssigned, 
      nextSessionDate 
    } = req.body;

    if (!clientId || !scheduledAt) {
      return res.status(400).json({
        error: 'Client ID and scheduled time are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Verify client relationship
    const relationshipCheck = await query(`
      SELECT id FROM therapist_clients 
      WHERE therapist_id = $1 AND client_id = $2 AND status = 'active'
    `, [req.user.id, clientId]);

    if (relationshipCheck.rows.length === 0) {
      return res.status(400).json({
        error: 'Client is not assigned to you',
        code: 'CLIENT_NOT_ASSIGNED'
      });
    }

    // Create session
    const result = await query(`
      INSERT INTO therapy_sessions (therapist_id, client_id, scheduled_at, duration_minutes, session_notes, homework_assigned, next_session_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      req.user.id,
      clientId,
      scheduledAt,
      durationMinutes,
      sessionNotes,
      homeworkAssigned,
      nextSessionDate
    ]);

    res.status(201).json({
      message: 'Session created successfully',
      session: result.rows[0]
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'CREATE_SESSION_ERROR'
    });
  }
});

/**
 * @route PUT /api/therapists/sessions/:sessionId
 * @desc Update therapy session
 * @access Private (Therapist)
 */
router.put('/sessions/:sessionId', authenticateToken, requireRole('therapist'), auditLog('session_updated', 'therapy_sessions'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { 
      scheduledAt, 
      durationMinutes, 
      status, 
      sessionNotes, 
      homeworkAssigned, 
      nextSessionDate,
      sessionRecordingUrl,
      aiTranscript,
      aiInsights
    } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (scheduledAt) {
      updates.push(`scheduled_at = $${paramCount}`);
      values.push(scheduledAt);
      paramCount++;
    }
    if (durationMinutes) {
      updates.push(`duration_minutes = $${paramCount}`);
      values.push(durationMinutes);
      paramCount++;
    }
    if (status) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    if (sessionNotes !== undefined) {
      updates.push(`session_notes = $${paramCount}`);
      values.push(sessionNotes);
      paramCount++;
    }
    if (homeworkAssigned !== undefined) {
      updates.push(`homework_assigned = $${paramCount}`);
      values.push(homeworkAssigned);
      paramCount++;
    }
    if (nextSessionDate) {
      updates.push(`next_session_date = $${paramCount}`);
      values.push(nextSessionDate);
      paramCount++;
    }
    if (sessionRecordingUrl) {
      updates.push(`session_recording_url = $${paramCount}`);
      values.push(sessionRecordingUrl);
      paramCount++;
    }
    if (aiTranscript) {
      updates.push(`ai_transcript = $${paramCount}`);
      values.push(aiTranscript);
      paramCount++;
    }
    if (aiInsights) {
      updates.push(`ai_insights = $${paramCount}`);
      values.push(JSON.stringify(aiInsights));
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No fields to update',
        code: 'NO_UPDATES'
      });
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.user.id, sessionId);

    const result = await query(`
      UPDATE therapy_sessions 
      SET ${updates.join(', ')}
      WHERE therapist_id = $${paramCount} AND id = $${paramCount + 1}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Session not found',
        code: 'SESSION_NOT_FOUND'
      });
    }

    res.json({
      message: 'Session updated successfully',
      session: result.rows[0]
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'UPDATE_SESSION_ERROR'
    });
  }
});

/**
 * @route GET /api/therapists/dashboard
 * @desc Get therapist dashboard data
 * @access Private (Therapist)
 */
router.get('/dashboard', authenticateToken, requireRole('therapist'), async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Get client statistics
    const clientStats = await query(`
      SELECT 
        COUNT(*) as total_clients,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_clients,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_clients
      FROM therapist_clients
      WHERE therapist_id = $1
    `, [req.user.id]);

    // Get session statistics
    const sessionStats = await query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_sessions,
        AVG(duration_minutes) as avg_duration,
        COUNT(CASE WHEN scheduled_at >= CURRENT_DATE AND scheduled_at < CURRENT_DATE + INTERVAL '1 day' THEN 1 END) as sessions_today,
        COUNT(CASE WHEN scheduled_at >= CURRENT_DATE AND scheduled_at < CURRENT_DATE + INTERVAL '7 days' THEN 1 END) as sessions_this_week
      FROM therapy_sessions
      WHERE therapist_id = $1
        AND scheduled_at >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
    `, [req.user.id]);

    // Get recent sessions
    const recentSessions = await query(`
      SELECT 
        ts.id,
        ts.scheduled_at,
        ts.status,
        ts.duration_minutes,
        u.name as client_name
      FROM therapy_sessions ts
      JOIN users u ON ts.client_id = u.id
      WHERE ts.therapist_id = $1
      ORDER BY ts.scheduled_at DESC
      LIMIT 5
    `, [req.user.id]);

    // Get upcoming sessions
    const upcomingSessions = await query(`
      SELECT 
        ts.id,
        ts.scheduled_at,
        ts.duration_minutes,
        u.name as client_name
      FROM therapy_sessions ts
      JOIN users u ON ts.client_id = u.id
      WHERE ts.therapist_id = $1
        AND ts.scheduled_at >= CURRENT_DATE
        AND ts.status = 'scheduled'
      ORDER BY ts.scheduled_at ASC
      LIMIT 5
    `, [req.user.id]);

    res.json({
      dashboard: {
        clients: clientStats.rows[0],
        sessions: sessionStats.rows[0],
        recentSessions: recentSessions.rows,
        upcomingSessions: upcomingSessions.rows,
        period: `${days} days`
      }
    });

  } catch (error) {
    console.error('Get therapist dashboard error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'DASHBOARD_ERROR'
    });
  }
});

module.exports = router;
