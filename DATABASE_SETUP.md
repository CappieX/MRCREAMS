# MR.CREAMS Database Setup Guide

## PostgreSQL Setup

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database and User

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database
CREATE DATABASE mr_creams_db;

# Create user (optional, can use default postgres user)
CREATE USER mrcreams_user WITH PASSWORD 'Admin@123';
GRANT ALL PRIVILEGES ON DATABASE mr_creams_db TO mrcreams_user;

# Exit psql
\q
```

### 3. Environment Configuration

Copy the example environment file:
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your database credentials:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mr_creams_db
DB_PASSWORD=Admin@123
DB_PORT=5432
```

### 4. Run Database Migrations

```bash
cd backend
npm install
npm run setup:db
```

This will:
1. Run all database migrations to create tables and schema
2. Migrate existing SQLite data to PostgreSQL (if SQLite database exists)
3. Seed initial data for development

### 5. Verify Setup

Test the database connection:
```bash
npm run dev
```

Check the health endpoint:
```bash
curl http://localhost:6000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "database": "connected",
  "version": "1.0.0"
}
```

## Database Schema Overview

The PostgreSQL database includes the following main tables:

### Core Tables
- `organizations` - Multi-tenant organization support
- `users` - All user types (individual, therapist, admin, etc.)
- `user_metadata` - Flexible metadata for different user types
- `therapist_verifications` - Therapist credential verification

### Relationship Data
- `conflicts` - Relationship conflict records
- `emotion_checkins` - Daily emotion tracking
- `therapist_clients` - Therapist-client relationships
- `therapy_sessions` - Session scheduling and notes

### AI & Analytics
- `ai_models` - AI model metadata and versions
- `emotion_analyses` - AI emotion analysis results

### Support System
- `support_tickets` - Support ticket management
- `support_ticket_activities` - Ticket activity history

### Compliance & Security
- `audit_logs` - Comprehensive audit trail
- `user_sessions` - Authentication session tracking
- `api_keys` - API key management
- `webhooks` - Integration webhooks

## Migration Commands

```bash
# Run all pending migrations
npm run migrate

# Run migrations for specific environment
npm run migrate:dev
npm run migrate:prod

# Migrate existing SQLite data
npm run migrate:data

# Complete database setup (migrations + data migration)
npm run setup:db
```

## Troubleshooting

### Connection Issues
1. Verify PostgreSQL is running: `pg_isready`
2. Check database credentials in `.env` file
3. Ensure database exists: `psql -l`
4. Check firewall settings if connecting remotely

### Migration Issues
1. Check migration logs for specific errors
2. Verify database permissions
3. Ensure all dependencies are installed: `npm install`
4. Check PostgreSQL version compatibility (requires 12+)

### Data Migration Issues
1. Ensure SQLite database exists at `backend/mrcreams.db`
2. Check file permissions
3. Verify PostgreSQL connection before migration
4. Review migration logs for specific errors

## Production Considerations

1. **Security**: Change default passwords and use strong credentials
2. **Backup**: Set up regular database backups
3. **Monitoring**: Configure database monitoring and alerts
4. **Performance**: Review and optimize indexes based on usage patterns
5. **Scaling**: Consider read replicas for high-traffic scenarios
