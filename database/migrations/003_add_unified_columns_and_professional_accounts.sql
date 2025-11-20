-- Migration to add unified registration columns to existing users table
-- This adds the missing columns needed for the professional login system

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(50) DEFAULT 'individual';
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing records to have proper values
UPDATE users SET
    password_hash = password,
    user_type = CASE
        WHEN is_admin = true THEN 'admin'
        ELSE 'individual'
    END,
    name = COALESCE(first_name || ' ' || last_name, username)
WHERE password_hash IS NULL;

-- Create user_metadata table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    metadata JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create therapist_verifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS therapist_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_user_metadata_user_id ON user_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_verifications_user_id ON therapist_verifications(user_id);

-- Create professional user accounts
-- Super Admin
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender)
SELECT
    'superadmin',
    'superadmin@mrcreams.com',
    'temp_password',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Super Administrator',
    'super_admin',
    true,
    true,
    'male'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'superadmin@mrcreams.com');

-- Admin
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender)
SELECT
    'sysadmin',
    'admin@mrcreams.com',
    'temp_password',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'System Administrator',
    'admin',
    true,
    true,
    'male'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@mrcreams.com');

-- Support
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender)
SELECT
    'support',
    'support@mrcreams.com',
    'temp_password',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Support Specialist',
    'support',
    true,
    true,
    'female'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'support@mrcreams.com');

-- Therapist
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender)
SELECT
    'therapist',
    'therapist@mrcreams.com',
    'temp_password',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Licensed Therapist',
    'therapist',
    true,
    true,
    'female'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'therapist@mrcreams.com');

-- Executive
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender)
SELECT
    'executive',
    'executive@mrcreams.com',
    'temp_password',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Executive Director',
    'executive',
    true,
    true,
    'male'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'executive@mrcreams.com');

-- Verify professional accounts were created
SELECT 'Professional accounts created successfully' as status;
SELECT email, user_type, onboarding_completed, email_verified
FROM users
WHERE email IN ('superadmin@mrcreams.com', 'admin@mrcreams.com', 'support@mrcreams.com', 'therapist@mrcreams.com', 'executive@mrcreams.com')
ORDER BY email;
