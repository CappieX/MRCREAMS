const bcrypt = require('bcryptjs');
const { createUser, getUserByUsername } = require('../models/userModel');

const createSuperAdmin = async () => {
  try {
    console.log('🔐 Creating MR.CREAMS Super Admin Account...\n');
    
    const superAdminCredentials = {
      username: 'superadmin',
      password: 'MR.CREAMS@2024!',
      gender: 'other',
      isAdmin: true
    };
    
    // Check if super admin already exists
    const existingAdmin = await getUserByUsername(superAdminCredentials.username);
    if (existingAdmin) {
      console.log('✅ Super Admin already exists!');
      console.log(`Username: ${superAdminCredentials.username}`);
      console.log(`Password: ${superAdminCredentials.password}`);
      console.log(`Admin Status: ${existingAdmin.is_admin ? 'Yes' : 'No'}`);
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(superAdminCredentials.password, salt);
    
    // Create super admin user
    const newAdmin = await createUser(
      superAdminCredentials.username,
      hashedPassword,
      superAdminCredentials.gender,
      superAdminCredentials.isAdmin
    );
    
    console.log('🎉 Super Admin Account Created Successfully!');
    console.log('='.repeat(50));
    console.log('📋 SUPER ADMIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log(`👤 Username: ${superAdminCredentials.username}`);
    console.log(`🔑 Password: ${superAdminCredentials.password}`);
    console.log(`👥 Gender: ${superAdminCredentials.gender}`);
    console.log(`🛡️  Admin Status: ${superAdminCredentials.isAdmin ? 'Yes' : 'No'}`);
    console.log(`🆔 User ID: ${newAdmin.id}`);
    console.log('='.repeat(50));
    console.log('🌐 Access URLs:');
    console.log('Frontend: http://localhost:3000');
    console.log('Backend API: http://localhost:5001');
    console.log('System Harmony Admin: http://localhost:3000/system-harmony');
    console.log('='.repeat(50));
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('This account has full administrative access to MR.CREAMS.');
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  }
};

// Run if called directly
if (require.main === module) {
  createSuperAdmin().then(() => {
    console.log('\n✅ Super Admin setup complete!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { createSuperAdmin };
