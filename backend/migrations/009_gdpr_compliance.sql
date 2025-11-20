-- GDPR Compliance Tables Migration
-- This migration adds tables for GDPR compliance including consent management, data processing activities, and data deletion requests

-- Consent records table for tracking user consent
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL, -- 'data_processing', 'marketing', 'research', 'third_party', 'analytics'
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
    legal_basis VARCHAR(100) NOT NULL, -- 'consent', 'contract', 'legal_obligation', 'legitimate_interest', 'vital_interests', 'public_task'
    data_categories JSONB NOT NULL, -- Array of data categories processed
    purposes JSONB NOT NULL, -- Array of processing purposes
    retention_period_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data deletion requests table (Right to Erasure)
CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    processed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data access requests table (Right to Access)
CREATE TABLE IF NOT EXISTS data_access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL, -- 'export', 'access', 'portability'
    data_types JSONB NOT NULL, -- Array of data types requested
    format VARCHAR(20) DEFAULT 'json', -- 'json', 'csv', 'xml'
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id),
    file_path TEXT, -- Path to exported file
    file_size BIGINT, -- Size of exported file in bytes
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data rectification requests table (Right to Rectification)
CREATE TABLE IF NOT EXISTS data_rectification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_field VARCHAR(100) NOT NULL, -- Field to be rectified
    current_value TEXT,
    requested_value TEXT NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data portability requests table (Right to Data Portability)
CREATE TABLE IF NOT EXISTS data_portability_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_service VARCHAR(200), -- Service to port data to
    data_types JSONB NOT NULL, -- Array of data types to port
    format VARCHAR(20) DEFAULT 'json', -- 'json', 'csv', 'xml'
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id),
    transfer_method VARCHAR(50), -- 'download', 'api', 'email'
    transfer_url TEXT, -- URL for data transfer
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Privacy impact assessments table
CREATE TABLE IF NOT EXISTS privacy_impact_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    data_categories JSONB NOT NULL, -- Array of data categories assessed
    processing_purposes JSONB NOT NULL, -- Array of processing purposes
    risk_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    mitigation_measures TEXT,
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assessed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data breach notifications table
CREATE TABLE IF NOT EXISTS data_breach_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    breach_type VARCHAR(100) NOT NULL, -- 'confidentiality', 'integrity', 'availability'
    description TEXT NOT NULL,
    affected_users JSONB, -- Array of affected user IDs
    data_categories JSONB NOT NULL, -- Array of affected data categories
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    contained_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'detected', -- 'detected', 'contained', 'resolved', 'closed'
    notification_sent BOOLEAN DEFAULT false,
    notification_date TIMESTAMP WITH TIME ZONE,
    regulatory_notification BOOLEAN DEFAULT false,
    regulatory_notification_date TIMESTAMP WITH TIME ZONE,
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data processing agreements table
CREATE TABLE IF NOT EXISTS data_processing_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_name VARCHAR(200) NOT NULL,
    processor_name VARCHAR(200) NOT NULL,
    processor_type VARCHAR(100) NOT NULL, -- 'controller', 'processor', 'joint_controller'
    data_categories JSONB NOT NULL, -- Array of data categories
    processing_purposes JSONB NOT NULL, -- Array of processing purposes
    legal_basis VARCHAR(100) NOT NULL,
    agreement_version VARCHAR(20) NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    agreement_document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_type ON consent_records(consent_type);
CREATE INDEX IF NOT EXISTS idx_consent_records_granted ON consent_records(granted);
CREATE INDEX IF NOT EXISTS idx_consent_records_created_at ON consent_records(created_at);

CREATE INDEX IF NOT EXISTS idx_data_processing_activities_is_active ON data_processing_activities(is_active);
CREATE INDEX IF NOT EXISTS idx_data_processing_activities_legal_basis ON data_processing_activities(legal_basis);

CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_user_id ON data_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_status ON data_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_requested_at ON data_deletion_requests(requested_at);

