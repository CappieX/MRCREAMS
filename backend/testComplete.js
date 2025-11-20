const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testCompleteSystem() {
  console.log('🧪 Testing Complete System...');
  
  try {
    // Test 1: Admin Login
    console.log('\n1. Testing Admin Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'Admin@123'
    });
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      console.log('✅ Admin login successful');
      console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
      console.log('User info:', loginResponse.data.user);
      
      const token = loginResponse.data.token;
      
      // Test 2: Create Conflict
      console.log('\n2. Testing Conflict Creation...');
      const conflictData = {
        date: '2025-01-15',
        time: '14:30:00',
        conflict_reason: 'Test Conflict - System Verification',
        time_consumption: 25,
        fight_degree: 6,
        final_result: 'Resolved through testing',
        remark: 'This is a test conflict created by automated testing'
      };
      
      const conflictResponse = await axios.post(`${API_BASE_URL}/conflicts`, conflictData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (conflictResponse.status === 201) {
        console.log('✅ Conflict creation successful');
        console.log('Created conflict:', conflictResponse.data);
        
        // Test 3: Fetch Conflicts
        console.log('\n3. Testing Conflict Retrieval...');
        const fetchResponse = await axios.get(`${API_BASE_URL}/conflicts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (fetchResponse.status === 200) {
          console.log('✅ Conflict retrieval successful');
          console.log(`Found ${fetchResponse.data.length} conflicts`);
          
          // Test 4: Test User Login
          console.log('\n4. Testing Test User Login...');
          const testUserLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
            username: 'testuser',
            password: 'password123'
          });
          
          if (testUserLogin.status === 200) {
            console.log('✅ Test user login successful');
            console.log('Test user info:', testUserLogin.data.user);
          } else {
            console.log('❌ Test user login failed');
          }
          
        } else {
          console.log('❌ Conflict retrieval failed');
        }
        
      } else {
        console.log('❌ Conflict creation failed');
      }
      
    } else {
      console.log('❌ Admin login failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
  
  console.log('\n🏁 Test completed');
}

testCompleteSystem();