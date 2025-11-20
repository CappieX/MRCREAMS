-- W.C.R.E.A.M.S. Database Setup

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin user
INSERT INTO users (username, password, gender, is_admin) 
VALUES ('admin', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//qYt6DFRVVTPjbu', 'male', TRUE) 
ON CONFLICT (username) DO NOTHING;

-- Create the conflicts table

CREATE TABLE IF NOT EXISTS conflicts (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    conflict_reason VARCHAR(100) NOT NULL,
    time_consumption INTEGER NOT NULL CHECK (time_consumption > 0),
    fight_degree INTEGER NOT NULL CHECK (fight_degree >= 1 AND fight_degree <= 10),
    final_result TEXT,
    remark TEXT,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- First create admin user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
    INSERT INTO users (username, password, gender, is_admin) 
    VALUES ('admin', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//qYt6DFRVVTPjbu', 'male', TRUE);
  END IF;
END
$$;

-- Insert sample data for demonstration
INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, user_id) 
SELECT '2024-01-15', '20:30', 'Household Chores', 45, 7, 'I apologized and promised to help more', 'Triggered by dirty dishes in sink', id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, user_id) 
SELECT '2024-01-18', '19:15', 'Social Plans', 30, 5, 'Compromise reached', 'Discussion about weekend plans', id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, user_id) 
SELECT '2024-01-22', '21:00', 'Finances', 60, 8, 'Agreed to review budget together', 'Unexpected credit card bill', id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, user_id) 
SELECT '2024-01-25', '18:45', 'Miscommunication', 25, 4, 'Cleared up misunderstanding', 'Text message misinterpreted', id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, user_id) 
SELECT '2024-01-28', '20:00', 'In-Laws', 90, 6, 'Agreed to set boundaries', 'Weekly visit duration discussion', id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, user_id) 
SELECT '2024-02-01', '19:30', 'Personal Habits', 40, 3, 'Mutual understanding', 'Leaving clothes on chair', id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_conflicts_date ON conflicts(date);
CREATE INDEX IF NOT EXISTS idx_conflicts_reason ON conflicts(conflict_reason);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic updated_at
CREATE TRIGGER update_conflicts_updated_at 
    BEFORE UPDATE ON conflicts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();