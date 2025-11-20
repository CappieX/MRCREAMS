const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Insert or update test user
    const query = `
      INSERT INTO users (username, password, gender, is_admin) 
      VALUES ('testuser', $1, 'male', false) 
      ON CONFLICT (username) 
      DO UPDATE SET password = $1 
      RETURNING *
    `;
    
    const result = await pool.query(query, [hashedPassword]);
    console.log('Test user created or updated:', result.rows[0]);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();