# Security Hardening Documentation

## Overview

The MR.CREAMS Security Hardening System provides comprehensive security measures including rate limiting, input validation, security headers, IP management, and security monitoring to ensure enterprise-grade security for the platform.

## Features

### 1. Rate Limiting
- **Multi-tier Rate Limiting**: Different limits for different endpoint types
- **IP-based Limiting**: Rate limiting per IP address
- **Endpoint-specific Limits**: Custom limits for sensitive endpoints
- **Authentication Rate Limiting**: Special limits for login attempts
- **API Rate Limiting**: Public API rate limiting with configurable limits

### 2. Input Validation & Sanitization
- **SQL Injection Prevention**: Advanced SQL injection detection
- **XSS Protection**: Cross-site scripting prevention
- **Input Sanitization**: Automatic input cleaning and sanitization
- **Payload Size Validation**: Request size limiting
- **File Upload Validation**: Secure file upload validation
- **Data Type Validation**: Strict data type validation

### 3. Security Headers
- **Content Security Policy**: Comprehensive CSP implementation
- **HTTP Strict Transport Security**: HSTS enforcement
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection
- **Referrer Policy**: Referrer information control
- **Permissions Policy**: Feature policy enforcement

### 4. IP Management
- **IP Whitelisting**: Allow specific IP addresses
- **IP Blacklisting**: Block malicious IP addresses
- **Automatic Blocking**: Auto-block based on security events
- **Temporary Blocking**: Time-based IP blocking
- **Permanent Blocking**: Permanent IP blacklisting

### 5. Security Monitoring
- **Real-time Monitoring**: Continuous security event monitoring
- **Attack Pattern Detection**: Automated attack pattern recognition
- **Security Event Logging**: Comprehensive security event logging
- **Alert System**: Real-time security alerts
- **Metrics Collection**: Security metrics and statistics

## API Endpoints

### Base URL
```
https://api.mrcreams.com/api/security
```

### Authentication
All endpoints require JWT authentication with admin or security role permissions.

## Security Monitoring API

### Get Security Events
```http
GET /api/security/events?limit=100&offset=0&eventType=sql_injection&severity=high
```

**Query Parameters:**
- `limit`: Number of events to return (default: 100)
- `offset`: Number of events to skip (default: 0)
- `eventType`: Filter by event type
- `severity`: Filter by severity level
- `startDate`: Filter by start date
- `endDate`: Filter by end date

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event_uuid",
        "eventType": "sql_injection",
        "details": {
          "pattern": "union select",
          "input": "hashed_input",
          "endpoint": "/api/users",
          "method": "POST"
        },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "userId": "user_uuid",
        "userEmail": "user@example.com",
        "userName": "John Doe",
        "endpoint": "/api/users",
        "method": "POST",
        "severity": "high",
        "resolved": false,
        "resolvedAt": null,
        "resolvedBy": null,
        "resolutionNotes": null,
        "createdAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "limit": 100,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### Get Security Alerts
```http
GET /api/security/alerts?limit=50&offset=0&severity=critical&acknowledged=false
```

**Response:**
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert_uuid",
        "alertType": "multiple_failed_logins",
        "severity": "critical",
        "title": "Multiple Failed Login Attempts",
        "description": "Detected 10 failed login attempts from IP 192.168.1.1",
        "details": {
          "ipAddress": "192.168.1.1",
          "attemptCount": 10,
          "timeWindow": "15 minutes"
        },
        "ipAddress": "192.168.1.1",
        "userId": null,
        "userEmail": null,
        "userName": null,
        "endpoint": "/api/auth/login",
        "method": "POST",
        "acknowledged": false,
        "acknowledgedAt": null,
        "acknowledgedBy": null,
        "acknowledgedByEmail": null,
        "acknowledgedByName": null,
        "resolved": false,
        "resolvedAt": null,
        "resolvedBy": null,
        "resolvedByEmail": null,
        "resolvedByName": null,
        "resolutionNotes": null,
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### Acknowledge Security Alert
```http
POST /api/security/alerts/:alertId/acknowledge
```

**Request Body:**
```json
{
  "notes": "Alert acknowledged by security team"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert acknowledged successfully",
  "data": {
    "alertId": "alert_uuid",
    "acknowledgedAt": "2024-01-01T12:00:00Z",
    "acknowledgedBy": "admin_uuid"
  }
}
```

### Resolve Security Alert
```http
POST /api/security/alerts/:alertId/resolve
```

**Request Body:**
```json
{
  "resolutionNotes": "IP address blocked and user notified"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert resolved successfully",
  "data": {
    "alertId": "alert_uuid",
    "resolvedAt": "2024-01-01T12:00:00Z",
    "resolvedBy": "admin_uuid",
    "resolutionNotes": "IP address blocked and user notified"
  }
}
```

## IP Management API

