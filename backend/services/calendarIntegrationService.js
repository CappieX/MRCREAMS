const { query } = require('../config/database');
const axios = require('axios');

class CalendarIntegrationService {
  /**
   * Connect Google Calendar
   */
  async connectGoogleCalendar(userId, authCode) {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: authCode,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI
      });

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Store calendar connection
      await query(
        `INSERT INTO calendar_integrations (user_id, provider, access_token, refresh_token, expires_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         ON CONFLICT (user_id, provider) 
         DO UPDATE SET access_token = $3, refresh_token = $4, expires_at = $5, updated_at = NOW()`,
        [userId, 'google', access_token, refresh_token, new Date(Date.now() + expires_in * 1000)]
      );

      return {
        success: true,
        message: 'Google Calendar connected successfully',
        data: {
          provider: 'google',
          connectedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Google Calendar connection error:', error);
      throw new Error('Failed to connect Google Calendar');
    }
  }

  /**
   * Connect Outlook Calendar
   */
  async connectOutlookCalendar(userId, authCode) {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        client_id: process.env.OUTLOOK_CLIENT_ID,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET,
        code: authCode,
        grant_type: 'authorization_code',
        redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
        scope: 'https://graph.microsoft.com/calendars.readwrite'
      });

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      // Store calendar connection
      await query(
        `INSERT INTO calendar_integrations (user_id, provider, access_token, refresh_token, expires_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         ON CONFLICT (user_id, provider) 
         DO UPDATE SET access_token = $3, refresh_token = $4, expires_at = $5, updated_at = NOW()`,
        [userId, 'outlook', access_token, refresh_token, new Date(Date.now() + expires_in * 1000)]
      );

      return {
        success: true,
        message: 'Outlook Calendar connected successfully',
        data: {
          provider: 'outlook',
          connectedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Outlook Calendar connection error:', error);
      throw new Error('Failed to connect Outlook Calendar');
    }
  }

  /**
   * Create calendar event
   */
  async createCalendarEvent(userId, eventData) {
    try {
      const { title, description, startTime, endTime, provider = 'google' } = eventData;

      // Get user's calendar integration
      const integration = await this.getCalendarIntegration(userId, provider);
      if (!integration) {
        throw new Error(`No ${provider} calendar integration found`);
      }

      // Check if token needs refresh
      const refreshedIntegration = await this.refreshTokenIfNeeded(integration);

      let eventResponse;
      if (provider === 'google') {
        eventResponse = await this.createGoogleCalendarEvent(refreshedIntegration.access_token, {
          summary: title,
          description: description,
          start: { dateTime: startTime, timeZone: 'UTC' },
          end: { dateTime: endTime, timeZone: 'UTC' }
        });
      } else if (provider === 'outlook') {
        eventResponse = await this.createOutlookCalendarEvent(refreshedIntegration.access_token, {
          subject: title,
          body: { content: description, contentType: 'text' },
          start: { dateTime: startTime, timeZone: 'UTC' },
          end: { dateTime: endTime, timeZone: 'UTC' }
        });
      }

      // Store event reference
      await query(
        `INSERT INTO calendar_events (user_id, provider, external_event_id, title, description, start_time, end_time, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [userId, provider, eventResponse.id, title, description, startTime, endTime]
      );

      return {
        success: true,
        message: 'Calendar event created successfully',
        data: {
          eventId: eventResponse.id,
          provider: provider,
          title: title,
          startTime: startTime,
          endTime: endTime
        }
      };
    } catch (error) {
      console.error('Create calendar event error:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Sync therapy sessions with calendar
   */
  async syncTherapySessions(userId, sessionId, provider = 'google') {
    try {
      // Get session details
      const sessionResult = await query(
        `SELECT s.id, s.title, s.description, s.scheduled_at, s.duration_minutes,
                t.first_name as therapist_first_name, t.last_name as therapist_last_name
         FROM therapy_sessions s
         JOIN users t ON s.therapist_id = t.id
         WHERE s.id = $1`,
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        throw new Error('Session not found');
      }

      const session = sessionResult.rows[0];
      const startTime = new Date(session.scheduled_at);
      const endTime = new Date(startTime.getTime() + session.duration_minutes * 60000);

      const eventData = {
        title: `${session.title} - ${session.therapist_first_name} ${session.therapist_last_name}`,
        description: session.description || 'Therapy session',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      return await this.createCalendarEvent(userId, eventData);
    } catch (error) {
      console.error('Sync therapy session error:', error);
      throw new Error('Failed to sync therapy session');
    }
  }

  /**
   * Get calendar integration
   */
  async getCalendarIntegration(userId, provider) {
    try {
      const result = await query(
        'SELECT * FROM calendar_integrations WHERE user_id = $1 AND provider = $2',
        [userId, provider]
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error('Get calendar integration error:', error);
      return null;
    }
  }

  /**
   * Refresh access token if needed
   */
  async refreshTokenIfNeeded(integration) {
    try {
      if (new Date(integration.expires_at) > new Date()) {
        return integration; // Token is still valid
      }

      let tokenResponse;
      if (integration.provider === 'google') {
        tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: integration.refresh_token,
          grant_type: 'refresh_token'
        });
      } else if (integration.provider === 'outlook') {
        tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
          client_id: process.env.OUTLOOK_CLIENT_ID,
          client_secret: process.env.OUTLOOK_CLIENT_SECRET,
          refresh_token: integration.refresh_token,
          grant_type: 'refresh_token',
          scope: 'https://graph.microsoft.com/calendars.readwrite'
        });
      }

      const { access_token, expires_in } = tokenResponse.data;

      // Update integration with new token
      await query(
        'UPDATE calendar_integrations SET access_token = $1, expires_at = $2, updated_at = NOW() WHERE id = $3',
        [access_token, new Date(Date.now() + expires_in * 1000), integration.id]
      );

      return {
        ...integration,
        access_token,
        expires_at: new Date(Date.now() + expires_in * 1000)
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Create Google Calendar event
   */
  async createGoogleCalendarEvent(accessToken, eventData) {
    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        eventData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Google Calendar event creation error:', error);
      throw new Error('Failed to create Google Calendar event');
    }
  }

  /**
   * Create Outlook Calendar event
   */
  async createOutlookCalendarEvent(accessToken, eventData) {
    try {
      const response = await axios.post(
        'https://graph.microsoft.com/v1.0/me/events',
        eventData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Outlook Calendar event creation error:', error);
      throw new Error('Failed to create Outlook Calendar event');
    }
  }

  /**
   * Disconnect calendar integration
   */
  async disconnectCalendar(userId, provider) {
    try {
      await query(
        'DELETE FROM calendar_integrations WHERE user_id = $1 AND provider = $2',
        [userId, provider]
      );

      return {
        success: true,
        message: `${provider} calendar disconnected successfully`
      };
    } catch (error) {
      console.error('Disconnect calendar error:', error);
      throw new Error('Failed to disconnect calendar');
    }
  }

  /**
   * Get user's calendar integrations
   */
  async getUserCalendarIntegrations(userId) {
    try {
      const result = await query(
        'SELECT provider, created_at, updated_at FROM calendar_integrations WHERE user_id = $1',
        [userId]
      );

      return result.rows.map(row => ({
        provider: row.provider,
        connectedAt: row.created_at,
        lastUpdated: row.updated_at
      }));
    } catch (error) {
      console.error('Get user calendar integrations error:', error);
      return [];
    }
  }
}

module.exports = new CalendarIntegrationService();
