-- Reporting Dashboard Tables Migration
-- This migration adds tables for reporting dashboards and scheduled reports

-- Report schedules table for automated reporting
CREATE TABLE IF NOT EXISTS report_schedules (
    id VARCHAR(50) PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL,
    organization_id UUID,
    frequency VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
    recipients JSONB NOT NULL, -- Array of email addresses
    format VARCHAR(20) NOT NULL DEFAULT 'pdf', -- 'pdf', 'excel', 'csv', 'json'
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Report generation logs
CREATE TABLE IF NOT EXISTS report_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id VARCHAR(50) REFERENCES report_schedules(id),
    report_type VARCHAR(100) NOT NULL,
    organization_id UUID,
    user_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'generating', 'completed', 'failed'
    format VARCHAR(20) NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    generation_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Report templates table
CREATE TABLE IF NOT EXISTS report_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    report_type VARCHAR(100) NOT NULL,
    template_config JSONB NOT NULL, -- Template configuration and layout
    roles JSONB NOT NULL, -- Allowed roles for this template
    time_ranges JSONB NOT NULL, -- Available time ranges
    formats JSONB NOT NULL, -- Available export formats
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard widgets configuration
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    widget_type VARCHAR(100) NOT NULL, -- 'chart', 'metric', 'table', 'insight'
    widget_config JSONB NOT NULL, -- Widget configuration and data source
    position_x INTEGER NOT NULL DEFAULT 0,
    position_y INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 3,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report subscriptions (for users who want to receive specific reports)
CREATE TABLE IF NOT EXISTS report_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    report_type VARCHAR(100) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    format VARCHAR(20) NOT NULL DEFAULT 'pdf',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, report_type)
);

-- Report access logs for audit trail
CREATE TABLE IF NOT EXISTS report_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    report_type VARCHAR(100) NOT NULL,
    report_id VARCHAR(100), -- ID of the specific report accessed
    action VARCHAR(50) NOT NULL, -- 'view', 'download', 'export'
    format VARCHAR(20),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_schedules_organization_id ON report_schedules(organization_id);
CREATE INDEX IF NOT EXISTS idx_report_schedules_next_run ON report_schedules(next_run);
CREATE INDEX IF NOT EXISTS idx_report_schedules_is_active ON report_schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_report_logs_schedule_id ON report_logs(schedule_id);
CREATE INDEX IF NOT EXISTS idx_report_logs_status ON report_logs(status);
CREATE INDEX IF NOT EXISTS idx_report_logs_created_at ON report_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_user_id ON dashboard_widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_widget_type ON dashboard_widgets(widget_type);
CREATE INDEX IF NOT EXISTS idx_report_subscriptions_user_id ON report_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_report_subscriptions_is_active ON report_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_report_access_logs_user_id ON report_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_report_access_logs_created_at ON report_access_logs(created_at);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_report_templates_updated_at BEFORE UPDATE ON report_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_widgets_updated_at BEFORE UPDATE ON dashboard_widgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_subscriptions_updated_at BEFORE UPDATE ON report_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default report templates
INSERT INTO report_templates (id, name, description, report_type, template_config, roles, time_ranges, formats, created_by) VALUES
('executive-summary', 'Executive Summary', 'High-level overview of platform performance and key metrics', 'executive', 
 '{"layout": "dashboard", "sections": ["user_metrics", "platform_metrics", "therapist_metrics", "financial_metrics"]}',
 '["admin"]',
 '["7d", "30d", "90d", "1y"]',
 '["pdf", "excel", "csv", "json"]',
 (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),

('therapist-performance', 'Therapist Performance Report', 'Detailed analysis of therapist performance and client outcomes', 'therapist',
 '{"layout": "detailed", "sections": ["session_metrics", "client_metrics", "performance_metrics", "engagement_metrics"]}',
 '["therapist", "admin"]',
 '["7d", "30d", "90d"]',
 '["pdf", "excel", "csv", "json"]',
 (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),

('client-progress', 'Client Progress Report', 'Comprehensive analysis of client progress and therapeutic outcomes', 'client',
 '{"layout": "progress", "sections": ["emotion_progress", "conflict_resolution", "session_attendance", "goal_achievement"]}',
 '["therapist", "client", "admin"]',
 '["7d", "30d", "90d"]',
 '["pdf", "excel", "csv", "json"]',
 (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1)),

('engagement-analytics', 'Engagement Analytics', 'User engagement patterns and platform usage analytics', 'engagement',
 '{"layout": "analytics", "sections": ["user_engagement", "feature_usage", "retention_analysis", "growth_metrics"]}',
 '["admin"]',
 '["7d", "30d", "90d", "1y"]',
 '["excel", "csv", "json"]',
 (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1))
ON CONFLICT (id) DO NOTHING;
