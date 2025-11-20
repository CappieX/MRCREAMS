const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const pool = require('../config/database');

// Middleware to check support permissions
const requireSupportAccess = (req, res, next) => {
  const allowedRoles = ['super_admin', 'admin', 'support'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// GET /api/v1/support/tickets - List tickets with filters
router.get('/tickets', authenticateToken, async (req, res) => {
  try {
    const {
      status,
      priority,
      assigned_agent_id,
      requester_id,
      category_id,
      search,
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    let query = `
      SELECT 
        t.*,
        tc.name as category_name,
        tc.color as category_color,
        u1.name as requester_name,
        u1.email as requester_email,
        u2.name as agent_name,
        u2.email as agent_email,
        o.name as organization_name,
        (SELECT COUNT(*) FROM ticket_activities WHERE ticket_id = t.id AND activity_type = 'comment') as comment_count
      FROM support_tickets t
      LEFT JOIN ticket_categories tc ON t.category_id = tc.id
      LEFT JOIN users u1 ON t.requester_id = u1.id
      LEFT JOIN users u2 ON t.assigned_agent_id = u2.id
      LEFT JOIN organizations o ON t.organization_id = o.id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Apply filters
    if (status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (priority) {
      query += ` AND t.priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }

    if (assigned_agent_id) {
      if (assigned_agent_id === 'unassigned') {
        query += ` AND t.assigned_agent_id IS NULL`;
      } else {
        query += ` AND t.assigned_agent_id = $${paramCount}`;
        params.push(assigned_agent_id);
        paramCount++;
      }
    }

    if (requester_id) {
      query += ` AND t.requester_id = $${paramCount}`;
      params.push(requester_id);
      paramCount++;
    }

    if (category_id) {
      query += ` AND t.category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount} OR t.ticket_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Role-based filtering
    if (req.user.role === 'support') {
      query += ` AND (t.assigned_agent_id = $${paramCount} OR t.assigned_agent_id IS NULL)`;
      params.push(req.user.id);
      paramCount++;
    } else if (!['super_admin', 'admin'].includes(req.user.role)) {
      // Regular users can only see their own tickets
      query += ` AND t.requester_id = $${paramCount}`;
      params.push(req.user.id);
      paramCount++;
    }

    // Get total count
    const countQuery = query.replace(/SELECT.*FROM/, 'SELECT COUNT(*) FROM').split('ORDER BY')[0];
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);

    // Add sorting and pagination
    query += ` ORDER BY t.${sort_by} ${sort_order}`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, (page - 1) * limit);

    const result = await pool.query(query, params);

    res.json({
      tickets: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// POST /api/v1/support/tickets - Create new ticket
router.post('/tickets', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      title,
      description,
      priority = 'medium',
      category_id,
      source = 'web',
      tags = [],
      attachments = []
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    await client.query('BEGIN');

    // Create ticket
    const ticketResult = await client.query(
      `INSERT INTO support_tickets 
        (title, description, priority, category_id, requester_id, organization_id, source, tags, attachments, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'open')
       RETURNING *`,
      [title, description, priority, category_id, req.user.id, req.user.organization_id, source, tags, attachments]
    );

    const ticket = ticketResult.rows[0];

    // Log activity
    await client.query(
      `INSERT INTO ticket_activities (ticket_id, user_id, activity_type, content)
       VALUES ($1, $2, 'comment', $3)`,
      [ticket.id, req.user.id, `Ticket created: ${title}`]
    );

    // Auto-assign if possible
    const agentResult = await client.query(
      `SELECT user_id FROM support_agents 
       WHERE is_available = true 
       AND current_ticket_count < max_tickets
       ORDER BY current_ticket_count ASC, performance_score DESC
       LIMIT 1`
    );

    if (agentResult.rows.length > 0) {
      const agentId = agentResult.rows[0].user_id;
      await client.query(
        `UPDATE support_tickets SET assigned_agent_id = $1 WHERE id = $2`,
        [agentId, ticket.id]
      );
      await client.query(
        `UPDATE support_agents SET current_ticket_count = current_ticket_count + 1 WHERE user_id = $1`,
        [agentId]
      );
      await client.query(
        `INSERT INTO ticket_activities (ticket_id, user_id, activity_type, content, metadata)
         VALUES ($1, $2, 'assignment', 'Auto-assigned to agent', $3)`,
        [ticket.id, agentId, JSON.stringify({ agent_id: agentId })]
      );
    }

    await client.query('COMMIT');

    // Fetch complete ticket with relations
    const completeTicket = await pool.query(
      `SELECT t.*, tc.name as category_name, u.name as requester_name
       FROM support_tickets t
       LEFT JOIN ticket_categories tc ON t.category_id = tc.id
       LEFT JOIN users u ON t.requester_id = u.id
       WHERE t.id = $1`,
      [ticket.id]
    );

    res.status(201).json(completeTicket.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  } finally {
    client.release();
  }
});

// GET /api/v1/support/tickets/:id - Get single ticket
router.get('/tickets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const ticketResult = await pool.query(
      `SELECT 
        t.*,
        tc.name as category_name,
        tc.color as category_color,
        u1.name as requester_name,
        u1.email as requester_email,
        u2.name as agent_name,
        u2.email as agent_email,
        o.name as organization_name
       FROM support_tickets t
       LEFT JOIN ticket_categories tc ON t.category_id = tc.id
       LEFT JOIN users u1 ON t.requester_id = u1.id
       LEFT JOIN users u2 ON t.assigned_agent_id = u2.id
       LEFT JOIN organizations o ON t.organization_id = o.id
       WHERE t.id = $1`,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];

    // Check permissions
    const canView = 
      req.user.role === 'super_admin' ||
      req.user.role === 'admin' ||
      req.user.role === 'support' ||
      ticket.requester_id === req.user.id ||
      ticket.assigned_agent_id === req.user.id;

    if (!canView) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get activities
    const activitiesResult = await pool.query(
      `SELECT ta.*, u.name as user_name, u.email as user_email
       FROM ticket_activities ta
       LEFT JOIN users u ON ta.user_id = u.id
       WHERE ta.ticket_id = $1
       ORDER BY ta.created_at ASC`,
      [id]
    );

    ticket.activities = activitiesResult.rows;

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// PUT /api/v1/support/tickets/:id - Update ticket
router.put('/tickets/:id', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status, priority, assigned_agent_id, category_id, tags } = req.body;

    await client.query('BEGIN');

    // Get current ticket
    const currentTicket = await client.query(
      'SELECT * FROM support_tickets WHERE id = $1',
      [id]
    );

    if (currentTicket.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = currentTicket.rows[0];

    // Build update query
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (status && status !== ticket.status) {
      updates.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;

      // Log status change
      await client.query(
        `INSERT INTO ticket_activities (ticket_id, user_id, activity_type, content, metadata)
         VALUES ($1, $2, 'status_change', $3, $4)`,
        [id, req.user.id, `Status changed from ${ticket.status} to ${status}`, 
         JSON.stringify({ old_status: ticket.status, new_status: status })]
      );

      // Set resolved_at if status is resolved or closed
      if (['resolved', 'closed'].includes(status) && !ticket.resolved_at) {
        updates.push(`resolved_at = CURRENT_TIMESTAMP`);
        const resolutionTime = Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 60000);
        updates.push(`resolution_time_minutes = ${resolutionTime}`);
      }
    }

    if (priority && priority !== ticket.priority) {
      updates.push(`priority = $${paramCount}`);
      params.push(priority);
      paramCount++;

      await client.query(
        `INSERT INTO ticket_activities (ticket_id, user_id, activity_type, content, metadata)
         VALUES ($1, $2, 'priority_change', $3, $4)`,
        [id, req.user.id, `Priority changed from ${ticket.priority} to ${priority}`,
         JSON.stringify({ old_priority: ticket.priority, new_priority: priority })]
      );
    }

    if (assigned_agent_id !== undefined && assigned_agent_id !== ticket.assigned_agent_id) {
      updates.push(`assigned_agent_id = $${paramCount}`);
      params.push(assigned_agent_id || null);
      paramCount++;

      // Update agent ticket counts
      if (ticket.assigned_agent_id) {
        await client.query(
          'UPDATE support_agents SET current_ticket_count = current_ticket_count - 1 WHERE user_id = $1',
          [ticket.assigned_agent_id]
        );
      }
      if (assigned_agent_id) {
        await client.query(
          'UPDATE support_agents SET current_ticket_count = current_ticket_count + 1 WHERE user_id = $1',
          [assigned_agent_id]
        );
      }

      await client.query(
        `INSERT INTO ticket_activities (ticket_id, user_id, activity_type, content, metadata)
         VALUES ($1, $2, 'assignment', $3, $4)`,
        [id, req.user.id, `Ticket reassigned`,
         JSON.stringify({ old_agent: ticket.assigned_agent_id, new_agent: assigned_agent_id })]
      );
    }

    if (category_id && category_id !== ticket.category_id) {
      updates.push(`category_id = $${paramCount}`);
      params.push(category_id);
      paramCount++;
    }

    if (tags) {
      updates.push(`tags = $${paramCount}`);
      params.push(tags);
      paramCount++;
    }

    if (updates.length > 0) {
      params.push(id);
      const updateQuery = `UPDATE support_tickets SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      const result = await client.query(updateQuery, params);
      await client.query('COMMIT');
      res.json(result.rows[0]);
    } else {
      await client.query('COMMIT');
      res.json(ticket);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  } finally {
    client.release();
  }
});

// POST /api/v1/support/tickets/:id/comments - Add comment
router.post('/tickets/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_internal = false } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await pool.query(
      `INSERT INTO ticket_activities (ticket_id, user_id, activity_type, content, is_internal)
       VALUES ($1, $2, 'comment', $3, $4)
       RETURNING *`,
      [id, req.user.id, content, is_internal]
    );

    // Update first_response_at if this is the first agent response
    await pool.query(
      `UPDATE support_tickets 
       SET first_response_at = CURRENT_TIMESTAMP,
           response_time_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - created_at)) / 60
       WHERE id = $1 AND first_response_at IS NULL`,
      [id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// GET /api/v1/support/analytics/overview - Dashboard stats
router.get('/analytics/overview', authenticateToken, requireSupportAccess, async (req, res) => {
  try {
    const stats = await pool.query('SELECT * FROM ticket_statistics');
    
    // Get recent activity
    const recentActivity = await pool.query(
      `SELECT ta.*, t.ticket_number, u.name as user_name
       FROM ticket_activities ta
       JOIN support_tickets t ON ta.ticket_id = t.id
       JOIN users u ON ta.user_id = u.id
       ORDER BY ta.created_at DESC
       LIMIT 10`
    );

    // Get overdue tickets
    const overdueTickets = await pool.query(
      `SELECT t.*, tc.name as category_name, sla.resolution_minutes
       FROM support_tickets t
       LEFT JOIN ticket_categories tc ON t.category_id = tc.id
       LEFT JOIN ticket_sla_configs sla ON t.priority = sla.priority
       WHERE t.status NOT IN ('resolved', 'closed')
       AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - t.created_at)) / 60 > sla.resolution_minutes
       ORDER BY t.priority DESC, t.created_at ASC`
    );

    res.json({
      stats: stats.rows[0],
      recent_activity: recentActivity.rows,
      overdue_tickets: overdueTickets.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/v1/support/categories - Get ticket categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ticket_categories WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/v1/support/tickets/bulk-update - Bulk update tickets
router.post('/tickets/bulk-update', authenticateToken, requireSupportAccess, async (req, res) => {
  const client = await pool.connect();
  try {
    const { ticket_ids, updates } = req.body;

    if (!ticket_ids || !Array.isArray(ticket_ids) || ticket_ids.length === 0) {
      return res.status(400).json({ error: 'ticket_ids array is required' });
    }

    await client.query('BEGIN');

    for (const ticketId of ticket_ids) {
      if (updates.status) {
        await client.query(
          'UPDATE support_tickets SET status = $1 WHERE id = $2',
          [updates.status, ticketId]
        );
      }
      if (updates.assigned_agent_id) {
        await client.query(
          'UPDATE support_tickets SET assigned_agent_id = $1 WHERE id = $2',
          [updates.assigned_agent_id, ticketId]
        );
      }
      if (updates.priority) {
        await client.query(
          'UPDATE support_tickets SET priority = $1 WHERE id = $2',
          [updates.priority, ticketId]
        );
      }

      // Log activity
      await client.query(
        `INSERT INTO ticket_activities (ticket_id, user_id, activity_type, content)
         VALUES ($1, $2, 'status_change', 'Bulk update applied')`,
        [ticketId, req.user.id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: `${ticket_ids.length} tickets updated successfully` });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error bulk updating tickets:', error);
    res.status(500).json({ error: 'Failed to bulk update tickets' });
  } finally {
    client.release();
  }
});

module.exports = router;
