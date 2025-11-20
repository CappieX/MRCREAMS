const bcrypt = require('bcryptjs');
const { createUser, getUserByUsername, getUserById } = require('../models/userModel');

const AdminManager = {
  // Create super admin credentials
  superAdminCredentials: {
    username: 'superadmin',
    password: 'MR.CREAMS@2024!',
    gender: 'other',
    isAdmin: true
  },

  // Create additional admin accounts
  additionalAdmins: [
    {
      username: 'admin',
      password: 'Admin@123',
      gender: 'male',
      isAdmin: true
    },
    {
      username: 'harmonyguide',
      password: 'Harmony@2024!',
      gender: 'female',
      isAdmin: true
    }
  ],

  // Create all admin accounts
  async createAllAdmins() {
    console.log('🔐 MR.CREAMS Admin Account Management\n');
    console.log('='.repeat(60));
    
    // Create super admin
    await this.createAdmin(this.superAdminCredentials, 'Super Admin');
    
    // Create additional admins
    for (const admin of this.additionalAdmins) {
      await this.createAdmin(admin, 'Admin');
    }
    
    console.log('='.repeat(60));
    console.log('✅ All admin accounts processed!');
    console.log('🌐 Access URLs:');
    console.log('Frontend: http://localhost:3000');
    console.log('Backend API: http://localhost:5001');
    console.log('System Harmony Admin: http://localhost:3000/system-harmony');
  },

  // Create individual admin account
  async createAdmin(credentials, type) {
    try {
      console.log(`\n📋 Creating ${type} Account...`);
      
      // Check if admin already exists
      const existingAdmin = await getUserByUsername(credentials.username);
      if (existingAdmin) {
        console.log(`✅ ${type} already exists!`);
        console.log(`   Username: ${credentials.username}`);
        console.log(`   Password: ${credentials.password}`);
        console.log(`   Admin Status: ${existingAdmin.is_admin ? 'Yes' : 'No'}`);
        return existingAdmin;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(credentials.password, salt);
      
      // Create admin user
      const newAdmin = await createUser(
        credentials.username,
        hashedPassword,
        credentials.gender,
        credentials.isAdmin
      );
      
      console.log(`🎉 ${type} Account Created Successfully!`);
      console.log(`   Username: ${credentials.username}`);
      console.log(`   Password: ${credentials.password}`);
      console.log(`   Admin Status: ${credentials.isAdmin ? 'Yes' : 'No'}`);
      console.log(`   User ID: ${newAdmin.id}`);
      
      return newAdmin;
      
    } catch (error) {
      console.error(`❌ Error creating ${type}:`, error.message);
      return null;
    }
  },

  // Display all admin credentials
  displayCredentials() {
    console.log('\n🔐 MR.CREAMS ADMIN CREDENTIALS');
    console.log('='.repeat(60));
    
    console.log('\n🛡️  SUPER ADMIN:');
    console.log(`   Username: ${this.superAdminCredentials.username}`);
    console.log(`   Password: ${this.superAdminCredentials.password}`);
    console.log(`   Access: Full System Control`);
    
    console.log('\n👥 ADDITIONAL ADMINS:');
    this.additionalAdmins.forEach((admin, index) => {
      console.log(`   ${index + 1}. Username: ${admin.username}`);
      console.log(`      Password: ${admin.password}`);
      console.log(`      Access: System Harmony Management`);
    });
    
    console.log('\n🌐 ACCESS POINTS:');
    console.log('   Frontend Dashboard: http://localhost:3000');
    console.log('   System Harmony Admin: http://localhost:3000/system-harmony');
    console.log('   Backend API: http://localhost:5001');
    console.log('   API Documentation: http://localhost:5001/api');
    
    console.log('\n⚠️  SECURITY NOTES:');
    console.log('   • Change default passwords in production');
    console.log('   • Use strong, unique passwords');
    console.log('   • Enable two-factor authentication');
    console.log('   • Regular security audits recommended');
    
    console.log('='.repeat(60));
  }
};

// Run if called directly
if (require.main === module) {
  AdminManager.createAllAdmins()
    .then(() => {
      AdminManager.displayCredentials();
      console.log('\n✅ Admin setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = AdminManager;
