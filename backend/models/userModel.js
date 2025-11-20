const pool = require('../db');

const createUser = async (username, password, gender, isAdmin = false) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, gender, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, gender, is_admin',
      [username, password, gender, isAdmin]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    console.log(`Searching for user with username: ${username}`);
    // Case-insensitive username search
    const result = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    console.log(`User found: ${result.rows.length > 0 ? 'Yes' : 'No'}`);
    if (result.rows.length > 0) {
      console.log(`User details: id=${result.rows[0].id}, gender=${result.rows[0].gender}, is_admin=${result.rows[0].is_admin}`);
    }
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const result = await pool.query('SELECT id, username, gender, is_admin FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById
};