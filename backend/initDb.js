const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'wife_conflict_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

async function initializeDatabase() {
  try {
    // Drop existing tables if they exist
    await pool.query('DROP TABLE IF EXISTS conflicts CASCADE;');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create admin user
    await pool.query(`
      INSERT INTO users (username, password, gender, is_admin) 
      VALUES ('admin', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//qYt6DFRVVTPjbu', 'male', TRUE) 
      ON CONFLICT (username) DO NOTHING;
    `);
    
    // Create test user
    await pool.query(`
      INSERT INTO users (username, password, gender, is_admin) 
      VALUES ('testuser', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGq4V9//qYt6DFRVVTPjbu', 'female', FALSE) 
      ON CONFLICT (username) DO NOTHING;
    `);
    
    // Create conflicts table
    await pool.query(`
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
    `);
    
    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_conflicts_date ON conflicts(date);
      CREATE INDEX IF NOT EXISTS idx_conflicts_reason ON conflicts(conflict_reason);
    `);
    
    // Create update timestamp function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    
    // Create trigger
    await pool.query(`
      CREATE TRIGGER update_conflicts_updated_at 
          BEFORE UPDATE ON conflicts 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `);
    
    // Insert sample data
    const adminId = await pool.query('SELECT id FROM users WHERE username = \'admin\'');
    const adminUserId = adminId.rows[0].id;
    
    // Insert sample conflicts for admin
    await pool.query(`
      INSERT INTO conflicts (date, time, conflict_reason, time_consumption, fight_degree, final_result, remark, user_id) VALUES
      ('2024-01-15', '20:30', 'Household Chores', 45, 7, 'I apologized and promised to help more', 'Triggered by dirty dishes in sink', $1),
      ('2024-01-18', '19:15', 'Social Plans', 30, 5, 'Compromise reached', 'Discussion about weekend plans', $1),
      ('2024-01-22', '21:00', 'Finances', 60, 8, 'Agreed to review budget together', 'Unexpected credit card bill', $1),
      ('2024-01-25', '18:45', 'Miscommunication', 25, 4, 'Cleared up misunderstanding', 'Text message misinterpreted', $1),
      ('2024-01-28', '20:00', 'In-Laws', 90, 6, 'Agreed to set boundaries', 'Weekly visit duration discussion', $1),
      ('2024-02-01', '19:30', 'Personal Habits', 40, 3, 'Mutual understanding', 'Leaving clothes on chair', $1);
    `, [adminUserId]);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase();