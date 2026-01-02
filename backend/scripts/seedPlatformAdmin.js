const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedPlatformAdmin() {
  try {
    console.log('Adding platform_admin to user_type enum...');
    try {
      await pool.query("ALTER TYPE user_type ADD VALUE IF NOT EXISTS 'platform_admin'");
    } catch (e) {
      console.log('Note: Could not add enum value (might already exist or strictly typed transaction):', e.message);
      // If this fails, we might need to recreate the type or just use 'super_admin' as fallback, 
      // but let's try to proceed.
    }

    // Get Organization ID
    let orgId = null;
    const orgResult = await pool.query("SELECT id FROM organizations WHERE code = 'MRCREAMS'");
    if (orgResult.rows.length > 0) {
      orgId = orgResult.rows[0].id;
      console.log('Found MRCREAMS Organization ID:', orgId);
    } else {
      console.warn('⚠️ MRCREAMS Organization not found! User will be created without organization.');
    }

    const email = 'platform@mrcreams.com';
    const password = 'PlatformAdmin123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating Platform Admin user...');
    
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (userCheck.rows.length > 0) {
      console.log('Platform Admin already exists. Updating role and organization...');
      await pool.query(
        "UPDATE users SET user_type = 'platform_admin', password_hash = $1, organization_id = $2, is_active = true WHERE email = $3",
        [hashedPassword, orgId, email]
      );
    } else {
      await pool.query(
        `INSERT INTO users (
          email, password_hash, name, user_type, organization_id, is_active, email_verified, onboarding_completed
        ) VALUES ($1, $2, $3, 'platform_admin', $4, true, true, true)`,
        [email, hashedPassword, 'Platform Administrator', orgId]
      );
    }

    console.log('Platform Admin created successfully.');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Platform Admin:', error);
    process.exit(1);
  }
}

seedPlatformAdmin();
