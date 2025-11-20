const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api/auth';

async function testAuthentication() {
  console.log('🔍 Testing W.C.R.E.A.M.S Authentication System\n');
  
  try {
    // Test 1: Login with admin credentials
    console.log('1. Testing admin login...');
    const adminLogin = await axios.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    console.log('   User:', adminLogin.data.user.username, '| Admin:', adminLogin.data.user.isAdmin);
    
    // Test 2: Login with testuser credentials
    console.log('\n2. Testing testuser login...');
    const testLogin = await axios.post(`${BASE_URL}/login`, {
      username: 'testuser',
      password: 'password123'
    });
    console.log('✅ Test user login successful');
    console.log('   User:', testLogin.data.user.username, '| Admin:', testLogin.data.user.isAdmin);
    
    // Test 3: Test case-insensitive login
    console.log('\n3. Testing case-insensitive login...');
    const caseLogin = await axios.post(`${BASE_URL}/login`, {
      username: 'ADMIN',
      password: 'admin123'
    });
    console.log('✅ Case-insensitive login successful');
    
    // Test 4: Test invalid credentials
    console.log('\n4. Testing invalid credentials...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        username: 'admin',
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed with invalid credentials');
    } catch (error) {
      console.log('✅ Invalid credentials properly rejected:', error.response.data.error);
    }
    
    // Test 5: Test token validation
    console.log('\n5. Testing token validation...');
    const token = adminLogin.data.token;
    const meResponse = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Token validation successful');
    console.log('   Authenticated user:', meResponse.data.user.username);
    
    // Test 6: Test registration
    console.log('\n6. Testing user registration...');
    const randomUsername = `newuser${Date.now()}`;
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      username: randomUsername,
      password: 'NewPass123!',
      gender: 'female'
    });
    console.log('✅ User registration successful');
    console.log('   New user:', registerResponse.data.user.username);
    
    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthentication();