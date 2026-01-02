const axios = require('axios');

const API_URL = 'http://localhost:5002/api';

const adminCreds = {
  email: 'admin@mrcreams.com',
  password: 'Admin@123456'
};

const platformCreds = {
  email: 'platform@mrcreams.com',
  password: 'PlatformAdmin@123'
};

const testUser = {
  email: 'delete_me_' + Date.now() + '@test.com',
  password: 'Password123!',
  name: 'Delete Me',
  userType: 'individual'
};

async function run() {
  try {
    console.log('🚀 Starting RBAC Verification...');

    // 1. Create a test user to delete
    console.log('\n1️⃣  Creating test user...');
    let testUserId;
    try {
      const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
      testUserId = registerRes.data.user.id;
      console.log('✅ Test user created:', testUserId);
    } catch (error) {
      console.error('❌ Failed to create test user:', error.response?.data || error.message);
      process.exit(1);
    }

    // 2. Login as Admin
    console.log('\n2️⃣  Logging in as Admin...');
    let adminToken;
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, adminCreds);
      adminToken = loginRes.data.token;
      console.log('✅ Admin logged in');
    } catch (error) {
      console.error('❌ Failed to login as Admin:', error.response?.data || error.message);
      process.exit(1);
    }

    // 3. Attempt to delete user as Admin (Should FAIL)
    console.log('\n3️⃣  Attempting to delete user as Admin (Expect 403)...');
    try {
      await axios.delete(`${API_URL}/admin/users/${testUserId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.error('❌ ERROR: Admin was able to delete user! RBAC failed.');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Success: Admin was denied access (403 Forbidden)');
        console.log('   Message:', error.response.data);
      } else {
        console.error('❌ Unexpected error:', error.response?.status, error.response?.data || error.message);
      }
    }

    // 4. Login as Platform Admin
    console.log('\n4️⃣  Logging in as Platform Admin...');
    let platformToken;
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, platformCreds);
      platformToken = loginRes.data.token;
      console.log('✅ Platform Admin logged in');
    } catch (error) {
      console.error('❌ Failed to login as Platform Admin:', error.response?.data || error.message);
      // If login fails, we can't proceed, but we already verified the negative case
      process.exit(1);
    }

    // 5. Attempt to delete user as Platform Admin (Should SUCCEED)
    console.log('\n5️⃣  Attempting to delete user as Platform Admin (Expect 200)...');
    try {
      // Note: Admin routes are protected by checkPermission('delete', 'User')
      // Platform Admin has 'manage', 'all' so it should pass.
      // However, we need to make sure platform admin can access /api/admin/users/:id
      // The previous code had `isAdmin` middleware which checked for 'platform_admin' in allowedRoles.
      // The NEW code uses `checkPermission('delete', 'User')`.
      // abilities.js says: if (user.user_type === 'super_admin' || user.user_type === 'platform_admin') can('manage', 'all');
      
      const deleteRes = await axios.delete(`${API_URL}/admin/users/${testUserId}`, {
        headers: { Authorization: `Bearer ${platformToken}` }
      });
      console.log('✅ Success: Platform Admin deleted the user.');
      console.log('   Response:', deleteRes.data);
    } catch (error) {
      console.error('❌ ERROR: Platform Admin failed to delete user:', error.response?.status, error.response?.data || error.message);
    }

    console.log('\n🏁 Verification Complete.');

  } catch (error) {
    console.error('Global error:', error);
  }
}

run();
