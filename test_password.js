// Test script for professional login
const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = 'MrCreams!2024';
  const storedHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO';

  console.log('Testing password:', plainPassword);
  console.log('Stored hash:', storedHash);

  const isValid = await bcrypt.compare(plainPassword, storedHash);
  console.log('Password valid:', isValid);

  // Generate new hash for MrCreams!2024
  const newHash = await bcrypt.hash(plainPassword, 12);
  console.log('New hash for MrCreams!2024:', newHash);
}

testPassword();
