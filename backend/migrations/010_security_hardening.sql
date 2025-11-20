-- Security Hardening Tables Migration
-- This migration adds tables for security event logging, rate limiting, and security monitoring

-- Security events table for logging security-related events
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    details JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(500),
    method VARCHAR(10),
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate limiting table for tracking rate limit violations
CREATE TABLE IF NOT EXISTS rate_limit_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    violation_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Failed login attempts table for tracking authentication failures
CREATE TABLE IF NOT EXISTS failed_login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    attempt_count INTEGER DEFAULT 1,
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security policies table for storing security configuration
CREATE TABLE IF NOT EXISTS security_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name VARCHAR(100) NOT NULL UNIQUE,
    policy_type VARCHAR(50) NOT NULL, -- 'rate_limit', 'ip_whitelist', 'password_policy', etc.
    policy_config JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IP whitelist table for allowed IP addresses
CREATE TABLE IF NOT EXISTS ip_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IP blacklist table for blocked IP addresses
CREATE TABLE IF NOT EXISTS ip_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address INET NOT NULL UNIQUE,
    reason TEXT,
    blocked_until TIMESTAMP WITH TIME ZONE,
    is_permanent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security alerts table for critical security events
CREATE TABLE IF NOT EXISTS security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(500),
    method VARCHAR(10),
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES users(id),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security metrics table for tracking security statistics
CREATE TABLE IF NOT EXISTS security_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (metric_name, metric_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);

CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_ip_address ON rate_limit_violations(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_endpoint ON rate_limit_violations(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_window_start ON rate_limit_violations(window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limit_violations_blocked_until ON rate_limit_violations(blocked_until);

CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_email ON failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_ip_address ON failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_last_attempt ON failed_login_attempts(last_attempt);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_blocked_until ON failed_login_attempts(blocked_until);

CREATE INDEX IF NOT EXISTS idx_security_policies_policy_name ON security_policies(policy_name);
CREATE INDEX IF NOT EXISTS idx_security_policies_policy_type ON security_policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_security_policies_is_active ON security_policies(is_active);

CREATE INDEX IF NOT EXISTS idx_ip_whitelist_ip_address ON ip_whitelist(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_whitelist_is_active ON ip_whitelist(is_active);

CREATE INDEX IF NOT EXISTS idx_ip_blacklist_ip_address ON ip_blacklist(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_blacklist_blocked_until ON ip_blacklist(blocked_until);
CREATE INDEX IF NOT EXISTS idx_ip_blacklist_is_permanent ON ip_blacklist(is_permanent);

CREATE INDEX IF NOT EXISTS idx_security_alerts_alert_type ON security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_acknowledged ON security_alerts(acknowledged);
CREATE INDEX IF NOT EXISTS idx_security_alerts_resolved ON security_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_security_metrics_metric_name ON security_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_security_metrics_metric_date ON security_metrics(metric_date);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_security_policies_updated_at BEFORE UPDATE ON security_policies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_whitelist_updated_at BEFORE UPDATE ON ip_whitelist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_blacklist_updated_at BEFORE UPDATE ON ip_blacklist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_alerts_updated_at BEFORE UPDATE ON security_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default security policies
INSERT INTO security_policies (policy_name, policy_type, policy_config) VALUES
('default_rate_limit', 'rate_limit', '{"windowMs": 900000, "maxRequests": 100, "skipSuccessfulRequests": false}'),
('auth_rate_limit', 'rate_limit', '{"windowMs": 900000, "maxRequests": 5, "skipSuccessfulRequests": true}'),
('api_rate_limit', 'rate_limit', '{"windowMs": 3600000, "maxRequests": 1000, "skipSuccessfulRequests": false}'),
('strict_rate_limit', 'rate_limit', '{"windowMs": 900000, "maxRequests": 5, "skipSuccessfulRequests": false}'),
('password_policy', 'password', '{"minLength": 8, "requireUppercase": true, "requireLowercase": true, "requireNumbers": true, "requireSpecialChars": true}'),
('session_policy', 'session', '{"maxAge": 86400000, "regenerateInterval": 300000, "secure": true, "httpOnly": true}'),
('cors_policy', 'cors', '{"allowedOrigins": ["http://localhost:3000"], "allowedMethods": ["GET", "POST", "PUT", "DELETE"], "allowedHeaders": ["Content-Type", "Authorization"]}')
ON CONFLICT (policy_name) DO NOTHING;

-- Insert default IP whitelist (localhost for development)
INSERT INTO ip_whitelist (ip_address, description) VALUES
('127.0.0.1', 'Localhost for development'),
('::1', 'IPv6 localhost for development')
ON CONFLICT (ip_address) DO NOTHING;

-- Create function to check if IP is blocked
CREATE OR REPLACE FUNCTION is_ip_blocked(ip_param INET)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if IP is in blacklist
    IF EXISTS (
        SELECT 1 FROM ip_blacklist 
        WHERE ip_address = ip_param 
        AND (blocked_until IS NULL OR blocked_until > NOW())
        AND is_permanent = true
    ) THEN
        RETURN true;
    END IF;
    
    -- Check if IP is temporarily blocked
    IF EXISTS (
        SELECT 1 FROM ip_blacklist 
        WHERE ip_address = ip_param 
        AND blocked_until > NOW()
        AND is_permanent = false
    ) THEN
        RETURN true;
    END IF;
    
    -- Check failed login attempts
    IF EXISTS (
        SELECT 1 FROM failed_login_attempts 
        WHERE ip_address = ip_param 
        AND blocked_until > NOW()
    ) THEN
        RETURN true;
    END IF;
    
    -- Check rate limit violations
    IF EXISTS (
        SELECT 1 FROM rate_limit_violations 
        WHERE ip_address = ip_param 
        AND blocked_until > NOW()
    ) THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Create function to get security metrics
CREATE OR REPLACE FUNCTION get_security_metrics(start_date DATE, end_date DATE)
RETURNS TABLE(
    metric_name VARCHAR,
    metric_value NUMERIC,
    metric_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.metric_name,
        sm.metric_value,
        sm.metric_date
    FROM security_metrics sm
    WHERE sm.metric_date BETWEEN start_date AND end_date
    ORDER BY sm.metric_date, sm.metric_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old security events
CREATE OR REPLACE FUNCTION cleanup_old_security_events(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete old security events
    DELETE FROM security_events 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete old rate limit violations
    DELETE FROM rate_limit_violations 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
    
    -- Delete old failed login attempts
    DELETE FROM failed_login_attempts 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate security report
CREATE OR REPLACE FUNCTION generate_security_report(start_date DATE, end_date DATE)
RETURNS TABLE(
    report_section VARCHAR,
    metric_name VARCHAR,
    metric_value BIGINT,
    severity VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH security_stats AS (
        -- Security events by type
        SELECT 
            'security_events' as report_section,
            event_type as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) > 100 THEN 'high'
                WHEN COUNT(*) > 50 THEN 'medium'
                ELSE 'low'
            END as severity
        FROM security_events
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY event_type
        
        UNION ALL
        
        -- Failed login attempts
        SELECT 
            'failed_logins' as report_section,
            'total_attempts' as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) > 50 THEN 'high'
                WHEN COUNT(*) > 20 THEN 'medium'
                ELSE 'low'
            END as severity
        FROM failed_login_attempts
        WHERE created_at BETWEEN start_date AND end_date
        
        UNION ALL
        
        -- Rate limit violations
        SELECT 
            'rate_limits' as report_section,
            'total_violations' as metric_name,
            COUNT(*) as metric_value,
            CASE 
                WHEN COUNT(*) > 100 THEN 'high'
                WHEN COUNT(*) > 50 THEN 'medium'
                ELSE 'low'
            END as severity
        FROM rate_limit_violations
        WHERE created_at BETWEEN start_date AND end_date
        
        UNION ALL
        
        -- Security alerts
        SELECT 
            'security_alerts' as report_section,
            alert_type as metric_name,
            COUNT(*) as metric_value,
            severity
        FROM security_alerts
        WHERE created_at BETWEEN start_date AND end_date
        GROUP BY alert_type, severity
    )
    SELECT * FROM security_stats
    ORDER BY report_section, metric_value DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to block IP address
CREATE OR REPLACE FUNCTION block_ip_address(
    ip_param INET,
    reason_param TEXT DEFAULT 'Security violation',
    duration_hours INTEGER DEFAULT 24,
    permanent_param BOOLEAN DEFAULT false
)
RETURNS BOOLEAN AS $$
DECLARE
    blocked_until_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate block duration
    IF permanent_param THEN
        blocked_until_time := NULL;
    ELSE
        blocked_until_time := NOW() + INTERVAL '1 hour' * duration_hours;
    END IF;
    
    -- Insert or update blacklist entry
    INSERT INTO ip_blacklist (ip_address, reason, blocked_until, is_permanent)
    VALUES (ip_param, reason_param, blocked_until_time, permanent_param)
    ON CONFLICT (ip_address) DO UPDATE SET
        reason = EXCLUDED.reason,
        blocked_until = EXCLUDED.blocked_until,
        is_permanent = EXCLUDED.is_permanent,
        updated_at = NOW();
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Create function to unblock IP address
CREATE OR REPLACE FUNCTION unblock_ip_address(ip_param INET)
RETURNS BOOLEAN AS $$
BEGIN
    -- Remove from blacklist
    DELETE FROM ip_blacklist WHERE ip_address = ip_param;
    
    -- Clear failed login attempts
    UPDATE failed_login_attempts 
    SET blocked_until = NULL 
    WHERE ip_address = ip_param;
    
    -- Clear rate limit violations
    UPDATE rate_limit_violations 
    SET blocked_until = NULL 
    WHERE ip_address = ip_param;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;