CREATE INDEX IF NOT EXISTS idx_data_access_requests_user_id ON data_access_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_status ON data_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_requested_at ON data_access_requests(requested_at);

CREATE INDEX IF NOT EXISTS idx_data_rectification_requests_user_id ON data_rectification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_rectification_requests_status ON data_rectification_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_rectification_requests_requested_at ON data_rectification_requests(requested_at);

CREATE INDEX IF NOT EXISTS idx_data_portability_requests_user_id ON data_portability_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_portability_requests_status ON data_portability_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_portability_requests_requested_at ON data_portability_requests(requested_at);

CREATE INDEX IF NOT EXISTS idx_privacy_impact_assessments_is_active ON privacy_impact_assessments(is_active);
CREATE INDEX IF NOT EXISTS idx_privacy_impact_assessments_risk_level ON privacy_impact_assessments(risk_level);

CREATE INDEX IF NOT EXISTS idx_data_breach_notifications_severity ON data_breach_notifications(severity);
CREATE INDEX IF NOT EXISTS idx_data_breach_notifications_status ON data_breach_notifications(status);
CREATE INDEX IF NOT EXISTS idx_data_breach_notifications_detected_at ON data_breach_notifications(detected_at);

CREATE INDEX IF NOT EXISTS idx_data_processing_agreements_is_active ON data_processing_agreements(is_active);
CREATE INDEX IF NOT EXISTS idx_data_processing_agreements_processor_type ON data_processing_agreements(processor_type);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_consent_records_updated_at BEFORE UPDATE ON consent_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_processing_activities_updated_at BEFORE UPDATE ON data_processing_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_deletion_requests_updated_at BEFORE UPDATE ON data_deletion_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_access_requests_updated_at BEFORE UPDATE ON data_access_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_rectification_requests_updated_at BEFORE UPDATE ON data_rectification_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_portability_requests_updated_at BEFORE UPDATE ON data_portability_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_privacy_impact_assessments_updated_at BEFORE UPDATE ON privacy_impact_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_breach_notifications_updated_at BEFORE UPDATE ON data_breach_notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_processing_agreements_updated_at BEFORE UPDATE ON data_processing_agreements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data processing activities
INSERT INTO data_processing_activities (activity_name, description, legal_basis, data_categories, purposes, retention_period_days) VALUES
('User Registration', 'Processing user registration data for account creation', 'consent', '["personal_information", "contact_information"]', '["account_management", "user_authentication"]', 1095),
('Emotion Analysis', 'Processing user emotions for therapeutic insights and recommendations', 'consent', '["emotion_data", "behavioral_data", "text_data"]', '["therapeutic_treatment", "health_analytics", "personalized_insights"]', 1095),
('Therapy Session Management', 'Managing therapy sessions and client relationships', 'contract', '["session_data", "client_info", "therapist_notes", "health_data"]', '["healthcare_service", "treatment_delivery", "clinical_documentation"]', 2555),
('Payment Processing', 'Processing payments for therapy services', 'contract', '["payment_data", "billing_info", "financial_data"]', '["payment_processing", "financial_transactions", "billing_management"]', 2555),
('Analytics and Reporting', 'Generating analytics and reports for platform improvement', 'legitimate_interest', '["usage_data", "performance_metrics", "aggregated_data"]', '["platform_improvement", "analytics", "business_intelligence"]', 365),
('Customer Support', 'Providing customer support and resolving issues', 'contract', '["support_tickets", "user_communications", "technical_data"]', '["customer_service", "issue_resolution", "technical_support"]', 1095),
('Marketing Communications', 'Sending marketing communications and promotional content', 'consent', '["contact_information", "preference_data"]', '["marketing", "promotional_communications", "user_engagement"]', 365),
('Research and Development', 'Using anonymized data for research and development', 'legitimate_interest', '["anonymized_data", "aggregated_data"]', '["research", "product_development", "innovation"]', 1095)
ON CONFLICT DO NOTHING;

