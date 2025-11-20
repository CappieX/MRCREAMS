# Reporting Dashboard System Documentation

## Overview

The MR.CREAMS Reporting Dashboard System provides comprehensive reporting capabilities for executives, therapists, and clients. It includes automated report generation, scheduled reporting, and multiple export formats to support data-driven decision making.

## Features

### 1. Executive Dashboard Reports
- **User Metrics**: Total users, active users, retention rates, growth metrics
- **Platform Metrics**: Emotion check-ins, conflicts logged, therapy sessions
- **Therapist Metrics**: Active therapists, session completion rates, client satisfaction
- **Financial Metrics**: Revenue tracking, MRR, ARPU, churn analysis
- **System Metrics**: Uptime, performance, error rates

### 2. Therapist Performance Reports
- **Session Analytics**: Total sessions, completion rates, average duration
- **Client Metrics**: Total clients, active clients, client satisfaction
- **Performance Metrics**: Client progress, goal achievement, retention rates
- **Engagement Metrics**: Active days, session frequency, last activity

### 3. Client Progress Reports
- **Emotion Progress**: Emotional stability, intensity trends, pattern recognition
- **Conflict Resolution**: Resolution rates, average resolution time, category analysis
- **Session Attendance**: Attendance rates, session frequency, engagement
- **Goal Achievement**: Goal completion rates, progress tracking, milestones

### 4. Automated Reporting
- **Scheduled Reports**: Daily, weekly, monthly automated report generation
- **Email Delivery**: Automatic email delivery to specified recipients
- **Multiple Formats**: PDF, Excel, CSV, JSON export options
- **Customizable Templates**: Configurable report templates and layouts

## API Endpoints

### Base URL
```
https://api.mrcreams.com/api/reports
```

### Authentication
All endpoints require JWT authentication with appropriate role permissions.

## Report Generation Endpoints

### Generate Executive Report
```http
GET /api/reports/executive/:organizationId?timeRange=30d&format=pdf
```

**Required Role:** Admin

**Parameters:**
- `organizationId`: Organization ID for the report
- `timeRange`: Time range for analysis (`7d`, `30d`, `90d`, `1y`)
- `format`: Export format (`json`, `pdf`, `excel`, `csv`)

**Response (JSON format):**
```json
{
  "success": true,
  "data": {
    "reportType": "executive",
    "organizationId": "uuid",
    "timeRange": "30d",
    "generatedAt": "2024-01-01T12:00:00Z",
    "metrics": {
      "userMetrics": {
        "totalUsers": 1250,
        "activeUsers": 980,
        "newUsers": 150,
        "retentionRate": 85.5
      },
      "platformMetrics": {
        "totalEmotionCheckins": 5420,
        "totalConflicts": 320,
        "totalSessions": 1800,
        "averageSessionDuration": 55.5
      },
      "therapistMetrics": {
        "totalTherapists": 45,
        "activeTherapists": 38,
        "averageSessionsPerTherapist": 47.4,
        "clientSatisfaction": 4.6
      },
      "financialMetrics": {
        "totalRevenue": 125000,
        "monthlyRecurringRevenue": 45000,
        "averageRevenuePerUser": 100,
        "churnRate": 5.2,
        "customerLifetimeValue": 1200
      },
      "systemMetrics": {
        "uptime": 99.9,
        "averageResponseTime": 150,
        "errorRate": 0.1,
        "activeConnections": 250
      }
    },
    "insights": [
      {
        "type": "positive",
        "message": "High user retention rate of 85.5% indicates strong platform engagement",
        "impact": "high"
      }
    ],
    "recommendations": [
      {
        "priority": "medium",
        "action": "Provide additional training and support for therapists",
        "expectedImpact": "Increase therapist productivity and client satisfaction"
      }
    ]
  }
}
```

### Generate Therapist Report
```http
GET /api/reports/therapist/:therapistId?timeRange=30d&format=pdf
```

**Required Role:** Therapist, Admin

**Parameters:**
- `therapistId`: Therapist ID for the report
- `timeRange`: Time range for analysis
- `format`: Export format

