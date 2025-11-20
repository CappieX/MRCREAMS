const { query } = require('../config/database');
const axios = require('axios');

class VideoConferencingService {
  /**
   * Create Zoom meeting for therapy session
   */
  async createZoomMeeting(sessionId, therapistId) {
    try {
      // Get session details
      const sessionResult = await query(
        `SELECT s.id, s.title, s.description, s.scheduled_at, s.duration_minutes,
                c.first_name as client_first_name, c.last_name as client_last_name,
                t.first_name as therapist_first_name, t.last_name as therapist_last_name
         FROM therapy_sessions s
         JOIN users c ON s.client_id = c.id
         JOIN users t ON s.therapist_id = t.id
         WHERE s.id = $1`,
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        throw new Error('Session not found');
      }

      const session = sessionResult.rows[0];

      // Get Zoom access token
      const accessToken = await this.getZoomAccessToken();

      // Create Zoom meeting
      const meetingData = {
        topic: `${session.title} - ${session.therapist_first_name} ${session.therapist_last_name}`,
        type: 2, // Scheduled meeting
        start_time: new Date(session.scheduled_at).toISOString(),
        duration: session.duration_minutes,
        timezone: 'UTC',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: true,
          use_pmi: false,
          approval_type: 0, // Automatically approve
          audio: 'both',
          auto_recording: 'cloud', // Record to cloud
          enforce_login: false,
          waiting_room: true
        }
      };

      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const meeting = response.data;

      // Store meeting details
      await query(
        `INSERT INTO video_meetings (session_id, provider, meeting_id, join_url, password, start_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (session_id, provider) 
         DO UPDATE SET meeting_id = $3, join_url = $4, password = $5, start_url = $6, updated_at = NOW()`,
        [sessionId, 'zoom', meeting.id, meeting.join_url, meeting.password, meeting.start_url]
      );

      return {
        success: true,
        data: {
          meetingId: meeting.id,
          joinUrl: meeting.join_url,
          password: meeting.password,
          startUrl: meeting.start_url,
          provider: 'zoom'
        }
      };
    } catch (error) {
      console.error('Create Zoom meeting error:', error);
      throw new Error('Failed to create Zoom meeting');
    }
  }

  /**
   * Create Microsoft Teams meeting for therapy session
   */
  async createTeamsMeeting(sessionId, therapistId) {
    try {
      // Get session details
      const sessionResult = await query(
        `SELECT s.id, s.title, s.description, s.scheduled_at, s.duration_minutes,
                c.first_name as client_first_name, c.last_name as client_last_name,
                t.first_name as therapist_first_name, t.last_name as therapist_last_name
         FROM therapy_sessions s
         JOIN users c ON s.client_id = c.id
         JOIN users t ON s.therapist_id = t.id
         WHERE s.id = $1`,
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        throw new Error('Session not found');
      }

      const session = sessionResult.rows[0];

      // Get Microsoft Graph access token
      const accessToken = await this.getMicrosoftGraphToken();

      // Create Teams meeting
      const meetingData = {
        subject: `${session.title} - ${session.therapist_first_name} ${session.therapist_last_name}`,
        body: {
          contentType: 'text',
          content: session.description || 'Therapy session'
        },
        start: {
          dateTime: new Date(session.scheduled_at).toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(new Date(session.scheduled_at).getTime() + session.duration_minutes * 60000).toISOString(),
          timeZone: 'UTC'
        },
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness'
      };

      const response = await axios.post(
        'https://graph.microsoft.com/v1.0/me/events',
        meetingData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const meeting = response.data;

      // Store meeting details
      await query(
        `INSERT INTO video_meetings (session_id, provider, meeting_id, join_url, password, start_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (session_id, provider) 
         DO UPDATE SET meeting_id = $3, join_url = $4, password = $5, start_url = $6, updated_at = NOW()`,
        [sessionId, 'teams', meeting.id, meeting.onlineMeeting.joinUrl, null, meeting.onlineMeeting.joinUrl]
      );

      return {
        success: true,
        data: {
          meetingId: meeting.id,
          joinUrl: meeting.onlineMeeting.joinUrl,
          password: null,
          startUrl: meeting.onlineMeeting.joinUrl,
          provider: 'teams'
        }
      };
    } catch (error) {
      console.error('Create Teams meeting error:', error);
      throw new Error('Failed to create Teams meeting');
    }
  }

  /**
   * Get Zoom access token
   */
  async getZoomAccessToken() {
    try {
      const response = await axios.post('https://zoom.us/oauth/token', {
        grant_type: 'client_credentials',
        client_id: process.env.ZOOM_CLIENT_ID,
        client_secret: process.env.ZOOM_CLIENT_SECRET
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Get Zoom access token error:', error);
      throw new Error('Failed to get Zoom access token');
    }
  }

  /**
   * Get Microsoft Graph access token
   */
  async getMicrosoftGraphToken() {
    try {
      const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials'
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Get Microsoft Graph token error:', error);
      throw new Error('Failed to get Microsoft Graph token');
    }
  }

  /**
   * Get meeting details for session
   */
  async getSessionMeeting(sessionId) {
    try {
      const result = await query(
        'SELECT * FROM video_meetings WHERE session_id = $1 ORDER BY created_at DESC LIMIT 1',
        [sessionId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const meeting = result.rows[0];

      return {
        meetingId: meeting.meeting_id,
        joinUrl: meeting.join_url,
        password: meeting.password,
        startUrl: meeting.start_url,
        provider: meeting.provider,
        createdAt: meeting.created_at
      };
    } catch (error) {
      console.error('Get session meeting error:', error);
      return null;
    }
  }

  /**
   * Update meeting details
   */
  async updateMeeting(sessionId, meetingData) {
    try {
      const { provider, meetingId, joinUrl, password, startUrl } = meetingData;

      await query(
        `UPDATE video_meetings 
         SET meeting_id = $1, join_url = $2, password = $3, start_url = $4, updated_at = NOW()
         WHERE session_id = $5 AND provider = $6`,
        [meetingId, joinUrl, password, startUrl, sessionId, provider]
      );

      return {
        success: true,
        message: 'Meeting updated successfully'
      };
    } catch (error) {
      console.error('Update meeting error:', error);
      throw new Error('Failed to update meeting');
    }
  }

  /**
   * Delete meeting
   */
  async deleteMeeting(sessionId, provider) {
    try {
      // Get meeting details
      const meeting = await this.getSessionMeeting(sessionId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Delete from external service
      if (provider === 'zoom') {
        await this.deleteZoomMeeting(meeting.meetingId);
      } else if (provider === 'teams') {
        await this.deleteTeamsMeeting(meeting.meetingId);
      }

      // Delete from database
      await query(
        'DELETE FROM video_meetings WHERE session_id = $1 AND provider = $2',
        [sessionId, provider]
      );

      return {
        success: true,
        message: 'Meeting deleted successfully'
      };
    } catch (error) {
      console.error('Delete meeting error:', error);
      throw new Error('Failed to delete meeting');
    }
  }

  /**
   * Delete Zoom meeting
   */
  async deleteZoomMeeting(meetingId) {
    try {
      const accessToken = await this.getZoomAccessToken();

      await axios.delete(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
    } catch (error) {
      console.error('Delete Zoom meeting error:', error);
      throw new Error('Failed to delete Zoom meeting');
    }
  }

  /**
   * Delete Teams meeting
   */
  async deleteTeamsMeeting(meetingId) {
    try {
      const accessToken = await this.getMicrosoftGraphToken();

      await axios.delete(
        `https://graph.microsoft.com/v1.0/me/events/${meetingId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
    } catch (error) {
      console.error('Delete Teams meeting error:', error);
      throw new Error('Failed to delete Teams meeting');
    }
  }

  /**
   * Get meeting participants
   */
  async getMeetingParticipants(sessionId) {
    try {
      const meeting = await this.getSessionMeeting(sessionId);
      if (!meeting) {
        return [];
      }

      let participants = [];

      if (meeting.provider === 'zoom') {
        participants = await this.getZoomMeetingParticipants(meeting.meetingId);
      } else if (meeting.provider === 'teams') {
        participants = await this.getTeamsMeetingParticipants(meeting.meetingId);
      }

      return participants;
    } catch (error) {
      console.error('Get meeting participants error:', error);
      return [];
    }
  }

  /**
   * Get Zoom meeting participants
   */
  async getZoomMeetingParticipants(meetingId) {
    try {
      const accessToken = await this.getZoomAccessToken();

      const response = await axios.get(
        `https://api.zoom.us/v2/meetings/${meetingId}/participants`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.participants.map(participant => ({
        id: participant.id,
        name: participant.name,
        email: participant.email,
        joinTime: participant.join_time,
        leaveTime: participant.leave_time,
        duration: participant.duration
      }));
    } catch (error) {
      console.error('Get Zoom meeting participants error:', error);
      return [];
    }
  }

  /**
   * Get Teams meeting participants
   */
  async getTeamsMeetingParticipants(meetingId) {
    try {
      const accessToken = await this.getMicrosoftGraphToken();

      const response = await axios.get(
        `https://graph.microsoft.com/v1.0/me/events/${meetingId}/attachments`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // Teams doesn't provide participant details in the same way as Zoom
      // This would need to be implemented based on specific requirements
      return [];
    } catch (error) {
      console.error('Get Teams meeting participants error:', error);
      return [];
    }
  }

  /**
   * Send meeting reminders
   */
  async sendMeetingReminders(sessionId) {
    try {
      const meeting = await this.getSessionMeeting(sessionId);
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      // Get session details
      const sessionResult = await query(
        `SELECT s.id, s.title, s.scheduled_at, s.duration_minutes,
                c.email as client_email, c.first_name as client_first_name,
                t.email as therapist_email, t.first_name as therapist_first_name
         FROM therapy_sessions s
         JOIN users c ON s.client_id = c.id
         JOIN users t ON s.therapist_id = t.id
         WHERE s.id = $1`,
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        throw new Error('Session not found');
      }

      const session = sessionResult.rows[0];

      // Send email reminders
      const emailService = require('./emailService');
      
      // Send to client
      await emailService.sendMeetingReminder(session.client_email, {
        clientName: session.client_first_name,
        therapistName: session.therapist_first_name,
        sessionTitle: session.title,
        scheduledAt: session.scheduled_at,
        joinUrl: meeting.joinUrl,
        password: meeting.password,
        provider: meeting.provider
      });

      // Send to therapist
      await emailService.sendMeetingReminder(session.therapist_email, {
        clientName: session.client_first_name,
        therapistName: session.therapist_first_name,
        sessionTitle: session.title,
        scheduledAt: session.scheduled_at,
        joinUrl: meeting.joinUrl,
        password: meeting.password,
        provider: meeting.provider
      });

      return {
        success: true,
        message: 'Meeting reminders sent successfully'
      };
    } catch (error) {
      console.error('Send meeting reminders error:', error);
      throw new Error('Failed to send meeting reminders');
    }
  }

  /**
   * Get meeting recording (if available)
   */
  async getMeetingRecording(sessionId) {
    try {
      const meeting = await this.getSessionMeeting(sessionId);
      if (!meeting) {
        return null;
      }

      if (meeting.provider === 'zoom') {
        return await this.getZoomMeetingRecording(meeting.meetingId);
      }

      return null;
    } catch (error) {
      console.error('Get meeting recording error:', error);
      return null;
    }
  }

  /**
   * Get Zoom meeting recording
   */
  async getZoomMeetingRecording(meetingId) {
    try {
      const accessToken = await this.getZoomAccessToken();

      const response = await axios.get(
        `https://api.zoom.us/v2/meetings/${meetingId}/recordings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.recording_files.map(file => ({
        id: file.id,
        fileType: file.file_type,
        fileSize: file.file_size,
        playUrl: file.play_url,
        downloadUrl: file.download_url,
        recordingStart: file.recording_start,
        recordingEnd: file.recording_end
      }));
    } catch (error) {
      console.error('Get Zoom meeting recording error:', error);
      return [];
    }
  }
}

module.exports = new VideoConferencingService();
