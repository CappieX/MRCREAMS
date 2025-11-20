# API Marketplace Documentation

## Overview

The MR.CREAMS API Marketplace provides a comprehensive public API infrastructure for third-party developers and integrations. It includes API key management, rate limiting, webhook support, and comprehensive documentation.

## Features

### 1. API Key Management
- **Secure Key Generation**: Cryptographically secure API key generation
- **Permission-Based Access**: Granular permissions for different API endpoints
- **Rate Limiting**: Configurable rate limits per API key
- **Usage Tracking**: Comprehensive usage statistics and monitoring
- **Key Lifecycle Management**: Create, update, revoke, and monitor API keys

### 2. Public API Endpoints
- **Emotion Analysis**: AI-powered emotion detection and analysis
- **Analytics Access**: User analytics and behavioral insights
- **Conflict Analysis**: Conflict resolution and pattern recognition
- **User Management**: User profile and metadata access
- **Webhook Support**: Real-time event notifications

### 3. Security & Compliance
- **API Key Authentication**: Secure API key-based authentication
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Permission System**: Role-based access control for API endpoints
- **Audit Logging**: Comprehensive logging of all API usage
- **Data Privacy**: GDPR and HIPAA compliant data handling

## Getting Started

### 1. Create an Account
First, create an account on the MR.CREAMS platform to access the API marketplace.