**Response:**
```json
{
  "success": true,
  "data": {
    "reportType": "therapist",
    "therapistId": "uuid",
    "timeRange": "30d",
    "generatedAt": "2024-01-01T12:00:00Z",
    "metrics": {
      "sessionMetrics": {
        "totalSessions": 45,
        "completedSessions": 42,
        "cancelledSessions": 3,
        "completionRate": 93.3,
        "averageDuration": 58.5,
        "totalDuration": 2632.5
      },
      "clientMetrics": {
        "totalClients": 12,
        "activeClients": 10
      },
      "performanceMetrics": {
        "clientSatisfactionScore": 4.7,
        "averageClientProgress": 82,
        "goalAchievementRate": 85,
        "clientRetentionRate": 90
      },
      "engagementMetrics": {
        "activeDays": 28,
        "totalSessions": 45,
        "lastSession": "2024-01-01T10:00:00Z"
      }
    },
    "insights": [
      {
        "type": "positive",
        "message": "Excellent session completion rate of 93.3%",
        "impact": "high"
      }
    ],
    "recommendations": []
  }
}
```

### Generate Client Report
```http
GET /api/reports/client/:clientId?timeRange=30d&format=pdf
```

**Required Role:** Therapist, Admin (with client access)

**Parameters:**
- `clientId`: Client ID for the report
- `timeRange`: Time range for analysis
- `format`: Export format

### Generate My Reports
```http
GET /api/reports/my-therapist-report?timeRange=30d&format=pdf
GET /api/reports/my-client-report?timeRange=30d&format=pdf
```

**Required Role:** Therapist (for therapist report), Client (for client report)

## Report Management Endpoints