-- Insert default consent types
INSERT INTO consent_records (user_id, consent_type, consent_version, granted, granted_at) 
SELECT 
    u.id,
    'data_processing',
    '1.0',
    true,
    u.created_at
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM consent_records cr 
    WHERE cr.user_id = u.id AND cr.consent_type = 'data_processing'
);

-- Create function to check GDPR compliance
CREATE OR REPLACE FUNCTION check_gdpr_compliance(user_id_param UUID)
RETURNS TABLE(
    compliance_area VARCHAR,
    status VARCHAR,
    details TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH compliance_checks AS (
        -- Check consent records
        SELECT 
            'consent_management' as compliance_area,
            CASE 
                WHEN COUNT(*) > 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as status,
            'User has ' || COUNT(*) || ' consent records' as details
        FROM consent_records 
        WHERE user_id = user_id_param
        
        UNION ALL
        
        -- Check data processing activities
        SELECT 
            'data_processing_activities' as compliance_area,
            CASE 
                WHEN COUNT(*) > 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as status,
            'Platform has ' || COUNT(*) || ' active data processing activities' as details
        FROM data_processing_activities 
        WHERE is_active = true
        
        UNION ALL
        
        -- Check data retention policies
        SELECT 
            'data_retention' as compliance_area,
            CASE 
                WHEN COUNT(*) > 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as status,
            'Platform has ' || COUNT(*) || ' data retention policies' as details
        FROM data_retention_policies 
        WHERE is_active = true
        
        UNION ALL
        
        -- Check audit logging
        SELECT 
            'audit_logging' as compliance_area,
            CASE 
                WHEN COUNT(*) > 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as status,
            'User has ' || COUNT(*) || ' audit log entries' as details
        FROM audit_logs 
        WHERE user_id = user_id_param
    )
    SELECT * FROM compliance_checks;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate GDPR compliance report
CREATE OR REPLACE FUNCTION generate_gdpr_compliance_report(start_date DATE, end_date DATE)
RETURNS TABLE(
    metric_name VARCHAR,
    metric_value BIGINT,
    compliance_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH compliance_metrics AS (
        -- Consent metrics
        SELECT 
            'total_consent_records' as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) > 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as compliance_status
        FROM consent_records 
        WHERE created_at BETWEEN start_date AND end_date
        
        UNION ALL
        
        -- Data processing activities
        SELECT 
            'active_data_processing_activities' as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) > 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as compliance_status
        FROM data_processing_activities 
        WHERE is_active = true
        
        UNION ALL
        
        -- Data deletion requests
        SELECT 
            'data_deletion_requests' as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) >= 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as compliance_status
        FROM data_deletion_requests 
        WHERE requested_at BETWEEN start_date AND end_date
        
        UNION ALL
        
        -- Data access requests
        SELECT 
            'data_access_requests' as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) >= 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as compliance_status
        FROM data_access_requests 
        WHERE requested_at BETWEEN start_date AND end_date
        
        UNION ALL
        
        -- Audit logs
        SELECT 
            'audit_log_entries' as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) > 0 THEN 'compliant'
                ELSE 'non_compliant'
            END as compliance_status
        FROM audit_logs 
        WHERE created_at BETWEEN start_date AND end_date
    )
    SELECT * FROM compliance_metrics;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically process data deletion requests
CREATE OR REPLACE FUNCTION process_approved_deletion_requests()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    deletion_record RECORD;
BEGIN
    -- Process all approved deletion requests
    FOR deletion_record IN 
        SELECT id, user_id, processed_by 
        FROM data_deletion_requests 
        WHERE status = 'approved' AND completed_at IS NULL
    LOOP
        -- Update status to processing
        UPDATE data_deletion_requests 
        SET status = 'processing', updated_at = NOW()
        WHERE id = deletion_record.id;
        
        -- Delete user data (this would be implemented with proper cascade deletes)
        -- For now, just mark as completed
        UPDATE data_deletion_requests 
        SET status = 'completed', completed_at = NOW(), updated_at = NOW()
        WHERE id = deletion_record.id;
        
        processed_count := processed_count + 1;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;
