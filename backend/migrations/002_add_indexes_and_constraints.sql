-- Migration 002: Add indexes and constraints for performance
-- This migration adds additional indexes and constraints for better performance

-- Add composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conflicts_user_date ON conflicts(user_id, date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conflicts_status_date ON conflicts(status, date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_emotion_checkins_user_date ON emotion_checkins(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_therapy_sessions_therapist_date ON therapy_sessions(therapist_id, scheduled_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_support_tickets_status_priority ON support_tickets(status, priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action);

-- Add partial indexes for active records
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active ON users(id) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_therapist_clients_active ON therapist_clients(therapist_id, client_id) WHERE status = 'active';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_keys_active ON api_keys(user_id) WHERE is_active = true;

-- Add text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conflicts_description_gin ON conflicts USING gin(to_tsvector('english', description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_support_tickets_title_gin ON support_tickets USING gin(to_tsvector('english', title));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_support_tickets_description_gin ON support_tickets USING gin(to_tsvector('english', description));

-- Add constraints for data integrity
ALTER TABLE conflicts ADD CONSTRAINT check_fight_degree_range CHECK (fight_degree >= 1 AND fight_degree <= 10);
ALTER TABLE conflicts ADD CONSTRAINT check_time_consumption_positive CHECK (time_consumption > 0);
ALTER TABLE emotion_checkins ADD CONSTRAINT check_intensity_range CHECK (intensity >= 1 AND intensity <= 10);
ALTER TABLE emotion_checkins ADD CONSTRAINT check_confidence_range CHECK (ai_confidence >= 0 AND ai_confidence <= 1);
ALTER TABLE therapy_sessions ADD CONSTRAINT check_duration_positive CHECK (duration_minutes > 0);

-- Add check constraints for enum-like fields
ALTER TABLE support_tickets ADD CONSTRAINT check_priority_values CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
ALTER TABLE support_tickets ADD CONSTRAINT check_status_values CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'cancelled'));

-- Create function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    ticket_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the next counter value
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 2) AS INTEGER)), 0) + 1
    INTO counter
    FROM support_tickets
    WHERE ticket_number ~ '^T[0-9]+$';
    
    -- Format as T + 6-digit number
    ticket_number := 'T' || LPAD(counter::TEXT, 6, '0');
    
    RETURN ticket_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate ticket numbers
CREATE OR REPLACE FUNCTION set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ticket_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_ticket_number();

-- Create function to update SLA deadline
CREATE OR REPLACE FUNCTION set_sla_deadline()
RETURNS TRIGGER AS $$
BEGIN
    -- Set SLA deadline based on priority
    CASE NEW.priority
        WHEN 'urgent' THEN NEW.sla_deadline := NEW.created_at + INTERVAL '2 hours';
        WHEN 'high' THEN NEW.sla_deadline := NEW.created_at + INTERVAL '4 hours';
        WHEN 'medium' THEN NEW.sla_deadline := NEW.created_at + INTERVAL '24 hours';
        WHEN 'low' THEN NEW.sla_deadline := NEW.created_at + INTERVAL '72 hours';
        ELSE NEW.sla_deadline := NEW.created_at + INTERVAL '24 hours';
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_sla_deadline
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION set_sla_deadline();

-- Create view for dashboard analytics
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_active = true) as total_active_users,
    (SELECT COUNT(*) FROM users WHERE user_type = 'therapist' AND is_active = true) as total_therapists,
    (SELECT COUNT(*) FROM conflicts WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as conflicts_last_30_days,
    (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_support_tickets,
    (SELECT COUNT(*) FROM therapy_sessions WHERE scheduled_at >= CURRENT_DATE AND scheduled_at < CURRENT_DATE + INTERVAL '1 day') as sessions_today,
    (SELECT AVG(fight_degree) FROM conflicts WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as avg_conflict_intensity_30_days;

-- Create view for therapist workload
CREATE OR REPLACE VIEW therapist_workload AS
SELECT 
    t.id as therapist_id,
    t.name as therapist_name,
    COUNT(DISTINCT tc.client_id) as active_clients,
    COUNT(DISTINCT ts.id) FILTER (WHERE ts.scheduled_at >= CURRENT_DATE AND ts.scheduled_at < CURRENT_DATE + INTERVAL '7 days') as sessions_this_week,
    COUNT(DISTINCT ts.id) FILTER (WHERE ts.status = 'completed' AND ts.scheduled_at >= CURRENT_DATE - INTERVAL '30 days') as completed_sessions_30_days,
    AVG(ts.duration_minutes) FILTER (WHERE ts.status = 'completed') as avg_session_duration
FROM users t
LEFT JOIN therapist_clients tc ON t.id = tc.therapist_id AND tc.status = 'active'
LEFT JOIN therapy_sessions ts ON t.id = ts.therapist_id
WHERE t.user_type = 'therapist' AND t.is_active = true
GROUP BY t.id, t.name;

-- Create function to clean up old sessions
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete sessions older than 1 year that are completed or cancelled
    DELETE FROM therapy_sessions 
    WHERE scheduled_at < CURRENT_DATE - INTERVAL '1 year'
    AND status IN ('completed', 'cancelled');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to anonymize old audit logs
CREATE OR REPLACE FUNCTION anonymize_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Anonymize audit logs older than 7 years
    UPDATE audit_logs 
    SET 
        user_id = NULL,
        ip_address = NULL,
        user_agent = '[ANONYMIZED]'
    WHERE created_at < CURRENT_DATE - INTERVAL '7 years';
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;
