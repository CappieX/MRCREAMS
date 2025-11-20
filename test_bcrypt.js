const bcrypt = require('bcryptjs');

async function testBcrypt() {
  const password = 'MrCreams!2024';
  const hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeehPCm3YgI1dq9pO';

  console.log('Testing password:', password);
  console.log('Testing hash:', hash);

  try {
    const isValid = await bcrypt.compare(password, hash);
    console.log('bcrypt.compare result:', isValid);

    if (!isValid) {
      console.log('Hash does not match. Generating new hash...');
      const newHash = await bcrypt.hash(password, 12);
      console.log('New hash:', newHash);
    } else {
      console.log('Hash is valid!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testBcrypt();
