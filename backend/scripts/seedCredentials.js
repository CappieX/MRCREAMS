#!/usr/bin/env node

// Seed demo credentials for MR.CREAMS
// Requires PostgreSQL and migrations applied

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { query, closePool } = require('../config/database');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

async function ensureOrganization(code, name, domain = null) {
  const existing = await query('SELECT id FROM organizations WHERE code = $1', [code]);
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const res = await query(
    'INSERT INTO organizations (name, code, domain, industry, size, subscription_tier) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [name, code, domain, 'Healthcare Technology', '1-10', 'enterprise']
  );
  return res.rows[0].id;
}

async function ensureUser({ email, password, name, user_type, org_code, onboarding_completed = true, email_verified = true }) {
  const orgId = org_code ? (await ensureOrganization(org_code, org_code === 'MRCREAMS' ? 'MR.CREAMS Platform' : 'Demo Company', org_code === 'MRCREAMS' ? 'mrcreams.com' : 'demo.com')) : null;
  const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const sql = `
    INSERT INTO users (email, password_hash, name, user_type, organization_id, onboarding_completed, email_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      name = EXCLUDED.name,
      user_type = EXCLUDED.user_type,
      organization_id = EXCLUDED.organization_id,
      onboarding_completed = EXCLUDED.onboarding_completed,
      email_verified = EXCLUDED.email_verified
    RETURNING id, email, user_type
  `;

  const res = await query(sql, [email, password_hash, name, user_type, orgId, onboarding_completed, email_verified]);
  return res.rows[0];
}

async function run() {
  console.log('🔐 Seeding demo credentials...');

  // Ensure base orgs
  const mrcId = await ensureOrganization('MRCREAMS', 'MR.CREAMS Platform', 'mrcreams.com');
  const demoId = await ensureOrganization('DEMO', 'Demo Company', 'demo.com');
  console.log(`🏢 Organizations ready: MRCREAMS=${mrcId}, DEMO=${demoId}`);

  const users = [
    { email: 'superadmin@mrcreams.com', password: 'SuperAdmin@123', name: 'Super Administrator', user_type: 'super_admin', org_code: 'MRCREAMS' },
    { email: 'admin@mrcreams.com', password: 'Admin@123456', name: 'Platform Administrator', user_type: 'admin', org_code: 'MRCREAMS' },
    { email: 'support@mrcreams.com', password: 'Support@123', name: 'Support Agent', user_type: 'support', org_code: 'MRCREAMS' },
    { email: 'executive@mrcreams.com', password: 'Executive@123', name: 'Executive Director', user_type: 'executive', org_code: 'MRCREAMS' },
    { email: 'therapist@mrcreams.com', password: 'Therapist@123', name: 'Clinical Therapist', user_type: 'therapist', org_code: 'MRCREAMS' },
    { email: 'demo@mrcreams.com', password: 'Demo@12345', name: 'Demo User', user_type: 'individual', org_code: 'DEMO' }
  ];

  for (const u of users) {
    const result = await ensureUser(u);
    console.log(`✅ Upserted: ${result.email} (${result.user_type})`);
  }

  console.log('\n🎫 Professional login organization codes:');
  console.log('  • MRCREAMS-SUPER-001 → super_admin');
  console.log('  • MRCREAMS-ADMIN-001 → admin');
  console.log('  • MRCREAMS-SUPPORT-001 → support');
  console.log('  • MRCREAMS-THERAPIST-001 → therapist');
  console.log('  • MRCREAMS-EXECUTIVE-001 → executive');

  console.log('\n⚠️ Note: Change these passwords in production.');

  await closePool();
  console.log('🏁 Done.');
}

if (require.main === module) {
  run().catch(err => {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  });
}