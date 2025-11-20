-- HIPAA Compliance Tables Migration
-- This migration adds tables for HIPAA compliance including audit logs, encryption, and data management

-- Audit logs table for comprehensive activity tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(200),
    old_data JSONB,
    new_data JSONB,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs archive table for long-term storage
CREATE TABLE IF NOT EXISTS audit_logs_archive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(200),
    old_data JSONB,
    new_data JSONB,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PHI encryption keys table
CREATE TABLE IF NOT EXISTS phi_encryption_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    encryption_key_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of the encryption key
    salt VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Data retention policies table
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type VARCHAR(100) NOT NULL,
    retention_period_days INTEGER NOT NULL,
    auto_delete BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data deletion requests table (for GDPR compliance)
CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Associate Agreements table
CREATE TABLE IF NOT EXISTS business_associate_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ba_name VARCHAR(200) NOT NULL,
    ba_type VARCHAR(100) NOT NULL, -- 'therapist', 'organization', 'vendor'
    agreement_version VARCHAR(20) NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    agreement_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data access requests table
CREATE TABLE IF NOT EXISTS data_access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL, -- 'export', 'access', 'correction'
    data_types JSONB NOT NULL, -- Array of data types requested
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security incidents table
CREATE TABLE IF NOT EXISTS security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    affected_users JSONB, -- Array of affected user IDs
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
    resolution_notes TEXT,
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consent management table
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL, -- 'data_processing', 'marketing', 'research', 'third_party'
    consent_version VARCHAR(20) NOT NULL,
    granted BOOLEAN NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data processing activities table
CREATE TABLE IF NOT EXISTS data_processing_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    legal_basis VARCHAR(100) NOT NULL, -- 'consent', 'contract', 'legal_obligation', 'legitimate_interest'
    data_categories JSONB NOT NULL, -- Array of data categories processed
    purposes JSONB NOT NULL, -- Array of processing purposes
    retention_period_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add PHI encryption key column to users table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'phi_encryption_key') THEN
        ALTER TABLE users ADD COLUMN phi_encryption_key VARCHAR(255);
    END IF;
END $$;

-- Add deletion tracking columns to users table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'deletion_requested_at') THEN
        ALTER TABLE users ADD COLUMN deletion_requested_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'deletion_reason') THEN
        ALTER TABLE users ADD COLUMN deletion_reason TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address);

CREATE INDEX IF NOT EXISTS idx_phi_encryption_keys_user_id ON phi_encryption_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_data_retention_policies_data_type ON data_retention_policies(data_type);
CREATE INDEX IF NOT EXISTS idx_data_retention_policies_is_active ON data_retention_policies(is_active);

CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_user_id ON data_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_status ON data_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_requested_at ON data_deletion_requests(requested_at);

CREATE INDEX IF NOT EXISTS idx_business_associate_agreements_user_id ON business_associate_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_business_associate_agreements_ba_type ON business_associate_agreements(ba_type);
CREATE INDEX IF NOT EXISTS idx_business_associate_agreements_is_active ON business_associate_agreements(is_active);

CREATE INDEX IF NOT EXISTS idx_data_access_requests_user_id ON data_access_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_status ON data_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_requested_at ON data_access_requests(requested_at);

CREATE INDEX IF NOT EXISTS idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_incidents_detected_at ON security_incidents(detected_at);

CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_type ON consent_records(consent_type);
CREATE INDEX IF NOT EXISTS idx_consent_records_granted ON consent_records(granted);

CREATE INDEX IF NOT EXISTS idx_data_processing_activities_is_active ON data_processing_activities(is_active);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_phi_encryption_keys_updated_at BEFORE UPDATE ON phi_encryption_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_retention_policies_updated_at BEFORE UPDATE ON data_retention_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_deletion_requests_updated_at BEFORE UPDATE ON data_deletion_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_associate_agreements_updated_at BEFORE UPDATE ON business_associate_agreements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_access_requests_updated_at BEFORE UPDATE ON data_access_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_incidents_updated_at BEFORE UPDATE ON security_incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consent_records_updated_at BEFORE UPDATE ON consent_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_processing_activities_updated_at BEFORE UPDATE ON data_processing_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data retention policies
INSERT INTO data_retention_policies (data_type, retention_period_days, auto_delete, description) VALUES
('audit_logs', 2555, true, 'Audit logs retained for 7 years as per HIPAA requirements'),
('user_data', 1095, false, 'User data retained for 3 years after account closure'),
('therapy_sessions', 2555, false, 'Therapy session data retained for 7 years'),
('emotion_checkins', 1095, true, 'Emotion check-ins retained for 3 years'),
('conflicts', 1095, true, 'Conflict data retained for 3 years'),
('payment_logs', 2555, true, 'Payment logs retained for 7 years'),
('api_usage_logs', 365, true, 'API usage logs retained for 1 year'),
('integration_logs', 365, true, 'Integration logs retained for 1 year')
ON CONFLICT DO NOTHING;

