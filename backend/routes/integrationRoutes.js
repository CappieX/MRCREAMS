const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const calendarIntegrationService = require('../services/calendarIntegrationService');
const paymentIntegrationService = require('../services/paymentIntegrationService');
const videoConferencingService = require('../services/videoConferencingService');

// Calendar Integration Routes

// Connect Google Calendar
router.post('/calendar/google/connect', authenticateToken, async (req, res) => {
  try {
    const { authCode } = req.body;
    const userId = req.user.userId;

    if (!authCode) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
        code: 'MISSING_AUTH_CODE'
      });
    }

    const result = await calendarIntegrationService.connectGoogleCalendar(userId, authCode);

    res.json(result);
  } catch (error) {
    console.error('Google Calendar connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect Google Calendar',
      code: 'CALENDAR_CONNECTION_ERROR'
    });
  }
});

// Connect Outlook Calendar
router.post('/calendar/outlook/connect', authenticateToken, async (req, res) => {
  try {
    const { authCode } = req.body;
    const userId = req.user.userId;

    if (!authCode) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
        code: 'MISSING_AUTH_CODE'
      });
    }

    const result = await calendarIntegrationService.connectOutlookCalendar(userId, authCode);

    res.json(result);
  } catch (error) {
    console.error('Outlook Calendar connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect Outlook Calendar',
      code: 'CALENDAR_CONNECTION_ERROR'
    });
  }
});

// Create calendar event
router.post('/calendar/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, startTime, endTime, provider = 'google' } = req.body;
    const userId = req.user.userId;

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Title, start time, and end time are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    const result = await calendarIntegrationService.createCalendarEvent(userId, {
      title,
      description,
      startTime,
      endTime,
      provider
    });

    res.json(result);
  } catch (error) {
    console.error('Create calendar event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create calendar event',
      code: 'CALENDAR_EVENT_ERROR'
    });
  }
});

// Sync therapy session with calendar
router.post('/calendar/sessions/:sessionId/sync', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { provider = 'google' } = req.body;
    const userId = req.user.userId;

    const result = await calendarIntegrationService.syncTherapySessions(userId, sessionId, provider);

    res.json(result);
  } catch (error) {
    console.error('Sync therapy session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync therapy session',
      code: 'SESSION_SYNC_ERROR'
    });
  }
});

// Get calendar integrations
router.get('/calendar/integrations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const integrations = await calendarIntegrationService.getUserCalendarIntegrations(userId);

    res.json({
      success: true,
      data: { integrations }
    });
  } catch (error) {
    console.error('Get calendar integrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get calendar integrations',
      code: 'CALENDAR_INTEGRATIONS_ERROR'
    });
  }
});

// Disconnect calendar
router.delete('/calendar/:provider/disconnect', authenticateToken, async (req, res) => {
  try {
    const { provider } = req.params;
    const userId = req.user.userId;

    const result = await calendarIntegrationService.disconnectCalendar(userId, provider);

    res.json(result);
  } catch (error) {
    console.error('Disconnect calendar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect calendar',
      code: 'CALENDAR_DISCONNECT_ERROR'
    });
  }
});

// Payment Integration Routes

// Create payment intent for session
router.post('/payments/sessions/:sessionId/intent', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { amount, currency = 'usd' } = req.body;
    const userId = req.user.userId;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required',
        code: 'MISSING_AMOUNT'
      });
    }

    const result = await paymentIntegrationService.createSessionPaymentIntent(userId, sessionId, amount, currency);

    res.json(result);
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      code: 'PAYMENT_INTENT_ERROR'
    });
  }
});

// Create subscription
router.post('/payments/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { priceId, sessionFrequency, therapistId } = req.body;
    const userId = req.user.userId;

    if (!priceId || !sessionFrequency || !therapistId) {
      return res.status(400).json({
        success: false,
        message: 'Price ID, session frequency, and therapist ID are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    const result = await paymentIntegrationService.createSubscription(userId, {
      priceId,
      sessionFrequency,
      therapistId
    });

    res.json(result);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      code: 'SUBSCRIPTION_ERROR'
    });
  }
});

// Get payment history
router.get('/payments/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50 } = req.query;

    const history = await paymentIntegrationService.getPaymentHistory(userId, limit);

    res.json({
      success: true,
      data: { history }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history',
      code: 'PAYMENT_HISTORY_ERROR'
    });
  }
});

// Cancel subscription
router.delete('/payments/subscriptions/:subscriptionId', authenticateToken, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;

    const result = await paymentIntegrationService.cancelSubscription(userId, subscriptionId);

    res.json(result);
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      code: 'SUBSCRIPTION_CANCEL_ERROR'
    });
  }
});

// Get subscription details
router.get('/payments/subscriptions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const subscription = await paymentIntegrationService.getSubscriptionDetails(userId);

    res.json({
      success: true,
      data: { subscription }
    });
  } catch (error) {
    console.error('Get subscription details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription details',
      code: 'SUBSCRIPTION_DETAILS_ERROR'
    });
  }
});

// Stripe webhook handler
router.post('/payments/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    await paymentIntegrationService.handleStripeWebhook(event);

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      code: 'WEBHOOK_ERROR'
    });
  }
});

// Video Conferencing Routes

// Create Zoom meeting
router.post('/video/sessions/:sessionId/zoom', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const therapistId = req.user.userId;

    const result = await videoConferencingService.createZoomMeeting(sessionId, therapistId);

    res.json(result);
  } catch (error) {
    console.error('Create Zoom meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Zoom meeting',
      code: 'ZOOM_MEETING_ERROR'
    });
  }
});

// Create Teams meeting
router.post('/video/sessions/:sessionId/teams', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const therapistId = req.user.userId;

    const result = await videoConferencingService.createTeamsMeeting(sessionId, therapistId);

    res.json(result);
  } catch (error) {
    console.error('Create Teams meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Teams meeting',
      code: 'TEAMS_MEETING_ERROR'
    });
  }
});

// Get session meeting details
router.get('/video/sessions/:sessionId/meeting', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const meeting = await videoConferencingService.getSessionMeeting(sessionId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
        code: 'MEETING_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: { meeting }
    });
  } catch (error) {
    console.error('Get session meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get meeting details',
      code: 'MEETING_DETAILS_ERROR'
    });
  }
});

// Update meeting
router.put('/video/sessions/:sessionId/meeting', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const meetingData = req.body;

    const result = await videoConferencingService.updateMeeting(sessionId, meetingData);

    res.json(result);
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update meeting',
      code: 'MEETING_UPDATE_ERROR'
    });
  }
});

// Delete meeting
router.delete('/video/sessions/:sessionId/meeting/:provider', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { sessionId, provider } = req.params;

    const result = await videoConferencingService.deleteMeeting(sessionId, provider);

    res.json(result);
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meeting',
      code: 'MEETING_DELETE_ERROR'
    });
  }
});

// Send meeting reminders
router.post('/video/sessions/:sessionId/reminders', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await videoConferencingService.sendMeetingReminders(sessionId);

    res.json(result);
  } catch (error) {
    console.error('Send meeting reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send meeting reminders',
      code: 'MEETING_REMINDERS_ERROR'
    });
  }
});

// Get meeting participants
router.get('/video/sessions/:sessionId/participants', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { sessionId } = req.params;

    const participants = await videoConferencingService.getMeetingParticipants(sessionId);

    res.json({
      success: true,
      data: { participants }
    });
  } catch (error) {
    console.error('Get meeting participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get meeting participants',
      code: 'MEETING_PARTICIPANTS_ERROR'
    });
  }
});

// Get meeting recording
router.get('/video/sessions/:sessionId/recording', authenticateToken, requireRole(['therapist', 'admin']), async (req, res) => {
  try {
    const { sessionId } = req.params;

    const recording = await videoConferencingService.getMeetingRecording(sessionId);

    res.json({
      success: true,
      data: { recording }
    });
  } catch (error) {
    console.error('Get meeting recording error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get meeting recording',
      code: 'MEETING_RECORDING_ERROR'
    });
  }
});

module.exports = router;
