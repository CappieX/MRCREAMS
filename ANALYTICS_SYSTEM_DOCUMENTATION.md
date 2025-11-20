# Analytics System Documentation

## Overview

The MR.CREAMS Analytics System provides comprehensive data analysis and insights for users, therapists, and administrators. It replaces mock data with real database-driven analytics that track emotional patterns, conflict resolution, progress metrics, and behavioral insights.

## Features

### 1. User Analytics
- **Emotion Trends**: Track emotional patterns over time with daily, weekly, and monthly views
- **Conflict Analytics**: Analyze conflict frequency, categories, and resolution patterns
- **Progress Metrics**: Calculate progress scores based on emotional stability, conflict resolution, and engagement
- **Behavioral Insights**: Identify triggers, patterns, and recommendations for personal growth

### 2. Therapist Analytics
- **Session Analytics**: Track session frequency, duration, and completion rates
- **Client Metrics**: Monitor client progress and engagement
- **Performance Insights**: Analyze therapist effectiveness and client outcomes

### 3. Organization Analytics (Admin)
- **User Metrics**: Track user growth, activity, and engagement across the platform
- **System-wide Insights**: Analyze platform usage patterns and effectiveness
- **Therapist Performance**: Monitor therapist activity and client satisfaction

## API Endpoints

### Base URL
```
https://api.mrcreams.com/api/analytics
```

### Authentication
All endpoints require JWT authentication with appropriate role permissions.

## User Analytics Endpoints

### Get User Analytics
```http
GET /api/analytics/user/:userId?timeRange=30d
```

**Parameters:**
- `userId`: User ID to get analytics for
- `timeRange`: Time range for analysis (`7d`, `30d`, `90d`, `1y`)

