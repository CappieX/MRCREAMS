-- Migration 003: Seed initial data and create sample users
-- This migration creates initial data for development and testing

-- Insert sample organizations
INSERT INTO organizations (name, code, domain, industry, size, subscription_tier) VALUES
('Demo Company', 'DEMO', 'demo.com', 'Technology', '51-200', 'premium'),
('Healthcare Partners', 'HCP', 'healthcarepartners.com', 'Healthcare', '201-500', 'enterprise'),
('Family Wellness Center', 'FWC', 'familywellness.com', 'Healthcare', '11-50', 'basic')
ON CONFLICT (code) DO NOTHING;

-- Insert sample users with different roles
INSERT INTO users (email, password_hash, name, user_type, organization_id, onboarding_completed, email_verified) VALUES
-- Super Admin
('superadmin@mrcreams.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Super Administrator', 'super_admin', (SELECT id FROM organizations WHERE code = 'MRCREAMS'), true, true),

-- Regular Admin
('admin@mrcreams.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Platform Administrator', 'admin', (SELECT id FROM organizations WHERE code = 'MRCREAMS'), true, true),

-- IT Admin
('itadmin@mrcreams.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'IT Administrator', 'it_admin', (SELECT id FROM organizations WHERE code = 'MRCREAMS'), true, true),

-- Support Agent
('support@mrcreams.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Support Agent', 'support', (SELECT id FROM organizations WHERE code = 'MRCREAMS'), true, true),

-- Executive
('executive@mrcreams.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Executive Director', 'executive', (SELECT id FROM organizations WHERE code = 'MRCREAMS'), true, true),

-- Therapists
('dr.smith@familywellness.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Dr. Sarah Smith', 'therapist', (SELECT id FROM organizations WHERE code = 'FWC'), true, true),
('dr.johnson@familywellness.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Dr. Michael Johnson', 'therapist', (SELECT id FROM organizations WHERE code = 'FWC'), true, true),
('dr.williams@healthcarepartners.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Dr. Emily Williams', 'therapist', (SELECT id FROM organizations WHERE code = 'HCP'), true, true),

-- Individual Users
('john.doe@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'John Doe', 'individual', (SELECT id FROM organizations WHERE code = 'DEMO'), true, true),
('jane.smith@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Jane Smith', 'individual', (SELECT id FROM organizations WHERE code = 'DEMO'), true, true),
('couple@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO', 'Couple User', 'individual', (SELECT id FROM organizations WHERE code = 'DEMO'), true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert user metadata
INSERT INTO user_metadata (user_id, metadata) VALUES
-- Therapist metadata
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), '{"licenseNumber": "LMFT12345", "yearsOfExperience": "8", "credentials": ["LMFT", "LCSW"], "specializations": ["Couples Therapy", "Family Counseling"], "status": "verified"}'::jsonb),
((SELECT id FROM users WHERE email = 'dr.johnson@familywellness.com'), '{"licenseNumber": "LMFT67890", "yearsOfExperience": "12", "credentials": ["LMFT", "PhD"], "specializations": ["Marriage Counseling", "Trauma Therapy"], "status": "verified"}'::jsonb),
((SELECT id FROM users WHERE email = 'dr.williams@healthcarepartners.com'), '{"licenseNumber": "LCSW11111", "yearsOfExperience": "6", "credentials": ["LCSW"], "specializations": ["Individual Therapy", "Group Therapy"], "status": "verified"}'::jsonb),

-- Individual user metadata
((SELECT id FROM users WHERE email = 'john.doe@demo.com'), '{"relationshipStatus": "Married", "age": "35", "partnerName": "Jane Smith", "relationshipDuration": "5 years"}'::jsonb),
((SELECT id FROM users WHERE email = 'jane.smith@demo.com'), '{"relationshipStatus": "Married", "age": "32", "partnerName": "John Doe", "relationshipDuration": "5 years"}'::jsonb),
((SELECT id FROM users WHERE email = 'couple@demo.com'), '{"relationshipStatus": "Committed", "age": "28", "relationshipDuration": "3 years"}'::jsonb),

-- Company metadata
((SELECT id FROM users WHERE email = 'executive@mrcreams.com'), '{"department": "Executive", "role": "CEO", "employeeId": "EMP001"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert therapist verifications
INSERT INTO therapist_verifications (user_id, status, license_number, license_state, years_experience, specializations, credentials, reviewed_by, reviewed_at) VALUES
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), 'approved', 'LMFT12345', 'CA', 8, ARRAY['Couples Therapy', 'Family Counseling'], ARRAY['LMFT', 'LCSW'], (SELECT id FROM users WHERE email = 'superadmin@mrcreams.com'), CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE email = 'dr.johnson@familywellness.com'), 'approved', 'LMFT67890', 'CA', 12, ARRAY['Marriage Counseling', 'Trauma Therapy'], ARRAY['LMFT', 'PhD'], (SELECT id FROM users WHERE email = 'superadmin@mrcreams.com'), CURRENT_TIMESTAMP),
((SELECT id FROM users WHERE email = 'dr.williams@healthcarepartners.com'), 'approved', 'LCSW11111', 'NY', 6, ARRAY['Individual Therapy', 'Group Therapy'], ARRAY['LCSW'], (SELECT id FROM users WHERE email = 'superadmin@mrcreams.com'), CURRENT_TIMESTAMP);

-- Insert therapist-client relationships
INSERT INTO therapist_clients (therapist_id, client_id, status, start_date, treatment_plan) VALUES
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM users WHERE email = 'john.doe@demo.com'), 'active', CURRENT_DATE - INTERVAL '3 months', '{"goals": ["Improve communication", "Resolve conflicts"], "approach": "Couples therapy", "frequency": "Weekly"}'::jsonb),
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM users WHERE email = 'jane.smith@demo.com'), 'active', CURRENT_DATE - INTERVAL '3 months', '{"goals": ["Improve communication", "Resolve conflicts"], "approach": "Couples therapy", "frequency": "Weekly"}'::jsonb),
((SELECT id FROM users WHERE email = 'dr.johnson@familywellness.com'), (SELECT id FROM users WHERE email = 'couple@demo.com'), 'active', CURRENT_DATE - INTERVAL '1 month', '{"goals": ["Build trust", "Enhance intimacy"], "approach": "Marriage counseling", "frequency": "Bi-weekly"}'::jsonb);

-- Insert sample conflicts
INSERT INTO conflicts (user_id, partner_id, date, time, conflict_reason, description, time_consumption, fight_degree, final_result, remark, status) VALUES
((SELECT id FROM users WHERE email = 'john.doe@demo.com'), (SELECT id FROM users WHERE email = 'jane.smith@demo.com'), '2024-01-15', '20:30:00', 'Household Chores', 'Disagreement about cleaning responsibilities and division of household tasks', 45, 7, 'I apologized and promised to help more around the house', 'Triggered by dirty dishes in sink', 'resolved'),
((SELECT id FROM users WHERE email = 'jane.smith@demo.com'), (SELECT id FROM users WHERE email = 'john.doe@demo.com'), '2024-01-18', '19:15:00', 'Social Plans', 'Discussion about weekend plans and social commitments', 30, 5, 'Compromise reached - we will alternate weekends', 'Discussion about weekend plans', 'resolved'),
((SELECT id FROM users WHERE email = 'john.doe@demo.com'), (SELECT id FROM users WHERE email = 'jane.smith@demo.com'), '2024-01-22', '21:00:00', 'Finances', 'Unexpected credit card bill and budget discussion', 60, 8, 'Agreed to review budget together and set spending limits', 'Unexpected credit card bill', 'resolved'),
((SELECT id FROM users WHERE email = 'couple@demo.com'), NULL, '2024-01-25', '18:45:00', 'Miscommunication', 'Text message misinterpreted leading to hurt feelings', 25, 4, 'Cleared up misunderstanding through direct conversation', 'Text message misinterpreted', 'resolved'),
((SELECT id FROM users WHERE email = 'jane.smith@demo.com'), (SELECT id FROM users WHERE email = 'john.doe@demo.com'), '2024-01-28', '20:00:00', 'In-Laws', 'Weekly visit duration and boundaries discussion', 90, 6, 'Agreed to set boundaries with in-laws', 'Weekly visit duration discussion', 'resolved'),
((SELECT id FROM users WHERE email = 'john.doe@demo.com'), (SELECT id FROM users WHERE email = 'jane.smith@demo.com'), '2024-02-01', '19:30:00', 'Personal Habits', 'Leaving clothes on chair and personal space issues', 40, 3, 'Mutual understanding and compromise', 'Leaving clothes on chair', 'resolved');

-- Insert sample emotion check-ins
INSERT INTO emotion_checkins (user_id, primary_emotion, secondary_emotions, intensity, context, ai_analysis, ai_confidence, ai_recommendations) VALUES
((SELECT id FROM users WHERE email = 'john.doe@demo.com'), 'anxious', ARRAY['fear', 'sadness'], 6, 'Work stress affecting relationship', '{"dominant_emotion": "anxiety", "triggers": ["work pressure", "relationship tension"], "patterns": ["evening anxiety", "weekend recovery"]}', 0.87, ARRAY['Practice deep breathing', 'Schedule relaxation time', 'Communicate stress with partner']),
((SELECT id FROM users WHERE email = 'jane.smith@demo.com'), 'joy', ARRAY['excitement', 'calm'], 8, 'Successful day at work and quality time with partner', '{"dominant_emotion": "joy", "triggers": ["work success", "partner connection"], "patterns": ["positive momentum", "relationship satisfaction"]}', 0.92, ARRAY['Celebrate the positive moments', 'Share gratitude with partner', 'Plan more quality time']),
((SELECT id FROM users WHERE email = 'couple@demo.com'), 'calm', ARRAY['content', 'neutral'], 5, 'Peaceful evening together', '{"dominant_emotion": "calm", "triggers": ["peaceful environment", "partner presence"], "patterns": ["evening relaxation", "relationship stability"]}', 0.78, ARRAY['Maintain this peaceful atmosphere', 'Practice mindfulness together', 'Create more calm moments']);

-- Insert sample therapy sessions
INSERT INTO therapy_sessions (therapist_id, client_id, scheduled_at, duration_minutes, status, session_notes, homework_assigned, next_session_date) VALUES
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM users WHERE email = 'john.doe@demo.com'), CURRENT_DATE + INTERVAL '2 days', 60, 'scheduled', NULL, NULL, CURRENT_DATE + INTERVAL '9 days'),
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM users WHERE email = 'jane.smith@demo.com'), CURRENT_DATE + INTERVAL '2 days', 60, 'scheduled', NULL, NULL, CURRENT_DATE + INTERVAL '9 days'),
((SELECT id FROM users WHERE email = 'dr.johnson@familywellness.com'), (SELECT id FROM users WHERE email = 'couple@demo.com'), CURRENT_DATE + INTERVAL '5 days', 90, 'scheduled', NULL, NULL, CURRENT_DATE + INTERVAL '12 days'),
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM users WHERE email = 'john.doe@demo.com'), CURRENT_DATE - INTERVAL '7 days', 60, 'completed', 'Discussed communication patterns and identified triggers. Both partners showed good insight.', 'Practice active listening for 10 minutes daily', CURRENT_DATE + INTERVAL '2 days'),
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM users WHERE email = 'jane.smith@demo.com'), CURRENT_DATE - INTERVAL '7 days', 60, 'completed', 'Explored emotional responses and coping strategies. Jane showed progress in expressing needs.', 'Keep emotion journal for one week', CURRENT_DATE + INTERVAL '2 days');

-- Insert sample support tickets
INSERT INTO support_tickets (requester_id, assigned_agent_id, organization_id, title, description, category, priority, status, tags) VALUES
((SELECT id FROM users WHERE email = 'john.doe@demo.com'), (SELECT id FROM users WHERE email = 'support@mrcreams.com'), (SELECT id FROM organizations WHERE code = 'DEMO'), 'Cannot access emotion check-in feature', 'I am unable to submit my daily emotion check-in. The form keeps showing an error message.', 'Technical', 'medium', 'open', ARRAY['emotion-checkin', 'form-error']),
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM users WHERE email = 'support@mrcreams.com'), (SELECT id FROM organizations WHERE code = 'FWC'), 'Session scheduling issue', 'I cannot schedule sessions for next week. The calendar is not loading properly.', 'Technical', 'high', 'in_progress', ARRAY['scheduling', 'calendar', 'therapist']),
((SELECT id FROM users WHERE email = 'jane.smith@demo.com'), (SELECT id FROM users WHERE email = 'support@mrcreams.com'), (SELECT id FROM organizations WHERE code = 'DEMO'), 'Data export request', 'I need to export my conflict data for personal records. How can I do this?', 'Feature Request', 'low', 'resolved', ARRAY['data-export', 'privacy']);

