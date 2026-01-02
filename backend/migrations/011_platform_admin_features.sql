-- Feature Flags Table
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    rules JSONB DEFAULT '{}', -- Targeting rules (e.g., percentage rollout, specific users)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Initial Feature Flags
INSERT INTO feature_flags (key, name, description, is_enabled) VALUES
('maintenance_mode', 'Maintenance Mode', 'Put the system in maintenance mode', false),
('new_analytics', 'New Analytics Dashboard', 'Enable the new analytics dashboard', true),
('beta_features', 'Beta Features', 'Enable beta features for testing', false)
ON CONFLICT (key) DO NOTHING;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_flags_updated_at
    BEFORE UPDATE ON feature_flags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
