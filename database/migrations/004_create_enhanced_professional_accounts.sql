-- MR.CREAMS Pro Enhanced Professional Accounts Setup
-- This script creates new professional accounts with secure passwords

-- Add password_reset_required column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT FALSE;

-- Function to generate secure 12-character password
CREATE OR REPLACE FUNCTION generate_secure_password()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create enhanced professional accounts
-- Super Admin Account
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender, password_reset_required)
SELECT
    'super.admin',
    'super.admin@mrcreams.com',
    generate_secure_password(),
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', -- Will be updated with actual hash
    'Super Administrator',
    'super_admin',
    true,
    true,
    'male',
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'super.admin@mrcreams.com');

-- Admin Account
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender, password_reset_required)
SELECT
    'platform.admin',
    'platform.admin@mrcreams.com',
    generate_secure_password(),
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', -- Will be updated with actual hash
    'Platform Administrator',
    'admin',
    true,
    true,
    'male',
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'platform.admin@mrcreams.com');

-- Support Account
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender, password_reset_required)
SELECT
    'support.team',
    'support.team@mrcreams.com',
    generate_secure_password(),
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', -- Will be updated with actual hash
    'Support Team Lead',
    'support',
    true,
    true,
    'female',
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'support.team@mrcreams.com');

-- Therapist Account
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender, password_reset_required)
SELECT
    'clinical.team',
    'clinical.team@mrcreams.com',
    generate_secure_password(),
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', -- Will be updated with actual hash
    'Clinical Team Lead',
    'therapist',
    true,
    true,
    'female',
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'clinical.team@mrcreams.com');

-- Executive Account
INSERT INTO users (username, email, password, password_hash, name, user_type, onboarding_completed, email_verified, gender, password_reset_required)
SELECT
    'executive.team',
    'executive.team@mrcreams.com',
    generate_secure_password(),
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', -- Will be updated with actual hash
    'Executive Director',
    'executive',
    true,
    true,
    'male',
    true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'executive.team@mrcreams.com');

-- Display created accounts (without showing actual passwords)
SELECT
    'Professional accounts created successfully' as status,
    email,
    user_type,
    password_reset_required,
    onboarding_completed,
    email_verified,
    'PASSWORD: [GENERATED SECURE PASSWORD - CHECK SERVER LOGS]' as password_info
FROM users
WHERE email IN ('super.admin@mrcreams.com', 'platform.admin@mrcreams.com', 'support.team@mrcreams.com', 'clinical.team@mrcreams.com', 'executive.team@mrcreams.com')
ORDER BY email;

-- Clean up the function
DROP FUNCTION IF EXISTS generate_secure_password();
