const admin = require('firebase-admin');
const { query } = require('../config/database');

class PushNotificationService {
  constructor() {
    // Initialize Firebase Admin SDK only if credentials are provided
    const hasCreds =
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY;

    if (hasCreds) {
      try {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
          });
        }
        this.messaging = admin.messaging();
      } catch (err) {
        console.warn('Firebase Admin initialization failed. Push notifications disabled.', err.message);
        this.messaging = null;
      }
    } else {
      console.warn('Firebase credentials not set. Push notifications disabled for this environment.');
      this.messaging = null;
    }
  }

  /**
   * Register a device token for push notifications
   */
  async registerDeviceToken(userId, deviceToken, platform = 'mobile') {
    try {
      await query(
        `INSERT INTO device_tokens (user_id, token, platform, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (user_id, token) 
         DO UPDATE SET platform = $3, updated_at = NOW()`,
        [userId, deviceToken, platform]
      );
      return { success: true, message: 'Device token registered successfully' };
    } catch (error) {
      console.error('Error registering device token:', error);
      throw new Error('Failed to register device token');
    }
  }

  /**
   * Unregister a device token
   */
  async unregisterDeviceToken(userId, deviceToken) {
    try {
      await query(
        'DELETE FROM device_tokens WHERE user_id = $1 AND token = $2',
        [userId, deviceToken]
      );
      return { success: true, message: 'Device token unregistered successfully' };
    } catch (error) {
      console.error('Error unregistering device token:', error);
      throw new Error('Failed to unregister device token');
    }
  }

  /**
   * Send push notification to a specific user
   */
  async sendNotificationToUser(userId, notification) {
    try {
      if (!this.messaging) {
        return { success: false, message: 'Push notifications are disabled in this environment' };
      }
      const tokens = await this.getUserDeviceTokens(userId);
      if (tokens.length === 0) {
        return { success: false, message: 'No device tokens found for user' };
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        tokens: tokens,
      };

      const response = await this.messaging.sendMulticast(message);
      
      // Log notification delivery
      await this.logNotificationDelivery(userId, notification, response);
      
      return {
        success: true,
        message: 'Notification sent successfully',
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  /**
   * Send push notification to multiple users
   */
  async sendNotificationToUsers(userIds, notification) {
    try {
      if (!this.messaging) {
        return userIds.map((userId) => ({
          userId,
          success: false,
          message: 'Push notifications are disabled in this environment',
        }));
      }
      const results = [];
      for (const userId of userIds) {
        const result = await this.sendNotificationToUser(userId, notification);
        results.push({ userId, ...result });
      }
      return results;
    } catch (error) {
      console.error('Error sending notifications to users:', error);
      throw new Error('Failed to send notifications to users');
    }
  }

  /**
   * Send session reminder notification
   */
  async sendSessionReminder(therapistId, clientId, sessionData) {
    const notification = {
      title: 'Session Reminder',
      body: `Your session with ${sessionData.clientName} starts in 15 minutes`,
      data: {
        type: 'session_reminder',
        sessionId: sessionData.sessionId,
        therapistId: therapistId,
        clientId: clientId,
      },
    };

    return await this.sendNotificationToUser(therapistId, notification);
  }

  /**
   * Send conflict resolution notification
   */
  async sendConflictResolutionNotification(userId, conflictData) {
    const notification = {
      title: 'Conflict Resolution Update',
      body: `New insights available for your conflict: ${conflictData.title}`,
      data: {
        type: 'conflict_update',
        conflictId: conflictData.id,
        userId: userId,
      },
    };

    return await this.sendNotificationToUser(userId, notification);
  }

  /**
   * Send emotion check-in reminder
   */
  async sendEmotionCheckInReminder(userId) {
    const notification = {
      title: 'Daily Check-in',
      body: 'How are you feeling today? Take a moment to check in.',
      data: {
        type: 'emotion_checkin',
        userId: userId,
      },
    };

    return await this.sendNotificationToUser(userId, notification);
  }

  /**
   * Get device tokens for a user
   */
  async getUserDeviceTokens(userId) {
    try {
      const result = await query(
        'SELECT token FROM device_tokens WHERE user_id = $1 AND active = true',
        [userId]
      );
      return result.rows.map(row => row.token);
    } catch (error) {
      console.error('Error getting user device tokens:', error);
      return [];
    }
  }

  /**
   * Log notification delivery
   */
  async logNotificationDelivery(userId, notification, response) {
    try {
      await query(
        `INSERT INTO notification_logs (user_id, title, body, data, success_count, failure_count, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          userId,
          notification.title,
          notification.body,
          JSON.stringify(notification.data || {}),
          response.successCount,
          response.failureCount,
        ]
      );
    } catch (error) {
      console.error('Error logging notification delivery:', error);
    }
  }

  /**
   * Get notification history for a user
   */
  async getNotificationHistory(userId, limit = 50) {
    try {
      const result = await query(
        `SELECT * FROM notification_logs 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [userId, limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }
}

module.exports = new PushNotificationService();