**Response:**
```json
{
  "success": true,
  "data": {
    "timeRange": "30d",
    "emotionTrends": {
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
          "avg_intensity": "7.8",
          "max_intensity": "10",
          "min_intensity": "5"
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
    "conflictAnalytics": {
      "conflictTrends": [
        {
          "date": "2024-01-01",
          "conflict_count": "2",
          "avg_severity_score": "2.5"
        }
      ],
      "categoryBreakdown": [
        {
          "category": "communication",
          "count": "8",
          "avg_severity": "2.3"
        }
      ],
      "resolutionPatterns": [
        {
          "category": "communication",
          "severity": "medium",
          "total_conflicts": "5",
          "resolved_conflicts": "4",
          "avg_resolution_days": "3.2"
        }
      ],
      "totalConflicts": 12
    },
    "progressMetrics": {
      "emotionStability": {
        "volatility": 1.2,
        "averageIntensity": 7.5,
        "totalCheckins": 45
      },
      "conflictResolution": {
        "totalConflicts": 12,
        "resolvedConflicts": 8,
        "resolutionRate": 66.7,
        "averageResolutionDays": 2.8
      },
      "engagement": {
        "activeDays": 25,
        "totalActivities": 57,
        "emotionCheckins": 45,
        "conflictsLogged": 12
      },
      "progressScore": 78
    },
    "behavioralInsights": {
      "emotionPatterns": [
        {
          "emotion": "happy",
          "frequency": "15",
          "avg_intensity": "7.8",
          "morning_count": "5",
          "afternoon_count": "7",
          "evening_count": "3"
        }
      ],
      "triggerPatterns": [
        {
          "context": "work stress",
          "frequency": "8",
          "associated_emotions": ["anxious", "frustrated"],
          "avg_intensity": "6.5"
        }
      ],
      "conflictTriggers": [
        {
          "category": "communication",
          "frequency": "8",
          "avg_severity": "2.3"
        }
      ],
      "insights": [
        {
          "type": "emotion",
          "message": "Your most frequent emotion is happy (15 times)",
          "recommendation": "Consider exploring what triggers happy and how to maintain it effectively."
        }
      ]
    },
    "generatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Get Current User Analytics
```http
GET /api/analytics/my-analytics?timeRange=30d
```

### Get Dashboard Summary
```http
GET /api/analytics/dashboard/summary?timeRange=30d
```

## Therapist Analytics Endpoints

### Get Session Analytics
```http
GET /api/analytics/sessions/analytics?timeRange=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionTrends": [
      {
        "date": "2024-01-01",
        "session_count": "3",
        "avg_duration": "60.0",
        "completed_sessions": "3"
      }
    ],
    "clientMetrics": [
      {
        "client_id": "uuid",
        "first_name": "Jane",
        "last_name": "Smith",
        "total_sessions": "8",
        "completed_sessions": "7",
        "avg_duration": "55.0",
        "last_session": "2024-01-01T10:00:00Z"
      }
    ],
    "totalSessions": 24
  }
}
```

## Organization Analytics Endpoints

### Get Organization Analytics
```http
GET /api/analytics/organization/:organizationId?timeRange=30d
```

**Required Role:** Admin

## Export Analytics

### Export User Analytics
```http
GET /api/analytics/export/:userId?timeRange=30d&format=json
```

**Parameters:**
- `format`: Export format (`json` or `csv`)

## Analytics Metrics

### Progress Score Calculation
The progress score (0-100) is calculated based on:

1. **Emotion Stability (30% weight)**
   - Based on intensity volatility
   - Lower volatility = higher score

2. **Conflict Resolution (40% weight)**
   - Based on resolution rate
   - Higher resolution rate = higher score

3. **Engagement (30% weight)**
   - Based on active days
   - More active days = higher score

### Emotion Analysis
- **Intensity Tracking**: Monitor emotional intensity over time
- **Pattern Recognition**: Identify recurring emotional patterns
- **Trigger Analysis**: Connect emotions to specific contexts and situations
- **Temporal Patterns**: Analyze emotions by time of day and day of week

### Conflict Analysis
- **Category Breakdown**: Analyze conflicts by category (communication, work, family, etc.)
- **Severity Tracking**: Monitor conflict severity levels
- **Resolution Patterns**: Track resolution times and success rates
- **Trend Analysis**: Identify conflict frequency trends over time

### Behavioral Insights
- **Trigger Identification**: Identify common emotional triggers
- **Pattern Recognition**: Recognize behavioral patterns and cycles
- **Recommendation Engine**: Generate personalized recommendations
- **Progress Tracking**: Monitor improvement over time

## Data Privacy and Security

### Data Protection
- All analytics data is encrypted in transit and at rest
- User data is anonymized in organization-level analytics
- Access controls ensure users can only view their own data
- Admin access is logged and audited

### Compliance
- HIPAA compliant data handling
- GDPR compliant data processing
- User consent required for data analysis
- Right to data export and deletion

## Performance Considerations

### Caching
- Analytics data is cached for 15 minutes to improve performance
- Real-time data is available for recent activities
- Historical data is pre-computed for common time ranges

### Optimization
- Database queries are optimized with proper indexing
- Pagination is implemented for large datasets
- Background processing for complex analytics

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
- `ACCESS_DENIED`: Insufficient permissions
- `USER_NOT_FOUND`: User does not exist
- `INVALID_TIME_RANGE`: Invalid time range parameter
- `ANALYTICS_FAILED`: Failed to generate analytics
- `EXPORT_FAILED`: Failed to export data

## Usage Examples

### Frontend Integration
```javascript
// Get user analytics
const response = await fetch('/api/analytics/my-analytics?timeRange=30d', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const analytics = await response.json();

// Display emotion trends
analytics.data.emotionTrends.dailyTrends.forEach(trend => {
  console.log(`Date: ${trend.date}, Intensity: ${trend.avg_intensity}`);
});

// Show progress score
console.log(`Progress Score: ${analytics.data.progressMetrics.progressScore}%`);
```

### Mobile App Integration
```javascript
// Get dashboard summary for mobile
const response = await fetch('/api/analytics/dashboard/summary', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const summary = await response.json();

// Display key metrics
const metrics = summary.data;
console.log(`Emotion Check-ins: ${metrics.emotionTrends.totalCheckins}`);
console.log(`Conflicts Resolved: ${metrics.conflictAnalytics.resolutionRate}%`);
console.log(`Progress Score: ${metrics.progressMetrics.progressScore}%`);
```

## Monitoring and Maintenance

### Health Checks
- Analytics service health monitoring
- Database query performance tracking
- Cache hit rate monitoring
- Error rate tracking

### Maintenance Tasks
- Daily analytics data aggregation
- Weekly performance optimization
- Monthly data cleanup and archiving
- Quarterly analytics model updates

## Support and Troubleshooting

### Common Issues
1. **Slow Analytics Loading**: Check database performance and cache status
2. **Missing Data**: Verify data collection and user permissions
3. **Export Failures**: Check file permissions and storage availability

### Support Contacts
- Technical Support: analytics-support@mrcreams.com
- Documentation: https://docs.mrcreams.com/analytics
- Status Page: https://status.mrcreams.com
