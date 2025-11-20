# MR.CREAMS Authentication System

## Overview

The MR.CREAMS authentication system provides comprehensive security features including JWT-based authentication, role-based access control, email verification, password reset, and multi-factor authentication support.

## Features

### Core Authentication
- **JWT Token Authentication**: Secure token-based authentication with configurable expiration
- **Refresh Token Support**: Automatic token refresh to maintain user sessions
- **Password Security**: Strong password requirements with bcrypt hashing
- **Session Management**: Track and manage user sessions across devices

### Email Verification
- **Email Verification**: Required for all non-admin users
- **Verification Tokens**: Secure token-based email verification
- **Resend Verification**: Users can request new verification emails
- **Welcome Emails**: Automated welcome emails for new users

### Password Management
- **Password Reset**: Secure password reset via email
- **Password Strength Validation**: Enforced strong password requirements
- **Password History**: Prevent password reuse (future enhancement)

### Security Features
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: Comprehensive logging of authentication events
- **Session Revocation**: Logout from all devices capability
- **MFA Support**: Multi-factor authentication infrastructure (ready for implementation)

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "userType": "individual",
  "metadata": {
    "relationshipStatus": "Married",
    "age": "35"
  },
  "organizationCode": "DEMO"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "individual",
    "organizationId": "uuid",
    "onboardingCompleted": false,
    "emailVerified": false
  }
}
```

#### POST `/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "individual",
    "organizationId": "uuid",
    "organizationName": "Demo Company",
    "organizationCode": "DEMO",
    "onboardingCompleted": true,
    "emailVerified": true
  },
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

#### POST `/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

#### POST `/logout`
Logout user and revoke current session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### POST `/logout-all`
Logout user from all devices.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logged out from all devices"
}
```

### Email Verification

#### POST `/verify-email`
Verify email address using verification token.

**Request Body:**
```json
{
  "token": "verification_token"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": true
  }
}
```

#### POST `/resend-verification`
Resend email verification.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent successfully"
}
```

### Password Reset

#### POST `/forgot-password`
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent"
}
```

#### POST `/reset-password`
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

### User Profile

#### GET `/me`
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "individual",
    "organizationId": "uuid",
    "organizationName": "Demo Company",
    "organizationCode": "DEMO",
    "onboardingCompleted": true,
    "emailVerified": true,
    "isAdmin": false,
    "isSuperAdmin": false,
    "isTherapist": false,
    "isSupport": false,
    "metadata": {
      "relationshipStatus": "Married",
      "age": "35"
    }
  }
}
```

#### PUT `/profile`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1234567890",
  "timezone": "America/New_York",
  "language": "en",
  "preferences": {
    "notifications": true,
    "theme": "light"
  }
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Smith",
    "phone": "+1234567890",
    "timezone": "America/New_York",
    "language": "en",
    "preferences": {
      "notifications": true,
      "theme": "light"
    },
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

## Authentication Middleware

### `authenticateToken`
Verifies JWT token and attaches user information to request.

```javascript
const { authenticateToken } = require('./middleware/auth');

app.get('/protected', authenticateToken, (req, res) => {
  // req.user contains user information
  res.json({ user: req.user });
});
```

### `requireRole`
Ensures user has required role(s).

```javascript
const { requireRole } = require('./middleware/auth');

// Single role
app.get('/admin-only', requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Multiple roles
app.get('/therapist-or-admin', requireRole(['therapist', 'admin']), (req, res) => {
  res.json({ message: 'Access granted' });
});
```

### `requireOwnership`
Ensures user can only access their own resources.

```javascript
const { requireOwnership } = require('./middleware/auth');

app.get('/users/:userId/profile', requireOwnership('userId'), (req, res) => {
  // Only the user themselves can access their profile
  res.json({ profile: req.params.userId });
});
```

### `requireEmailVerification`
Ensures user's email is verified.

```javascript
const { requireEmailVerification } = require('./middleware/auth');

app.post('/sensitive-action', requireEmailVerification, (req, res) => {
  res.json({ message: 'Action completed' });
});
```

## User Types and Roles

### User Types
- `individual` - Regular users/couples
- `therapist` - Licensed therapists
- `admin` - Organization administrators
- `it_admin` - IT administrators
- `support` - Support agents
- `executive` - Executive users
- `super_admin` - Platform super administrators

### Role Hierarchy
1. `super_admin` - Full platform access
2. `admin` - Organization-level access
3. `it_admin` - Technical administration
4. `executive` - Executive dashboard access
5. `therapist` - Client management access
6. `support` - Support ticket access
7. `individual` - Basic user access

## Security Considerations

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Strength scoring (0-100)

### Token Security
- JWT tokens expire in 24 hours (configurable)
- Refresh tokens expire in 7 days (configurable)
- Tokens include JTI (JWT ID) for tracking
- Session tokens are stored in database

### Rate Limiting
- Login attempts: 5 per 15 minutes per IP
- Password reset: 3 per hour per email
- Email verification: 3 per hour per email
- General API: 100 requests per 15 minutes per IP

### Audit Logging
All authentication events are logged including:
- Login attempts (successful and failed)
- Password changes
- Email verification
- Profile updates
- Session management

## Email Templates

The system includes professionally designed email templates for:
- Email verification
- Password reset
- Welcome emails
- MFA setup (future)
- Support notifications

## Environment Configuration

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Password Security
BCRYPT_ROUNDS=12

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@mrcreams.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Error Codes

| Code | Description |
|------|-------------|
| `MISSING_TOKEN` | Authorization token is required |
| `INVALID_TOKEN` | Token is invalid or malformed |
| `TOKEN_EXPIRED` | Token has expired |
| `INVALID_TOKEN_TYPE` | Token type is incorrect |
| `USER_NOT_FOUND` | User does not exist or is inactive |
| `EMAIL_NOT_VERIFIED` | Email verification is required |
| `INVALID_CREDENTIALS` | Login credentials are incorrect |
| `USER_EXISTS` | User with email already exists |
| `WEAK_PASSWORD` | Password does not meet requirements |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `ORGANIZATION_ACCESS_DENIED` | Access denied to organization |
| `RESOURCE_ACCESS_DENIED` | Access denied to resource |

## Future Enhancements

- **Multi-Factor Authentication (MFA)**: TOTP-based 2FA
- **Social Login**: Google, Facebook, Apple integration
- **Password History**: Prevent password reuse
- **Account Lockout**: Temporary account lockout after failed attempts
- **Device Management**: Track and manage trusted devices
- **Biometric Authentication**: Fingerprint/Face ID support
