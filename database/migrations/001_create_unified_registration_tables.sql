-- Users table - Core user information
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  user_type VARCHAR(50) NOT NULL DEFAULT 'individual',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User metadata for different user types
CREATE TABLE user_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist verification table
CREATE TABLE therapist_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  notes TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_user_metadata_user_id ON user_metadata(user_id);
CREATE INDEX idx_therapist_verifications_user_id ON therapist_verifications(user_id);

-- Sample data for testing
INSERT INTO users (email, password_hash, name, user_type, onboarding_completed) VALUES
('individual@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Individual User', 'individual', false),
('company@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Company Admin', 'company', false),
('therapist@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Licensed Therapist', 'therapist', false);

-- Sample metadata
INSERT INTO user_metadata (user_id, metadata) VALUES
((SELECT id FROM users WHERE email = 'individual@example.com'), '{"relationshipStatus": "Married", "age": "35"}'::jsonb),
((SELECT id FROM users WHERE email = 'company@example.com'), '{"companyName": "Tech Corp", "companySize": "51-200", "industry": "Technology", "professionalRole": "Admin"}'::jsonb),
((SELECT id FROM users WHERE email = 'therapist@example.com'), '{"licenseNumber": "LMFT12345", "yearsOfExperience": "6-10", "credentials": ["LMFT", "LCSW"], "specializations": ["Couples Therapy"], "status": "pending_verification"}'::jsonb);
