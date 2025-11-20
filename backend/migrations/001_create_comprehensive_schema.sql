-- MR.CREAMS PostgreSQL Database Schema
-- Comprehensive schema for production-ready emotional intelligence platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type AS ENUM (
    'individual',
    'company',
    'therapist',
    'admin',
    'it_admin',
    'support',
    'executive',
    'super_admin'
);

CREATE TYPE session_status AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);

CREATE TYPE emotion_type AS ENUM (
    'joy',
    'sadness',
    'anger',
    'fear',
    'surprise',
    'disgust',
    'neutral',
    'anxious',
    'calm',
    'excited'
);

CREATE TYPE conflict_status AS ENUM (
    'active',
    'resolved',
    'escalated',
    'archived'
);

-- Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    size VARCHAR(50),
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table - Enhanced for all user types
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type user_type NOT NULL DEFAULT 'individual',
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url VARCHAR(500),
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User metadata for different user types
CREATE TABLE user_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metadata JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist verification table
CREATE TABLE therapist_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    license_number VARCHAR(100),
    license_state VARCHAR(50),
    years_experience INTEGER,
    specializations TEXT[],
    credentials TEXT[],
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for authentication tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conflicts table - Enhanced
CREATE TABLE conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    conflict_reason VARCHAR(100) NOT NULL,
    description TEXT,
    time_consumption INTEGER NOT NULL CHECK (time_consumption > 0),
    fight_degree INTEGER NOT NULL CHECK (fight_degree >= 1 AND fight_degree <= 10),
    final_result TEXT,
    remark TEXT,
    status conflict_status DEFAULT 'active',
    resolution_date TIMESTAMP,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emotion check-ins table
CREATE TABLE emotion_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    primary_emotion emotion_type NOT NULL,
    secondary_emotions emotion_type[],
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
    context TEXT,
    triggers TEXT[],
    coping_strategies TEXT[],
    ai_analysis JSONB,
    ai_confidence DECIMAL(3,2),
    ai_recommendations TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Therapist-client relationships
CREATE TABLE therapist_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE,
    notes TEXT,
    treatment_plan JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(therapist_id, client_id)
);

-- Therapy sessions
CREATE TABLE therapy_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status session_status DEFAULT 'scheduled',
    session_notes TEXT,
    homework_assigned TEXT,
    next_session_date DATE,
    session_recording_url VARCHAR(500),
    ai_transcript TEXT,
    ai_insights JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI model metadata
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    description TEXT,
    accuracy_score DECIMAL(5,4),
    training_data_size INTEGER,
    last_trained TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emotion analysis results
CREATE TABLE emotion_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    conflict_id UUID REFERENCES conflicts(id) ON DELETE CASCADE,
    model_id UUID REFERENCES ai_models(id),
    input_text TEXT NOT NULL,
    detected_emotions JSONB NOT NULL,
    confidence_scores JSONB NOT NULL,
    sentiment_score DECIMAL(3,2),
    analysis_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets (already designed but enhanced)
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    tags TEXT[],
    sla_deadline TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support ticket activities
CREATE TABLE support_ticket_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API keys for third-party integrations
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    key_name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions TEXT[],
    rate_limit_per_hour INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhooks for integrations
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    events TEXT[] NOT NULL,
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMP,
    failure_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_user_metadata_user_id ON user_metadata(user_id);
CREATE INDEX idx_therapist_verifications_user_id ON therapist_verifications(user_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_conflicts_user_id ON conflicts(user_id);
CREATE INDEX idx_conflicts_date ON conflicts(date);
CREATE INDEX idx_conflicts_status ON conflicts(status);
CREATE INDEX idx_emotion_checkins_user_id ON emotion_checkins(user_id);
CREATE INDEX idx_emotion_checkins_created_at ON emotion_checkins(created_at);
CREATE INDEX idx_therapist_clients_therapist_id ON therapist_clients(therapist_id);
CREATE INDEX idx_therapist_clients_client_id ON therapist_clients(client_id);
CREATE INDEX idx_therapy_sessions_therapist_id ON therapy_sessions(therapist_id);
CREATE INDEX idx_therapy_sessions_client_id ON therapy_sessions(client_id);
CREATE INDEX idx_therapy_sessions_scheduled_at ON therapy_sessions(scheduled_at);
CREATE INDEX idx_emotion_analyses_user_id ON emotion_analyses(user_id);
CREATE INDEX idx_emotion_analyses_conflict_id ON emotion_analyses(conflict_id);
CREATE INDEX idx_support_tickets_requester_id ON support_tickets(requester_id);
CREATE INDEX idx_support_tickets_assigned_agent_id ON support_tickets(assigned_agent_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_metadata_updated_at BEFORE UPDATE ON user_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conflicts_updated_at BEFORE UPDATE ON conflicts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapist_clients_updated_at BEFORE UPDATE ON therapist_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_therapy_sessions_updated_at BEFORE UPDATE ON therapy_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default organization
INSERT INTO organizations (name, code, domain, industry, size, subscription_tier) VALUES
('MR.CREAMS Platform', 'MRCREAMS', 'mrcreams.com', 'Healthcare Technology', '1-10', 'enterprise');

-- Insert default AI model
INSERT INTO ai_models (name, version, model_type, description, accuracy_score, is_active) VALUES
('Emotion Detection v1.0', '1.0.0', 'text_classification', 'Primary emotion detection model for text analysis', 0.89, true);

-- Create views for analytics
CREATE VIEW user_analytics AS
SELECT 
    u.id,
    u.name,
    u.user_type,
    o.name as organization_name,
    COUNT(DISTINCT c.id) as total_conflicts,
    AVG(c.fight_degree) as avg_fight_intensity,
    COUNT(DISTINCT ec.id) as total_emotion_checkins,
    u.created_at,
    u.last_login
FROM users u
LEFT JOIN organizations o ON u.organization_id = o.id
LEFT JOIN conflicts c ON u.id = c.user_id
LEFT JOIN emotion_checkins ec ON u.id = ec.user_id
GROUP BY u.id, u.name, u.user_type, o.name, u.created_at, u.last_login;

CREATE VIEW therapist_performance AS
SELECT 
    t.id as therapist_id,
    t.name as therapist_name,
    COUNT(DISTINCT tc.client_id) as total_clients,
    COUNT(DISTINCT ts.id) as total_sessions,
    AVG(ts.duration_minutes) as avg_session_duration,
    COUNT(CASE WHEN ts.status = 'completed' THEN 1 END) as completed_sessions
FROM users t
LEFT JOIN therapist_clients tc ON t.id = tc.therapist_id
LEFT JOIN therapy_sessions ts ON t.id = ts.therapist_id
WHERE t.user_type = 'therapist'
GROUP BY t.id, t.name;
