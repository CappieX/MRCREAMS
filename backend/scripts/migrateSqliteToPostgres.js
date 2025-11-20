#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection
const pgPool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mr_creams_db',
  password: process.env.DB_PASSWORD || 'Admin@123',
  port: process.env.DB_PORT || 5432,
});

// SQLite connection
const sqlitePath = path.join(__dirname, '..', 'mrcreams.db');
const sqliteDb = new sqlite3.Database(sqlitePath);

async function migrateData() {
  const client = await pgPool.connect();
  
  try {
    console.log('Starting data migration from SQLite to PostgreSQL...');
    
    // Check if SQLite database exists
    if (!fs.existsSync(sqlitePath)) {
      console.log('SQLite database not found, skipping data migration');
      return;
    }
    
    // Migrate users
    console.log('Migrating users...');
    const users = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM users', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    for (const user of users) {
      try {
        await client.query(`
          INSERT INTO users (id, email, password_hash, name, user_type, onboarding_completed, email_verified, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          user.id,
          user.email,
          user.password_hash,
          user.name,
          user.user_type || 'individual',
          user.onboarding_completed || false,
          user.email_verified || false,
          user.created_at
        ]);
      } catch (error) {
        console.error(`Error migrating user ${user.email}:`, error.message);
      }
    }
    
    // Migrate conflicts
    console.log('Migrating conflicts...');
    const conflicts = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM conflicts', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    for (const conflict of conflicts) {
      try {
        await client.query(`
          INSERT INTO conflicts (id, user_id, date, time, conflict_reason, description, time_consumption, fight_degree, final_result, remark, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO NOTHING
        `, [
          conflict.id,
          conflict.user_id,
          conflict.date,
          conflict.time,
          conflict.conflict_reason,
          conflict.description || conflict.conflict_reason,
          conflict.time_consumption,
          conflict.fight_degree,
          conflict.final_result,
          conflict.remark,
          conflict.created_at,
          conflict.updated_at || conflict.created_at
        ]);
      } catch (error) {
        console.error(`Error migrating conflict ${conflict.id}:`, error.message);
      }
    }
    
    console.log('✅ Data migration completed successfully!');
    console.log(`Migrated ${users.length} users and ${conflicts.length} conflicts`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    sqliteDb.close();
    await pgPool.end();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };
