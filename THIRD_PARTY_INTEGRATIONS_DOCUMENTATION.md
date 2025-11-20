# Third-Party Integrations Documentation

## Overview

The MR.CREAMS platform integrates with various third-party services to provide comprehensive functionality including calendar management, payment processing, and video conferencing. This documentation covers all available integrations and their implementation.

## Features

### 1. Calendar Integrations
- **Google Calendar**: Sync therapy sessions with Google Calendar
- **Microsoft Outlook**: Integrate with Outlook Calendar
- **Apple Calendar**: Support for Apple Calendar (future)
- **Event Management**: Create, update, and delete calendar events
- **Session Synchronization**: Automatic sync of therapy sessions

### 2. Payment Integrations
- **Stripe**: Secure payment processing for therapy sessions
- **Subscription Management**: Recurring payment support
- **Payment History**: Comprehensive payment tracking
- **Webhook Support**: Real-time payment notifications
- **Multiple Currencies**: Support for various currencies

### 3. Video Conferencing
- **Zoom**: Professional video conferencing for therapy sessions
- **Microsoft Teams**: Enterprise-grade video meetings
- **Meeting Management**: Create, update, and delete meetings
- **Recording Support**: Automatic session recording
- **Participant Tracking**: Monitor meeting attendance

## API Endpoints

### Base URL
```
https://api.mrcreams.com/api/integrations
```

### Authentication
All endpoints require JWT authentication with appropriate role permissions.

## Calendar Integration API

### Connect Google Calendar
```http
POST /api/integrations/calendar/google/connect
```

**Request Body:**
```json
{
  "authCode": "google_authorization_code"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Google Calendar connected successfully",
  "data": {
    "provider": "google",
    "connectedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Connect Outlook Calendar
```http
POST /api/integrations/calendar/outlook/connect
```

**Request Body:**
```json
{
  "authCode": "outlook_authorization_code"
}
```

### Create Calendar Event
```http
POST /api/integrations/calendar/events
```

**Request Body:**
```json
{
  "title": "Therapy Session",
  "description": "Regular therapy session with Dr. Smith",
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T11:00:00Z",
  "provider": "google"
}
```

### Sync Therapy Session
```http
POST /api/integrations/calendar/sessions/:sessionId/sync
```

**Request Body:**
```json
{
  "provider": "google"
}
```

### Get Calendar Integrations
```http
GET /api/integrations/calendar/integrations
```

**Response:**
```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "provider": "google",
        "connectedAt": "2024-01-01T12:00:00Z",
        "lastUpdated": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

### Disconnect Calendar
```http
DELETE /api/integrations/calendar/:provider/disconnect
```

## Payment Integration API

### Create Payment Intent
```http
POST /api/integrations/payments/sessions/:sessionId/intent
```

**Request Body:**
```json
{
  "amount": 150.00,
  "currency": "usd"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_1234567890_secret_abc123",
    "paymentIntentId": "pi_1234567890",
    "amount": 150.00,
    "currency": "usd"
  }
}
```

### Create Subscription
```http
POST /api/integrations/payments/subscriptions
```

**Request Body:**
```json
{
  "priceId": "price_1234567890",
  "sessionFrequency": "weekly",
  "therapistId": "therapist_uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_1234567890",
    "clientSecret": "seti_1234567890_secret_abc123",
    "status": "incomplete"
  }
}
```

### Get Payment History
```http
GET /api/integrations/payments/history?limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "eventType": "payment_succeeded",
        "amount": 150.00,
        "currency": "usd",
        "status": "succeeded",
        "metadata": {
          "paymentIntentId": "pi_1234567890",
          "sessionId": "session_uuid"
        },
        "createdAt": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

### Cancel Subscription
```http
DELETE /api/integrations/payments/subscriptions/:subscriptionId
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription will be canceled at the end of the current period",
  "data": {
    "subscriptionId": "sub_1234567890",
    "cancelAt": "2024-02-01T12:00:00Z"
  }
}
```

### Get Subscription Details
```http
GET /api/integrations/payments/subscriptions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "subscriptionId": "sub_1234567890",
      "status": "active",
      "priceId": "price_1234567890",
      "metadata": {
        "therapistId": "therapist_uuid",
        "sessionFrequency": "weekly"
      },
      "createdAt": "2024-01-01T12:00:00Z",
      "currentPeriodEnd": "2024-02-01T12:00:00Z",
      "cancelAtPeriodEnd": false
    }
  }
}
```

### Stripe Webhook Handler
```http
POST /api/integrations/payments/webhooks/stripe
```

**Headers:**
```
Stripe-Signature: t=1234567890,v1=signature_hash
Content-Type: application/json
```

## Video Conferencing API

### Create Zoom Meeting
```http
POST /api/integrations/video/sessions/:sessionId/zoom
```

**Required Role:** Therapist, Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "meetingId": "123456789",
    "joinUrl": "https://zoom.us/j/123456789",
    "password": "abc123",
    "startUrl": "https://zoom.us/s/123456789",
    "provider": "zoom"
  }
}
```

