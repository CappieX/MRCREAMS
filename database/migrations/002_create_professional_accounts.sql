-- MR.CREAMS Pro Professional Accounts Setup
-- This script creates/updates all professional login accounts

-- First, let's check if accounts already exist and update them, otherwise create new ones

-- Super Admin Account
INSERT INTO users (email, password_hash, name, user_type, onboarding_completed, email_verified)
VALUES (
    'superadmin@mrcreams.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Super Administrator',
    'super_admin',
    true,
    true
)
ON CONFLICT (email) DO UPDATE SET
    user_type = 'super_admin',
    name = 'Super Administrator',
    onboarding_completed = true,
    email_verified = true;

-- Admin Account
INSERT INTO users (email, password_hash, name, user_type, onboarding_completed, email_verified)
VALUES (
    'admin@mrcreams.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'System Administrator',
    'admin',
    true,
    true
)
ON CONFLICT (email) DO UPDATE SET
    user_type = 'admin',
    name = 'System Administrator',
    onboarding_completed = true,
    email_verified = true;

-- Support Account
INSERT INTO users (email, password_hash, name, user_type, onboarding_completed, email_verified)
VALUES (
    'support@mrcreams.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Support Specialist',
    'support',
    true,
    true
)
ON CONFLICT (email) DO UPDATE SET
    user_type = 'support',
    name = 'Support Specialist',
    onboarding_completed = true,
    email_verified = true;

-- Therapist Account
INSERT INTO users (email, password_hash, name, user_type, onboarding_completed, email_verified)
VALUES (
    'therapist@mrcreams.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Licensed Therapist',
    'therapist',
    true,
    true
)
ON CONFLICT (email) DO UPDATE SET
    user_type = 'therapist',
    name = 'Licensed Therapist',
    onboarding_completed = true,
    email_verified = true;

-- Executive Account
INSERT INTO users (email, password_hash, name, user_type, onboarding_completed, email_verified)
VALUES (
    'executive@mrcreams.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO',
    'Executive Director',
    'executive',
    true,
    true
)
ON CONFLICT (email) DO UPDATE SET
    user_type = 'executive',
    name = 'Executive Director',
    onboarding_completed = true,
    email_verified = true;

-- Verify accounts were created/updated
SELECT email, user_type, onboarding_completed, email_verified
FROM users
WHERE email IN ('superadmin@mrcreams.com', 'admin@mrcreams.com', 'support@mrcreams.com', 'therapist@mrcreams.com', 'executive@mrcreams.com')
ORDER BY email;