-- Insert sample support ticket activities
INSERT INTO support_ticket_activities (ticket_id, user_id, activity_type, description, metadata) VALUES
((SELECT id FROM support_tickets WHERE title = 'Cannot access emotion check-in feature'), (SELECT id FROM users WHERE email = 'john.doe@demo.com'), 'created', 'Ticket created by user', '{"browser": "Chrome", "version": "120.0"}'::jsonb),
((SELECT id FROM support_tickets WHERE title = 'Cannot access emotion check-in feature'), (SELECT id FROM users WHERE email = 'support@mrcreams.com'), 'assigned', 'Ticket assigned to support agent', '{"assigned_to": "support@mrcreams.com"}'::jsonb),
((SELECT id FROM support_tickets WHERE title = 'Session scheduling issue'), (SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), 'created', 'Ticket created by therapist', '{"user_type": "therapist"}'::jsonb),
((SELECT id FROM support_tickets WHERE title = 'Data export request'), (SELECT id FROM users WHERE email = 'jane.smith@demo.com'), 'created', 'Ticket created by user', '{"request_type": "data_export"}'::jsonb),
((SELECT id FROM support_tickets WHERE title = 'Data export request'), (SELECT id FROM users WHERE email = 'support@mrcreams.com'), 'resolved', 'Provided instructions for data export feature', '{"resolution": "feature_available", "instructions_sent": true}'::jsonb);

-- Insert sample audit logs
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, organization_id) VALUES
((SELECT id FROM users WHERE email = 'superadmin@mrcreams.com'), 'user_created', 'users', (SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), '{"email": "dr.smith@familywellness.com", "user_type": "therapist"}', (SELECT id FROM organizations WHERE code = 'MRCREAMS')),
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), 'conflict_created', 'conflicts', (SELECT id FROM conflicts WHERE conflict_reason = 'Household Chores'), '{"conflict_reason": "Household Chores", "fight_degree": 7}', (SELECT id FROM organizations WHERE code = 'FWC')),
((SELECT id FROM users WHERE email = 'support@mrcreams.com'), 'ticket_assigned', 'support_tickets', (SELECT id FROM support_tickets WHERE title = 'Cannot access emotion check-in feature'), '{"assigned_agent": "support@mrcreams.com"}', (SELECT id FROM organizations WHERE code = 'MRCREAMS'));

-- Insert sample API keys for testing
INSERT INTO api_keys (user_id, organization_id, key_name, key_hash, permissions, rate_limit_per_hour) VALUES
((SELECT id FROM users WHERE email = 'superadmin@mrcreams.com'), (SELECT id FROM organizations WHERE code = 'MRCREAMS'), 'Admin API Key', '$2a$10$example.hash.for.api.key', ARRAY['read', 'write', 'admin'], 10000),
((SELECT id FROM users WHERE email = 'dr.smith@familywellness.com'), (SELECT id FROM organizations WHERE code = 'FWC'), 'Therapist API Key', '$2a$10$example.hash.for.therapist.key', ARRAY['read', 'write'], 1000),
((SELECT id FROM users WHERE email = 'john.doe@demo.com'), (SELECT id FROM organizations WHERE code = 'DEMO'), 'User API Key', '$2a$10$example.hash.for.user.key', ARRAY['read'], 100);

-- Insert sample webhooks
INSERT INTO webhooks (organization_id, url, events, secret, is_active) VALUES
((SELECT id FROM organizations WHERE code = 'DEMO'), 'https://demo.com/webhooks/mrcreams', ARRAY['conflict.created', 'emotion_checkin.submitted'], 'webhook_secret_demo', true),
((SELECT id FROM organizations WHERE code = 'FWC'), 'https://familywellness.com/webhooks/therapy', ARRAY['session.scheduled', 'session.completed'], 'webhook_secret_fwc', true);

-- Update sequences to avoid conflicts
SELECT setval('migrations_id_seq', 10, true);