### Get Report Templates
```http
GET /api/reports/templates
```

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "executive-summary",
        "name": "Executive Summary",
        "description": "High-level overview of platform performance and key metrics",
        "roles": ["admin"],
        "timeRanges": ["7d", "30d", "90d", "1y"],
        "formats": ["json", "pdf", "excel", "csv"]
      },
      {
        "id": "therapist-performance",
        "name": "Therapist Performance Report",
        "description": "Detailed analysis of therapist performance and client outcomes",
        "roles": ["therapist", "admin"],
        "timeRanges": ["7d", "30d", "90d"],
        "formats": ["json", "pdf", "excel", "csv"]
      }
    ],
    "userRole": "therapist"
  }
}
```

### Schedule Automated Reports
```http
POST /api/reports/schedule
```

**Required Role:** Admin

**Request Body:**
```json
{
  "reportType": "executive-summary",
  "organizationId": "uuid",
  "frequency": "weekly",
  "recipients": ["admin@mrcreams.com", "ceo@mrcreams.com"],
  "format": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report schedule created successfully",
  "data": {
    "scheduleId": "schedule_1234567890_abc123",
    "reportType": "executive-summary",
    "frequency": "weekly",
    "nextRun": "2024-01-08T09:00:00Z"
  }
}
```

### Get Scheduled Reports
```http
GET /api/reports/schedules
```

**Required Role:** Admin

### Cancel Scheduled Report
```http
DELETE /api/reports/schedules/:scheduleId
```

**Required Role:** Admin

## Export Formats

### PDF Reports
- Professional formatted reports with charts and graphs
- Executive summary format with key metrics
- Detailed analysis sections
- Branded with MR.CREAMS styling

### Excel Reports
- Raw data with multiple worksheets
- Pivot tables for data analysis
- Charts and graphs embedded
- Filterable and sortable data

### CSV Reports
- Comma-separated values for data import
- Simple format for external analysis
- Includes all metrics and data points
- Compatible with most data analysis tools

### JSON Reports
- Structured data format
- Complete report data with metadata
- Machine-readable format
- API integration friendly

## Report Metrics

### Executive Dashboard Metrics

#### User Metrics
- **Total Users**: Count of all registered users
- **Active Users**: Users with activity in the last 7 days
- **New Users**: Users registered in the time period
- **Retention Rate**: Percentage of users who remain active

#### Platform Metrics
- **Emotion Check-ins**: Total emotion check-ins recorded
- **Conflicts Logged**: Total conflicts submitted
- **Therapy Sessions**: Total therapy sessions scheduled
- **Average Session Duration**: Mean session length in minutes

#### Therapist Metrics
- **Total Therapists**: Count of registered therapists
- **Active Therapists**: Therapists with sessions in the time period
- **Average Sessions per Therapist**: Mean sessions per therapist
- **Client Satisfaction**: Average client satisfaction score

#### Financial Metrics
- **Total Revenue**: Total revenue generated
- **Monthly Recurring Revenue**: Recurring monthly revenue
- **Average Revenue per User**: Mean revenue per user
- **Churn Rate**: Percentage of users who stopped using the platform
- **Customer Lifetime Value**: Average revenue per customer over their lifetime

### Therapist Performance Metrics

#### Session Metrics
- **Total Sessions**: Count of all scheduled sessions
- **Completed Sessions**: Count of completed sessions
- **Cancelled Sessions**: Count of cancelled sessions
- **Completion Rate**: Percentage of completed sessions
- **Average Duration**: Mean session duration
- **Total Duration**: Sum of all session durations

#### Client Metrics
- **Total Clients**: Count of unique clients
- **Active Clients**: Clients with recent sessions
- **Client Satisfaction Score**: Average satisfaction rating
- **Average Client Progress**: Mean progress score across clients
- **Goal Achievement Rate**: Percentage of goals achieved
- **Client Retention Rate**: Percentage of clients retained

### Client Progress Metrics

#### Emotion Progress
- **Progress Score**: Overall emotional progress score (0-100)
- **Emotional Stability**: Volatility in emotional intensity
- **Trend Analysis**: Direction of emotional improvement
- **Pattern Recognition**: Identified emotional patterns

#### Conflict Resolution
- **Resolution Rate**: Percentage of conflicts resolved
- **Average Resolution Time**: Mean time to resolve conflicts
- **Category Analysis**: Breakdown by conflict categories
- **Severity Trends**: Changes in conflict severity over time

#### Session Attendance
- **Attendance Rate**: Percentage of sessions attended
- **Total Sessions**: Count of scheduled sessions
- **Engagement Score**: Overall engagement level
- **Consistency**: Regularity of session attendance

## Security and Access Control

### Role-Based Access
- **Admin**: Full access to all reports and scheduling
- **Therapist**: Access to own reports and client reports
- **Client**: Access to own progress reports only

### Data Privacy
- All reports are encrypted in transit and at rest
- Access logs are maintained for audit purposes
- Personal data is anonymized in organization reports
- GDPR compliant data handling

### Audit Trail
- All report access is logged with timestamps
- User actions are tracked for compliance
- Report generation is monitored and logged
- Failed report generations are recorded

## Performance Considerations

### Caching Strategy
- Report data is cached for 15 minutes
- Template configurations are cached for 1 hour
- Scheduled reports use background processing
- Large reports are generated asynchronously

### Optimization
- Database queries are optimized with proper indexing
- Report generation uses connection pooling
- Background jobs handle scheduled reports
- File storage is optimized for different formats

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
- `INVALID_TIME_RANGE`: Invalid time range parameter
- `REPORT_GENERATION_FAILED`: Failed to generate report
- `EXPORT_FAILED`: Failed to export report
- `SCHEDULE_FAILED`: Failed to schedule report
- `TEMPLATE_NOT_FOUND`: Report template not found

## Usage Examples

### Frontend Integration
```javascript
// Generate executive report
const response = await fetch('/api/reports/executive/org123?timeRange=30d&format=pdf', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'executive-report.pdf';
  a.click();
}
```

### Scheduled Reports
```javascript
// Schedule weekly executive report
const scheduleResponse = await fetch('/api/reports/schedule', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    reportType: 'executive-summary',
    organizationId: 'org123',
    frequency: 'weekly',
    recipients: ['admin@mrcreams.com'],
    format: 'pdf'
  })
});
```

## Monitoring and Maintenance

### Health Checks
- Report generation service monitoring
- Scheduled job execution tracking
- File storage availability monitoring
- Email delivery success tracking

### Maintenance Tasks
- Daily report generation cleanup
- Weekly performance optimization
- Monthly template updates
- Quarterly report format reviews

## Support and Troubleshooting

### Common Issues
1. **Report Generation Fails**: Check database connectivity and permissions
2. **Scheduled Reports Not Sending**: Verify email configuration and job queue
3. **Export Format Issues**: Check file permissions and storage space
4. **Access Denied Errors**: Verify user roles and permissions

### Support Contacts
- Technical Support: reports-support@mrcreams.com
- Documentation: https://docs.mrcreams.com/reports
- Status Page: https://status.mrcreams.com