-- Insert default data processing activities
INSERT INTO data_processing_activities (activity_name, description, legal_basis, data_categories, purposes, retention_period_days) VALUES
('Emotion Analysis', 'Processing user emotions for therapeutic insights', 'consent', '["emotions", "text_data", "behavioral_data"]', '["therapeutic_treatment", "health_analytics"]', 1095),
('Therapy Session Management', 'Managing therapy sessions and client relationships', 'contract', '["session_data", "client_info", "therapist_notes"]', '["healthcare_service", "treatment_delivery"]', 2555),
('Payment Processing', 'Processing payments for therapy services', 'contract', '["payment_data", "billing_info"]', '["payment_processing", "financial_transactions"]', 2555),
('Analytics and Reporting', 'Generating analytics and reports for platform improvement', 'legitimate_interest', '["usage_data", "performance_metrics"]', '["platform_improvement", "analytics"]', 365),
('Customer Support', 'Providing customer support and resolving issues', 'contract', '["support_tickets", "user_communications"]', '["customer_service", "issue_resolution"]', 1095)
ON CONFLICT DO NOTHING;

-- Create function to automatically archive old audit logs
CREATE OR REPLACE FUNCTION archive_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- Move old audit logs to archive
    INSERT INTO audit_logs_archive 
    SELECT *, NOW() as archived_at
    FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    
    -- Delete old audit logs
    DELETE FROM audit_logs 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to check data retention compliance
CREATE OR REPLACE FUNCTION check_data_retention_compliance()
RETURNS TABLE(
    data_type VARCHAR,
    policy_retention_days INTEGER,
    oldest_record_age_days INTEGER,
    compliance_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        drp.data_type,
        drp.retention_period_days,
        CASE 
            WHEN drp.data_type = 'audit_logs' THEN 
                EXTRACT(DAYS FROM NOW() - (SELECT MIN(created_at) FROM audit_logs))
            WHEN drp.data_type = 'user_data' THEN 
                EXTRACT(DAYS FROM NOW() - (SELECT MIN(created_at) FROM users))
            WHEN drp.data_type = 'therapy_sessions' THEN 
                EXTRACT(DAYS FROM NOW() - (SELECT MIN(created_at) FROM therapy_sessions))
            WHEN drp.data_type = 'emotion_checkins' THEN 
                EXTRACT(DAYS FROM NOW() - (SELECT MIN(created_at) FROM emotion_checkins))
            WHEN drp.data_type = 'conflicts' THEN 
                EXTRACT(DAYS FROM NOW() - (SELECT MIN(created_at) FROM conflicts))
            ELSE 0
        END as oldest_record_age_days,
        CASE 
            WHEN EXTRACT(DAYS FROM NOW() - (
                CASE 
                    WHEN drp.data_type = 'audit_logs' THEN (SELECT MIN(created_at) FROM audit_logs)
                    WHEN drp.data_type = 'user_data' THEN (SELECT MIN(created_at) FROM users)
                    WHEN drp.data_type = 'therapy_sessions' THEN (SELECT MIN(created_at) FROM therapy_sessions)
                    WHEN drp.data_type = 'emotion_checkins' THEN (SELECT MIN(created_at) FROM emotion_checkins)
                    WHEN drp.data_type = 'conflicts' THEN (SELECT MIN(created_at) FROM conflicts)
                    ELSE NOW()
                END
            )) <= drp.retention_period_days THEN 'compliant'
            ELSE 'non_compliant'
        END as compliance_status
    FROM data_retention_policies drp
    WHERE drp.is_active = true;
END;
$$ LANGUAGE plpgsql;