### Get IP Blacklist
```http
GET /api/security/ip-blacklist?limit=100&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "blacklistedIPs": [
      {
        "id": "blacklist_uuid",
        "ipAddress": "192.168.1.1",
        "reason": "Multiple failed login attempts",
        "blockedUntil": "2024-01-02T12:00:00Z",
        "isPermanent": false,
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "limit": 100,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### Block IP Address
```http
POST /api/security/ip-blacklist
```

**Request Body:**
```json
{
  "ipAddress": "192.168.1.1",
  "reason": "Security violation",
  "durationHours": 24,
  "permanent": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "IP address blocked successfully",
  "data": {
    "ipAddress": "192.168.1.1",
    "reason": "Security violation",
    "durationHours": 24,
    "permanent": false,
    "blockedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Unblock IP Address
```http
DELETE /api/security/ip-blacklist/:ipAddress
```

**Response:**
```json
{
  "success": true,
  "message": "IP address unblocked successfully",
  "data": {
    "ipAddress": "192.168.1.1",
    "unblockedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Check IP Blocked Status
```http
GET /api/security/check-ip/:ipAddress
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ipAddress": "192.168.1.1",
    "isBlocked": true,
    "checkedAt": "2024-01-01T12:00:00Z"
  }
}
```

## Security Metrics API

### Get Security Metrics
```http
GET /api/security/metrics?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "metricName": "total_security_events",
        "metricValue": 150,
        "metricDate": "2024-01-01"
      },
      {
        "metricName": "failed_login_attempts",
        "metricValue": 25,
        "metricDate": "2024-01-01"
      }
    ],
    "dateRange": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "generatedAt": "2024-01-01T12:00:00Z"
  }
}
```

### Generate Security Report
```http
GET /api/security/report?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report": [
      {
        "reportSection": "security_events",
        "metricName": "sql_injection",
        "metricValue": 5,
        "severity": "high"
      },
      {
        "reportSection": "failed_logins",
        "metricName": "total_attempts",
        "metricValue": 25,
        "severity": "medium"
      }
    ],
    "dateRange": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "generatedAt": "2024-01-01T12:00:00Z"
  }
}
```

## Security Features

### 1. Rate Limiting Implementation

#### Default Rate Limiter
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Scope**: All API endpoints
- **Headers**: Standard rate limit headers

#### Authentication Rate Limiter
- **Window**: 15 minutes
- **Limit**: 5 login attempts per IP
- **Scope**: Authentication endpoints
- **Skip Successful**: Yes

#### API Rate Limiter
- **Window**: 1 hour
- **Limit**: 1000 requests per IP
- **Scope**: Public API endpoints
- **Skip Successful**: No

#### Strict Rate Limiter
- **Window**: 15 minutes
- **Limit**: 5 requests per IP
- **Scope**: Sensitive endpoints
- **Skip Successful**: No

### 2. Input Validation Features

#### SQL Injection Prevention
- **Pattern Detection**: Advanced SQL injection pattern recognition
- **Parameterized Queries**: All database queries use parameters
- **Input Sanitization**: Automatic input cleaning
- **Logging**: All attempts are logged

#### XSS Protection
- **Script Tag Removal**: Remove script tags from input
- **Event Handler Removal**: Remove event handlers
- **Protocol Filtering**: Filter dangerous protocols
- **Content Sanitization**: Clean HTML content

#### Data Validation
- **Email Validation**: Strict email format validation
- **Password Strength**: Comprehensive password requirements
- **UUID Validation**: UUID format validation
- **File Upload Validation**: Secure file upload checks

### 3. Security Headers Configuration

#### Content Security Policy
```javascript
{
  defaultSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  scriptSrc: ["'self'"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "https:"],
  connectSrc: ["'self'"],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  upgradeInsecureRequests: []
}
```

#### HTTP Strict Transport Security
- **Max Age**: 1 year
- **Include Subdomains**: Yes
- **Preload**: Yes

#### Additional Headers
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restrictive permissions

### 4. IP Management Features

#### IP Whitelisting
- **Development IPs**: Localhost addresses
- **Production IPs**: Trusted IP ranges
- **CIDR Support**: Network range support
- **Dynamic Updates**: Runtime IP management

#### IP Blacklisting
- **Automatic Blocking**: Based on security events
- **Manual Blocking**: Admin-initiated blocking
- **Temporary Blocking**: Time-based blocks
- **Permanent Blocking**: Permanent blacklisting

#### Blocking Triggers
- **Failed Logins**: Multiple failed login attempts
- **Rate Limit Violations**: Excessive request rates
- **Attack Patterns**: Detected attack patterns
- **Manual Override**: Admin-initiated blocks

### 5. Security Monitoring Features

#### Real-time Monitoring
- **Event Detection**: Continuous security event monitoring
- **Pattern Recognition**: Automated attack pattern detection
- **Anomaly Detection**: Unusual behavior detection
- **Alert Generation**: Real-time security alerts

#### Security Event Types
- **SQL Injection**: SQL injection attempts
- **XSS Attacks**: Cross-site scripting attempts
- **Rate Limit Violations**: Rate limit exceedances
- **Failed Logins**: Authentication failures
- **Suspicious Patterns**: General suspicious activity

#### Alert Severity Levels
- **Low**: Minor security events
- **Medium**: Moderate security concerns
- **High**: Significant security threats
- **Critical**: Immediate security threats

## Security Policies

### 1. Password Policy
- **Minimum Length**: 8 characters
- **Uppercase Required**: At least one uppercase letter
- **Lowercase Required**: At least one lowercase letter
- **Numbers Required**: At least one number
- **Special Characters**: At least one special character
- **Common Passwords**: Block common passwords

### 2. Session Policy
- **Maximum Age**: 24 hours
- **Regeneration Interval**: 5 minutes
- **Secure Flag**: HTTPS only
- **HttpOnly Flag**: No JavaScript access
- **SameSite**: Strict

### 3. CORS Policy
- **Allowed Origins**: Configured origins only
- **Allowed Methods**: GET, POST, PUT, DELETE
- **Allowed Headers**: Content-Type, Authorization
- **Credentials**: Supported
- **Max Age**: 1 hour

### 4. Rate Limiting Policy
- **Default Limit**: 100 requests per 15 minutes
- **Auth Limit**: 5 requests per 15 minutes
- **API Limit**: 1000 requests per hour
- **Strict Limit**: 5 requests per 15 minutes
- **Burst Allowance**: Temporary burst handling

## Security Monitoring

### 1. Event Logging
- **Comprehensive Logging**: All security events logged
- **Structured Logging**: JSON-formatted logs
- **Log Retention**: Configurable retention period
- **Log Analysis**: Automated log analysis

### 2. Metrics Collection
- **Event Counts**: Security event statistics
- **Attack Patterns**: Attack pattern analysis
- **Performance Metrics**: Security performance data
- **Trend Analysis**: Security trend analysis

### 3. Alerting System
- **Real-time Alerts**: Immediate security notifications
- **Escalation Procedures**: Alert escalation workflows
- **Notification Channels**: Multiple notification methods
- **Alert Management**: Alert acknowledgment and resolution

### 4. Reporting
- **Security Reports**: Comprehensive security reports
- **Compliance Reports**: Security compliance reports
- **Trend Reports**: Security trend analysis
- **Executive Summaries**: High-level security summaries

## Security Testing

### 1. Penetration Testing
- **Regular Testing**: Scheduled penetration tests
- **Vulnerability Scanning**: Automated vulnerability scans
- **Code Review**: Security code review
- **Dependency Scanning**: Third-party dependency scanning

### 2. Security Audits
- **Internal Audits**: Regular internal security audits
- **External Audits**: Third-party security audits
- **Compliance Audits**: Regulatory compliance audits
- **Risk Assessments**: Security risk assessments

### 3. Performance Testing
- **Load Testing**: Security under load
- **Stress Testing**: Security under stress
- **Endurance Testing**: Long-term security testing
- **Spike Testing**: Sudden load spike testing

## Security Best Practices

### 1. Implementation Best Practices
- **Defense in Depth**: Multiple security layers
- **Least Privilege**: Minimum necessary permissions
- **Fail Secure**: Secure failure modes
- **Security by Design**: Security-first design

### 2. Operational Best Practices
- **Regular Updates**: Keep security systems updated
- **Monitoring**: Continuous security monitoring
- **Incident Response**: Rapid incident response
- **Training**: Regular security training

### 3. Development Best Practices
- **Secure Coding**: Security-focused development
- **Code Review**: Security code review
- **Testing**: Comprehensive security testing
- **Documentation**: Security documentation

## Troubleshooting

### Common Issues

#### Rate Limiting Issues
1. **Too Many Requests**: Check rate limit configuration
2. **False Positives**: Adjust rate limit thresholds
3. **Performance Impact**: Optimize rate limiting
4. **Bypass Attempts**: Monitor for bypass attempts

#### Input Validation Issues
1. **False Positives**: Adjust validation rules
2. **Performance Impact**: Optimize validation
3. **Legitimate Requests Blocked**: Review validation logic
4. **Bypass Attempts**: Monitor for bypass attempts

#### IP Blocking Issues
1. **Legitimate Users Blocked**: Review IP blocking rules
2. **False Positives**: Adjust blocking criteria
3. **Performance Impact**: Optimize IP checking
4. **Bypass Attempts**: Monitor for bypass attempts

### Support Procedures

#### Issue Reporting
1. **Document Issue**: Record problem details
2. **Check Logs**: Review security logs
3. **Verify Configuration**: Check security configuration
4. **Contact Support**: Escalate to security team
5. **Follow Up**: Monitor resolution progress

#### Resolution Process
1. **Issue Analysis**: Analyze the security issue
2. **Root Cause**: Identify root cause
3. **Solution Design**: Design security solution
4. **Implementation**: Implement security fix
5. **Testing**: Test security fix
6. **Deployment**: Deploy security fix
7. **Verification**: Verify security fix
8. **Documentation**: Document security fix
