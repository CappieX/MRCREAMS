-- Migration: Create Support Ticket Management System
-- Version: 008
-- Description: Complete support ticket system with categories, activities, agents, and satisfaction surveys

-- 1. TICKET CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS ticket_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color
    is_active BOOLEAN DEFAULT true,
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    category_id UUID REFERENCES ticket_categories(id),
    assigned_agent_id UUID REFERENCES users(id),
    requester_id UUID REFERENCES users(id) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    first_response_at TIMESTAMP,
    
    -- Metrics
    response_time_minutes INTEGER,
    resolution_time_minutes INTEGER,
    satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
    
    -- Metadata
    source VARCHAR(20) DEFAULT 'web' CHECK (source IN ('web', 'email', 'phone', 'api', 'chat')),
    tags TEXT[], -- Array of tags
    attachments TEXT[], -- Array of file URLs
    custom_fields JSONB
);

-- 3. TICKET ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS ticket_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    activity_type VARCHAR(30) CHECK (activity_type IN ('comment', 'status_change', 'assignment', 'priority_change', 'internal_note', 'attachment', 'tag_added')),
    content TEXT,
    metadata JSONB, -- Stores old/new values for changes
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. SUPPORT AGENTS TABLE (Extends users)
CREATE TABLE IF NOT EXISTS support_agents (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    max_tickets INTEGER DEFAULT 10,
    specialization_tags TEXT[],
    is_available BOOLEAN DEFAULT true,
    current_ticket_count INTEGER DEFAULT 0,
    performance_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CUSTOMER SATISFACTION SURVEYS TABLE
CREATE TABLE IF NOT EXISTS satisfaction_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES support_tickets(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TICKET SLA CONFIGURATIONS TABLE
CREATE TABLE IF NOT EXISTS ticket_sla_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    first_response_minutes INTEGER NOT NULL,
    resolution_minutes INTEGER NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(priority, organization_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_agent ON support_tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_tickets_requester ON support_tickets(requester_id);
CREATE INDEX IF NOT EXISTS idx_tickets_organization ON support_tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_number ON support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_ticket ON ticket_activities(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_activities_created ON ticket_activities(created_at DESC);

-- Create function to auto-increment ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM support_tickets;
    
    NEW.ticket_number := 'TKT-' || LPAD(next_number::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating ticket numbers
CREATE TRIGGER set_ticket_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    WHEN (NEW.ticket_number IS NULL)
    EXECUTE FUNCTION generate_ticket_number();

-- Create function to update ticket updated_at timestamp
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating ticket timestamp
CREATE TRIGGER update_ticket_timestamp
    BEFORE UPDATE ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_timestamp();

-- Insert default ticket categories
INSERT INTO ticket_categories (name, description, color, is_active) VALUES
    ('Technical Issue', 'Technical problems and bugs', '#EF4444', true),
    ('Billing', 'Billing and payment inquiries', '#F59E0B', true),
    ('Feature Request', 'New feature suggestions', '#3B82F6', true),
    ('Account Management', 'Account-related questions', '#8B5CF6', true),
    ('General Inquiry', 'General questions and support', '#10B981', true),
    ('Bug Report', 'Software bugs and errors', '#DC2626', true),
    ('Integration', 'Third-party integration issues', '#6366F1', true),
    ('Training', 'Training and onboarding help', '#14B8A6', true)
ON CONFLICT DO NOTHING;

-- Insert default SLA configurations
INSERT INTO ticket_sla_configs (priority, first_response_minutes, resolution_minutes) VALUES
    ('critical', 60, 240),      -- 1 hour response, 4 hours resolution
    ('high', 240, 1440),         -- 4 hours response, 24 hours resolution
    ('medium', 1440, 4320),      -- 24 hours response, 3 days resolution
    ('low', 4320, 10080)         -- 3 days response, 7 days resolution
ON CONFLICT DO NOTHING;

-- Create view for ticket statistics
CREATE OR REPLACE VIEW ticket_statistics AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'open') as open_count,
    COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
    COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count,
    COUNT(*) FILTER (WHERE status = 'closed') as closed_count,
    COUNT(*) FILTER (WHERE status = 'escalated') as escalated_count,
    COUNT(*) FILTER (WHERE assigned_agent_id IS NULL) as unassigned_count,
    COUNT(*) FILTER (WHERE priority = 'critical') as critical_count,
    COUNT(*) FILTER (WHERE priority = 'high') as high_count,
    AVG(satisfaction_score) as avg_satisfaction,
    AVG(response_time_minutes) as avg_response_time,
    AVG(resolution_time_minutes) as avg_resolution_time
FROM support_tickets
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

COMMENT ON TABLE support_tickets IS 'Main support ticket tracking table';
COMMENT ON TABLE ticket_categories IS 'Ticket categorization for routing and reporting';
COMMENT ON TABLE ticket_activities IS 'Complete audit trail of all ticket actions';
COMMENT ON TABLE support_agents IS 'Support agent profiles and availability';
COMMENT ON TABLE satisfaction_surveys IS 'Customer satisfaction feedback';