### Create Teams Meeting
```http
POST /api/integrations/video/sessions/:sessionId/teams
```

**Required Role:** Therapist, Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "meetingId": "teams_meeting_id",
    "joinUrl": "https://teams.microsoft.com/l/meetup-join/...",
    "password": null,
    "startUrl": "https://teams.microsoft.com/l/meetup-join/...",
    "provider": "teams"
  }
}
```

### Get Session Meeting Details
```http
GET /api/integrations/video/sessions/:sessionId/meeting
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meeting": {
      "meetingId": "123456789",
      "joinUrl": "https://zoom.us/j/123456789",
      "password": "abc123",
      "startUrl": "https://zoom.us/s/123456789",
      "provider": "zoom",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

### Update Meeting
```http
PUT /api/integrations/video/sessions/:sessionId/meeting
```

**Required Role:** Therapist, Admin

**Request Body:**
```json
{
  "provider": "zoom",
  "meetingId": "123456789",
  "joinUrl": "https://zoom.us/j/123456789",
  "password": "abc123",
  "startUrl": "https://zoom.us/s/123456789"
}
```

### Delete Meeting
```http
DELETE /api/integrations/video/sessions/:sessionId/meeting/:provider
```

**Required Role:** Therapist, Admin

### Send Meeting Reminders
```http
POST /api/integrations/video/sessions/:sessionId/reminders
```

**Required Role:** Therapist, Admin

**Response:**
```json
{
  "success": true,
  "message": "Meeting reminders sent successfully"
}
```

### Get Meeting Participants
```http
GET /api/integrations/video/sessions/:sessionId/participants
```

**Required Role:** Therapist, Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "participants": [
      {
        "id": "participant_id",
        "name": "John Doe",
        "email": "john@example.com",
        "joinTime": "2024-01-01T10:00:00Z",
        "leaveTime": "2024-01-01T11:00:00Z",
        "duration": 60
      }
    ]
  }
}
```

### Get Meeting Recording
```http
GET /api/integrations/video/sessions/:sessionId/recording
```

**Required Role:** Therapist, Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "recording": [
      {
        "id": "recording_id",
        "fileType": "mp4",
        "fileSize": 104857600,
        "playUrl": "https://zoom.us/rec/share/...",
        "downloadUrl": "https://zoom.us/rec/download/...",
        "recordingStart": "2024-01-01T10:00:00Z",
        "recordingEnd": "2024-01-01T11:00:00Z"
      }
    ]
  }
}
```

## Setup and Configuration

### 1. Google Calendar Integration

#### Prerequisites
- Google Cloud Console project
- Calendar API enabled
- OAuth 2.0 credentials

#### Setup Steps
1. Create a project in Google Cloud Console
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Configure redirect URIs
5. Add credentials to environment variables

#### Environment Variables
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### 2. Microsoft Outlook Integration

#### Prerequisites
- Azure Active Directory app registration
- Microsoft Graph API permissions
- OAuth 2.0 credentials

#### Setup Steps
1. Register an application in Azure AD
2. Configure API permissions for Microsoft Graph
3. Create client secret
4. Configure redirect URIs
5. Add credentials to environment variables

#### Environment Variables
```env
OUTLOOK_CLIENT_ID=your-outlook-client-id
OUTLOOK_CLIENT_SECRET=your-outlook-client-secret
OUTLOOK_REDIRECT_URI=http://localhost:3000/auth/outlook/callback
```

### 3. Stripe Payment Integration

#### Prerequisites
- Stripe account
- API keys
- Webhook endpoint configuration

#### Setup Steps
1. Create a Stripe account
2. Get API keys from dashboard
3. Configure webhook endpoints
4. Set up products and prices
5. Add credentials to environment variables

#### Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Zoom Video Conferencing

#### Prerequisites
- Zoom account with API access
- JWT or OAuth app credentials
- API permissions