### 2. Generate API Key
```http
POST /api/public/keys
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "keyName": "My Application",
  "permissions": ["emotions:analyze", "analytics:read"],
  "rateLimit": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "key_1234567890",
    "keyName": "My Application",
    "apiKey": "mrcreams_abc123def456...",
    "permissions": ["emotions:analyze", "analytics:read"],
    "rateLimit": 1000,
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### 3. Make API Requests
Include your API key in the request headers:

```http
GET /api/public/emotions/patterns/user123?timeRange=30d
X-API-Key: mrcreams_abc123def456...
X-API-Version: v1
```

## API Endpoints

### Base URL
```
https://api.mrcreams.com/api/public
```

### Authentication
All API requests require an API key in the `X-API-Key` header:

```http
X-API-Key: your_api_key_here
```

### API Versioning
Specify the API version using the `X-API-Version` header:

```http
X-API-Version: v1
```

## Emotion Analysis API

### Analyze Text for Emotions
```http
POST /api/public/emotions/analyze
```

**Required Permission:** `emotions:analyze`

**Request Body:**
```json
{
  "text": "I'm feeling really happy today!",
  "emotions": ["happy", "excited"],
  "context": "morning routine"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "primaryEmotion": "joy",
      "confidence": 0.95,
      "emotions": [
        {
          "emotion": "joy",
          "confidence": 0.95,
          "intensity": 8.5
        },
        {
          "emotion": "excitement",
          "confidence": 0.87,
          "intensity": 7.2
        }
      ],
      "insights": [
        "High positive energy detected",
        "Strong emotional expression"
      ]
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "apiVersion": "v1"
  }
}
```

### Get Emotion Patterns
```http
GET /api/public/emotions/patterns/:userId?timeRange=30d
```

**Required Permission:** `emotions:patterns`

**Parameters:**
- `userId`: User ID to get patterns for
- `timeRange`: Time range (`7d`, `30d`, `90d`, `1y`)

**Response:**
```json
{
  "success": true,
  "data": {
    "patterns": {
      "dailyTrends": [
        {
          "date": "2024-01-01",
          "avg_intensity": 7.5,
          "checkin_count": "3",
          "emotions": ["happy", "grateful"]
        }
      ],
      "emotionFrequency": [
        {
          "emotion": "happy",
          "frequency": "15",
          "avg_intensity": "7.8"
        }
      ],
      "weeklyPatterns": [
        {
          "day_of_week": "1",
          "avg_intensity": "7.2",
          "checkin_count": "5"
        }
      ],
      "totalCheckins": 45
    },
    "timeRange": "30d",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## Analytics API

### Get User Analytics
```http
GET /api/public/analytics/user/:userId?timeRange=30d
```

**Required Permission:** `analytics:read`

**Parameters:**
- `userId`: User ID to get analytics for
- `timeRange`: Time range for analysis

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "timeRange": "30d",
      "emotionTrends": {
        "totalCheckins": 45,
        "emotionFrequency": [
          {
            "emotion": "happy",
            "frequency": "15",
            "avg_intensity": "7.8"
          }
        ]
      },
      "conflictAnalytics": {
        "totalConflicts": 12,
        "resolutionRate": 75.0
      },
      "progressMetrics": {
        "progressScore": 78,
        "emotionStability": {
          "volatility": 1.2,
          "averageIntensity": 7.5
        }
      }
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## Conflict Analysis API

### Analyze Conflict
```http
POST /api/public/conflicts/analyze
```

**Required Permission:** `conflicts:analyze`

**Request Body:**
```json
{
  "title": "Communication Issue",
  "description": "Having trouble communicating with my partner about our finances",
  "category": "communication",
  "severity": "medium",
  "participants": ["partner", "family"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "primaryEmotion": "frustration",
      "confidence": 0.82,
      "emotions": [
        {
          "emotion": "frustration",
          "confidence": 0.82,
          "intensity": 6.5
        },
        {
          "emotion": "anxiety",
          "confidence": 0.71,
          "intensity": 5.8
        }
      ],
      "insights": [
        "Financial stress detected",
        "Communication barriers identified"
      ]
    },
    "recommendations": [
      "Consider structured communication approach",
      "Address underlying financial concerns"
    ],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## User Management API

### Get User Information
```http
GET /api/public/users/:userId
```

**Required Permission:** `users:read`

**Parameters:**
- `userId`: User ID to get information for

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "client",
      "createdAt": "2024-01-01T00:00:00Z",
      "metadata": {
        "dateOfBirth": "1990-01-01",
        "phoneNumber": "+1234567890",
        "preferredLanguage": "en",
        "timezone": "America/New_York"
      }
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## Webhook Management API

### Create Webhook
```http
POST /api/public/webhooks
```

**Required Permission:** `webhooks:create`

**Request Body:**
```json
{
  "url": "https://myapp.com/webhooks/mrcreams",
  "events": ["emotion.checkin", "conflict.resolved", "session.completed"],
  "secret": "your_webhook_secret"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "webhook": {
      "id": "webhook_1234567890",
      "url": "https://myapp.com/webhooks/mrcreams",
      "events": ["emotion.checkin", "conflict.resolved", "session.completed"],
      "createdAt": "2024-01-01T12:00:00Z"
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### Get Webhooks
```http
GET /api/public/webhooks
```

**Required Permission:** `webhooks:read`

**Response:**
```json
{
  "success": true,
  "data": {
    "webhooks": [
      {
        "id": "webhook_1234567890",
        "url": "https://myapp.com/webhooks/mrcreams",
        "events": ["emotion.checkin", "conflict.resolved"],
        "isActive": true,
        "createdAt": "2024-01-01T12:00:00Z",
        "lastTriggered": "2024-01-01T15:30:00Z"
      }
    ],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## API Key Management

### Create API Key
```http
POST /api/public/keys
```

**Request Body:**
```json
{
  "keyName": "My Application",
  "permissions": ["emotions:analyze", "analytics:read"],
  "rateLimit": 1000
}
```

### Get API Keys
```http
GET /api/public/keys
```

### Update API Key
```http
PUT /api/public/keys/:keyId
```

**Request Body:**
```json
{
  "keyName": "Updated Application Name",
  "permissions": ["emotions:analyze", "analytics:read", "conflicts:analyze"],
  "rateLimit": 2000,
  "isActive": true
}
```

### Revoke API Key
```http
DELETE /api/public/keys/:keyId
```

### Get API Usage Statistics
```http
GET /api/public/keys/:keyId/usage?timeRange=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timeRange": "30d",
    "totalRequests": 1250,
    "successfulRequests": 1180,
    "errorRequests": 70,
    "successRate": 94.4,
    "averageResponseTime": 145.5,
    "maxResponseTime": 2500,
    "minResponseTime": 45,
    "endpointStats": [
      {
        "endpoint": "/emotions/analyze",
        "method": "POST",
        "requestCount": 850,
        "averageResponseTime": 120.5,
        "errorCount": 25
      }
    ],
    "dailyStats": [
      {
        "date": "2024-01-01",
        "requestCount": 45,
        "averageResponseTime": 142.3
      }
    ]
  }
}
```

## Permissions System

### Available Permissions
- `emotions:analyze` - Analyze text for emotions
- `emotions:patterns` - Access emotion patterns
- `analytics:read` - Read analytics data
- `conflicts:analyze` - Analyze conflicts
- `users:read` - Read user information
- `webhooks:create` - Create webhooks
- `webhooks:read` - Read webhook information
- `webhooks:manage` - Manage webhooks
- `admin:*` - Full administrative access

### Permission Examples
```json
{
  "permissions": ["emotions:analyze", "analytics:read"]
}
```

```json
{
  "permissions": ["*"]
}
```

## Rate Limiting

### Default Rate Limits
- **General API**: 1000 requests per hour
- **Emotion Analysis**: 100 requests per hour
- **Analytics**: 200 requests per hour
- **Conflict Analysis**: 50 requests per hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 850
X-RateLimit-Reset: 2024-01-01T13:00:00Z
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 3600,
  "currentUsage": 1000,
  "rateLimit": 1000
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T12:00:00Z",
  "path": "/api/public/emotions/analyze",
  "method": "POST"
}
```

### Common Error Codes
- `MISSING_API_KEY` - API key is required
- `INVALID_API_KEY` - API key is invalid or expired
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded
- `INSUFFICIENT_PERMISSIONS` - Insufficient permissions
- `ACCESS_DENIED` - Access denied to requested resource
- `MISSING_INPUT` - Required input parameters missing
- `VALIDATION_ERROR` - Input validation failed
- `USER_NOT_FOUND` - User not found
- `ANALYSIS_ERROR` - Analysis failed
- `SERVICE_ERROR` - Internal service error

## Webhook Events

### Supported Events
- `emotion.checkin` - User completed emotion check-in
- `conflict.created` - New conflict was created
- `conflict.resolved` - Conflict was resolved
- `session.scheduled` - Therapy session was scheduled
- `session.completed` - Therapy session was completed
- `user.registered` - New user registered
- `user.updated` - User profile was updated

### Webhook Payload Example
```json
{
  "event": "emotion.checkin",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "userId": "user123",
    "emotions": ["happy", "grateful"],
    "intensity": 8,
    "notes": "Feeling great today!"
  }
}
```

### Webhook Security
Webhooks include a signature header for verification:

```http
X-Webhook-Signature: sha256=abc123def456...
```

## SDKs and Libraries

### JavaScript/Node.js
```javascript
const MRCREAMS = require('mrcreams-api');

const client = new MRCREAMS({
  apiKey: 'your_api_key_here',
  version: 'v1'
});

// Analyze emotions
const analysis = await client.emotions.analyze({
  text: "I'm feeling happy today!",
  emotions: ["happy", "excited"]
});

// Get analytics
const analytics = await client.analytics.getUser('user123', {
  timeRange: '30d'
});
```

### Python
```python
import mrcreams

client = mrcreams.Client(
    api_key='your_api_key_here',
    version='v1'
)

# Analyze emotions
analysis = client.emotions.analyze(
    text="I'm feeling happy today!",
    emotions=["happy", "excited"]
)

# Get analytics
analytics = client.analytics.get_user('user123', time_range='30d')
```

### cURL Examples
```bash
# Analyze emotions
curl -X POST https://api.mrcreams.com/api/public/emotions/analyze \
  -H "X-API-Key: your_api_key_here" \
  -H "X-API-Version: v1" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am feeling happy today!",
    "emotions": ["happy", "excited"]
  }'

# Get analytics
curl -X GET "https://api.mrcreams.com/api/public/analytics/user/user123?timeRange=30d" \
  -H "X-API-Key: your_api_key_here" \
  -H "X-API-Version: v1"
```

## Best Practices

### 1. API Key Security
- Store API keys securely (environment variables, secret management)
- Never expose API keys in client-side code
- Rotate API keys regularly
- Use least-privilege permissions

### 2. Rate Limiting
- Implement exponential backoff for rate limit errors
- Monitor rate limit headers
- Cache responses when appropriate
- Use webhooks for real-time updates

### 3. Error Handling
- Always check response status codes
- Implement retry logic for transient errors
- Log errors for debugging
- Handle rate limit errors gracefully

### 4. Data Privacy
- Only request necessary permissions
- Respect user privacy settings
- Implement data retention policies
- Follow GDPR and HIPAA guidelines

## Support and Resources

### Documentation
- API Reference: https://docs.mrcreams.com/api
- SDK Documentation: https://docs.mrcreams.com/sdk
- Webhook Guide: https://docs.mrcreams.com/webhooks

### Support
- Email: api-support@mrcreams.com
- Status Page: https://status.mrcreams.com
- Community Forum: https://community.mrcreams.com

### Status and Monitoring
- API Status: https://status.mrcreams.com/api
- Uptime Monitoring: 99.9% SLA
- Response Time: < 200ms (p95)
- Error Rate: < 0.1%
