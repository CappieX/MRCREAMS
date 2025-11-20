# Mobile API Documentation

## Overview

The MR.CREAMS Mobile API provides optimized endpoints for mobile applications, including push notification support, offline sync capabilities, and mobile-specific data structures.

## Base URL

```
https://api.mrcreams.com/api/mobile
```

## Authentication

All mobile API endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Mobile-Specific Features

### 1. Device Token Management

#### Register Device Token
```http
POST /api/mobile/notifications/register-token
```

**Request Body:**
```json
{
  "deviceToken": "fcm_device_token_here",
  "platform": "ios" // or "android"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device token registered successfully"
}
```

#### Unregister Device Token
```http
DELETE /api/mobile/notifications/unregister-token
```

**Request Body:**
```json
{
  "deviceToken": "fcm_device_token_here"
}
```

### 2. Mobile Authentication

#### Mobile Registration
```http
POST /api/mobile/auth/register-mobile
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "client", // or "therapist", "admin"
  "deviceToken": "fcm_device_token_here",
  "platform": "ios"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "client",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

#### Mobile Login
```http
POST /api/mobile/auth/login-mobile
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "deviceToken": "fcm_device_token_here",
  "platform": "ios"
}
```

### 3. Emotion Check-in (Mobile Optimized)

#### Submit Emotion Check-in
```http
POST /api/mobile/emotions/checkin-mobile
```

**Request Body:**
```json
{
  "emotions": ["happy", "grateful", "excited"],
  "intensity": 8,
  "notes": "Feeling great today!",
  "context": "morning routine"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emotion check-in recorded",
  "data": {
    "checkin": {
      "id": "uuid",
      "emotions": ["happy", "grateful", "excited"],
      "intensity": 8,
      "notes": "Feeling great today!",
      "context": "morning routine",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "analysis": {
      "primaryEmotion": "joy",
      "confidence": 0.95,
      "insights": ["High positive energy detected", "Gratitude patterns identified"]
    }
  }
}
```

### 4. Conflict Submission (Mobile Optimized)

#### Submit Conflict
```http
POST /api/mobile/conflicts/submit-mobile
```

**Request Body:**
```json
{
  "title": "Communication Issue",
  "description": "Having trouble communicating with my partner",
  "category": "communication",
  "severity": "medium",
  "participants": ["partner", "family"],
  "location": "home"
}
```

### 5. Therapist Mobile Features

#### Get Sessions (Mobile)
```http
GET /api/mobile/therapist/sessions-mobile?limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "title": "Weekly Session",
        "description": "Regular therapy session",
        "scheduledAt": "2024-01-01T10:00:00Z",
        "durationMinutes": 60,
        "status": "scheduled",
        "client": {
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com"
        }
      }
    ],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### 6. Mobile Profile Management

#### Get Mobile Profile
```http
GET /api/mobile/profile/mobile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "client",
      "createdAt": "2024-01-01T00:00:00Z",
      "metadata": {
        "dateOfBirth": "1990-01-01",
        "phoneNumber": "+1234567890",
        "preferredLanguage": "en",
        "timezone": "America/New_York",
        "notificationPreferences": {
          "pushEnabled": true,
          "emailEnabled": true,
          "reminderFrequency": "daily"
        },
        "privacySettings": {
          "dataSharing": false,
          "analyticsEnabled": true
        }
      }
    }
  }
}
```

### 7. Mobile Dashboard

#### Get Mobile Dashboard Data
```http
GET /api/mobile/dashboard/mobile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recentEmotions": [
      {
        "emotions": ["happy", "grateful"],
        "intensity": 8,
        "notes": "Great day!",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "recentConflicts": [
      {
        "id": "uuid",
        "title": "Communication Issue",
        "description": "Having trouble communicating",
        "category": "communication",
        "severity": "medium",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "emotionPatterns": [
      {
        "emotion": "happy",
        "frequency": 15,
        "averageIntensity": 7.5
      }
    ]
  }
}
```

## Push Notifications

### Notification Types

1. **Session Reminders**: Sent 15 minutes before therapy sessions
2. **Emotion Check-in Reminders**: Daily reminders to check in with emotions
3. **Conflict Resolution Updates**: When new insights are available
4. **General Notifications**: System updates and important announcements

### Notification Payload Structure

```json
{
  "notification": {
    "title": "Session Reminder",
    "body": "Your session starts in 15 minutes"
  },
  "data": {
    "type": "session_reminder",
    "sessionId": "uuid",
    "therapistId": "uuid",
    "clientId": "uuid"
  }
}
```

## Error Handling

All mobile API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

- `INVALID_CREDENTIALS`: Authentication failed
- `MISSING_FIELDS`: Required fields not provided
- `ACCESS_DENIED`: Insufficient permissions
- `USER_NOT_FOUND`: User does not exist
- `DEVICE_TOKEN_INVALID`: Invalid device token
- `NOTIFICATION_FAILED`: Push notification failed

## Rate Limiting

Mobile API endpoints have the following rate limits:
- Authentication endpoints: 5 requests per minute per IP
- General endpoints: 100 requests per 15 minutes per user
- Push notification endpoints: 10 requests per minute per user

## Offline Support

The mobile API supports offline functionality through:

1. **Offline Sync Queue**: Changes made offline are queued and synced when online
2. **Data Caching**: Critical data is cached locally for offline access
3. **Conflict Resolution**: Automatic conflict resolution when syncing offline changes

## Security Considerations

1. **JWT Token Expiration**: Access tokens expire in 15 minutes, refresh tokens in 7 days
2. **Device Token Validation**: Device tokens are validated and can be revoked
3. **Data Encryption**: All sensitive data is encrypted in transit and at rest
4. **Input Validation**: All inputs are validated and sanitized
5. **Rate Limiting**: Prevents abuse and ensures fair usage

## Testing

Use the following test credentials for development:

```json
{
  "email": "test@mrcreams.com",
  "password": "testpassword123",
  "userType": "client"
}
```

## Support

For mobile API support, contact:
- Email: mobile-support@mrcreams.com
- Documentation: https://docs.mrcreams.com/mobile-api
- Status Page: https://status.mrcreams.com
