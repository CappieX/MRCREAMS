-- Mobile API Support Tables Migration
-- This migration adds tables for mobile app support including device tokens and notification logs

-- Device tokens table for push notifications
CREATE TABLE IF NOT EXISTS device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    platform VARCHAR(50) NOT NULL DEFAULT 'mobile',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, token)
);

-- Notification logs table for tracking push notification delivery
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    success_count INTEGER NOT NULL DEFAULT 0,
    failure_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mobile app settings table
CREATE TABLE IF NOT EXISTS mobile_app_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    push_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    emotion_reminders_enabled BOOLEAN NOT NULL DEFAULT true,
    session_reminders_enabled BOOLEAN NOT NULL DEFAULT true,
    conflict_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
    reminder_frequency VARCHAR(50) NOT NULL DEFAULT 'daily',
    reminder_time TIME NOT NULL DEFAULT '09:00:00',
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Offline sync queue table for mobile apps
CREATE TABLE IF NOT EXISTS offline_sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    operation VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    data JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'synced', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Mobile app analytics table
CREATE TABLE IF NOT EXISTS mobile_app_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    app_version VARCHAR(50),
    platform VARCHAR(50) NOT NULL,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_active ON device_tokens(active);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_mobile_app_settings_user_id ON mobile_app_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_user_id ON offline_sync_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_status ON offline_sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_mobile_app_analytics_user_id ON mobile_app_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_app_analytics_event_type ON mobile_app_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_mobile_app_analytics_created_at ON mobile_app_analytics(created_at);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_device_tokens_updated_at BEFORE UPDATE ON device_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mobile_app_settings_updated_at BEFORE UPDATE ON mobile_app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
