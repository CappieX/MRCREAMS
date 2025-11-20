-- API Marketplace Tables Migration
-- This migration adds tables for public API infrastructure, key management, and webhooks

-- API keys table for public API access
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(200) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of the API key
    permissions JSONB NOT NULL DEFAULT '[]', -- Array of permissions
    rate_limit INTEGER NOT NULL DEFAULT 1000, -- Requests per hour
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE
);

-- API usage logs for tracking and rate limiting
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    response_time_ms INTEGER NOT NULL,
    status_code INTEGER NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhooks table for event notifications
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    events JSONB NOT NULL, -- Array of event types to listen for
    secret VARCHAR(255), -- Secret for webhook signature verification
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_triggered TIMESTAMP WITH TIME ZONE,
    failure_count INTEGER NOT NULL DEFAULT 0,
    last_failure_at TIMESTAMP WITH TIME ZONE
);

-- Webhook delivery logs
CREATE TABLE IF NOT EXISTS webhook_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivery_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API applications table for third-party integrations
CREATE TABLE IF NOT EXISTS api_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    website_url VARCHAR(500),
    redirect_uri VARCHAR(500),
    client_id VARCHAR(100) NOT NULL UNIQUE,
    client_secret_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of client secret
    scopes JSONB NOT NULL DEFAULT '[]', -- Array of OAuth scopes
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OAuth authorization codes
CREATE TABLE IF NOT EXISTS oauth_authorization_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    client_id VARCHAR(100) NOT NULL REFERENCES api_applications(client_id),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scopes JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OAuth access tokens
CREATE TABLE IF NOT EXISTS oauth_access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of the token
    client_id VARCHAR(100) NOT NULL REFERENCES api_applications(client_id),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scopes JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API documentation versions
CREATE TABLE IF NOT EXISTS api_documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content JSONB NOT NULL, -- OpenAPI/Swagger specification
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(version)
);

-- API rate limit configurations
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    rate_limit INTEGER NOT NULL, -- Requests per window
    window_size INTEGER NOT NULL, -- Window size in seconds
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(endpoint, method)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_key_id ON api_usage_logs(key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks(is_active);
CREATE INDEX IF NOT EXISTS idx_webhook_delivery_logs_webhook_id ON webhook_delivery_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_delivery_logs_created_at ON webhook_delivery_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_applications_user_id ON api_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_api_applications_client_id ON api_applications(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_code ON oauth_authorization_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_authorization_codes_client_id ON oauth_authorization_codes(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_token_hash ON oauth_access_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_client_id ON oauth_access_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_oauth_access_tokens_user_id ON oauth_access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_api_documentation_version ON api_documentation(version);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_endpoint ON api_rate_limits(endpoint);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_applications_updated_at BEFORE UPDATE ON api_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_documentation_updated_at BEFORE UPDATE ON api_documentation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_rate_limits_updated_at BEFORE UPDATE ON api_rate_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default API rate limits
INSERT INTO api_rate_limits (endpoint, method, rate_limit, window_size) VALUES
('*', 'GET', 1000, 3600), -- 1000 requests per hour for all GET endpoints
('*', 'POST', 500, 3600), -- 500 requests per hour for all POST endpoints
('*', 'PUT', 200, 3600), -- 200 requests per hour for all PUT endpoints
('*', 'DELETE', 100, 3600), -- 100 requests per hour for all DELETE endpoints
('/api/public/emotions/analyze', 'POST', 100, 3600), -- 100 emotion analysis requests per hour
('/api/public/analytics/*', 'GET', 200, 3600), -- 200 analytics requests per hour
('/api/public/conflicts/analyze', 'POST', 50, 3600) -- 50 conflict analysis requests per hour
ON CONFLICT (endpoint, method) DO NOTHING;

-- Insert default API documentation
INSERT INTO api_documentation (version, title, description, content, created_by) VALUES
('v1', 'MR.CREAMS Public API v1', 'AI-Powered Emotional Intelligence Platform API', 
 '{"openapi": "3.0.0", "info": {"title": "MR.CREAMS Public API", "version": "v1", "description": "AI-Powered Emotional Intelligence Platform API"}, "servers": [{"url": "https://api.mrcreams.com/api/public", "description": "Production server"}], "paths": {}}',
 (SELECT id FROM users WHERE user_type = 'admin' LIMIT 1))
ON CONFLICT (version) DO NOTHING;
