const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updateAdminPassword() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    // Generate hashed password for Admin@123
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);
    
    // Update admin user password
    const query = `
      UPDATE users 
      SET password = $1 
      WHERE username = 'admin'
      RETURNING *
    `;
    
    const result = await pool.query(query, [hashedPassword]);
    console.log('Admin password updated successfully:', result.rows[0]);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await pool.end();
  }
}

updateAdminPassword();