#### Setup Steps
1. Create a Zoom account
2. Create a JWT or OAuth app
3. Configure app settings
4. Get API credentials
5. Add credentials to environment variables

#### Environment Variables
```env
ZOOM_CLIENT_ID=your-zoom-client-id
ZOOM_CLIENT_SECRET=your-zoom-client-secret
ZOOM_REDIRECT_URI=http://localhost:3000/auth/zoom/callback
```

### 5. Microsoft Teams Integration

#### Prerequisites
- Microsoft 365 account
- Microsoft Graph API access
- App registration

#### Setup Steps
1. Register an application in Azure AD
2. Configure Microsoft Graph permissions
3. Set up Teams meeting policies
4. Configure app settings
5. Add credentials to environment variables

#### Environment Variables
```env
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

## Security Considerations

### 1. API Key Management
- Store API keys securely in environment variables
- Use different keys for development and production
- Rotate keys regularly
- Monitor key usage

### 2. OAuth Implementation
- Use secure redirect URIs
- Implement PKCE for mobile apps
- Store tokens securely
- Implement token refresh logic

### 3. Webhook Security
- Verify webhook signatures
- Use HTTPS endpoints
- Implement idempotency
- Log all webhook events

### 4. Data Privacy
- Encrypt sensitive data
- Implement data retention policies
- Follow GDPR and HIPAA guidelines
- Audit data access

## Error Handling

### Common Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Error Codes
- `MISSING_AUTH_CODE` - Authorization code is required
- `CALENDAR_CONNECTION_ERROR` - Failed to connect calendar
- `CALENDAR_EVENT_ERROR` - Failed to create calendar event
- `SESSION_SYNC_ERROR` - Failed to sync therapy session
- `MISSING_AMOUNT` - Payment amount is required
- `PAYMENT_INTENT_ERROR` - Failed to create payment intent
- `SUBSCRIPTION_ERROR` - Failed to create subscription
- `ZOOM_MEETING_ERROR` - Failed to create Zoom meeting
- `TEAMS_MEETING_ERROR` - Failed to create Teams meeting
- `MEETING_NOT_FOUND` - Meeting not found
- `WEBHOOK_ERROR` - Webhook processing failed

## Rate Limits

### Calendar Integration
- Google Calendar: 1,000,000 requests per day
- Outlook Calendar: 10,000 requests per 10 minutes

### Payment Integration
- Stripe: 100 requests per second
- Webhook processing: 1,000 requests per minute

### Video Conferencing
- Zoom: 10,000 requests per day
- Teams: 10,000 requests per 10 minutes

## Monitoring and Logging

### Integration Logs
All integration activities are logged for monitoring and debugging:

```sql
SELECT * FROM integration_logs 
WHERE user_id = 'user_uuid' 
ORDER BY created_at DESC;
```

### Payment Logs
Payment events are tracked for audit purposes:

```sql
SELECT * FROM payment_logs 
WHERE user_id = 'user_uuid' 
ORDER BY created_at DESC;
```

### Webhook Logs
Webhook deliveries are logged for troubleshooting:

```sql
SELECT * FROM webhook_delivery_logs 
WHERE webhook_id = 'webhook_uuid' 
ORDER BY created_at DESC;
```

## Testing

### Unit Tests
```javascript
// Test calendar integration
describe('Calendar Integration', () => {
  it('should connect Google Calendar', async () => {
    const result = await calendarIntegrationService.connectGoogleCalendar(userId, authCode);
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests
```javascript
// Test payment processing
describe('Payment Integration', () => {
  it('should create payment intent', async () => {
    const result = await paymentIntegrationService.createSessionPaymentIntent(userId, sessionId, 150.00);
    expect(result.success).toBe(true);
    expect(result.data.clientSecret).toBeDefined();
  });
});
```

## Support and Troubleshooting

### Common Issues

#### Calendar Integration
1. **Token Expired**: Implement token refresh logic
2. **Permission Denied**: Check API permissions
3. **Rate Limit Exceeded**: Implement exponential backoff

#### Payment Integration
1. **Payment Failed**: Check card details and funds
2. **Webhook Not Received**: Verify endpoint URL and signature
3. **Subscription Issues**: Check subscription status and billing

#### Video Conferencing
1. **Meeting Creation Failed**: Check API credentials
2. **Recording Not Available**: Verify recording permissions
3. **Participant Issues**: Check meeting settings

### Support Contacts
- Technical Support: integrations-support@mrcreams.com
- Documentation: https://docs.mrcreams.com/integrations
- Status Page: https://status.mrcreams.com
