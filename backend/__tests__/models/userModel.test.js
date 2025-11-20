/**
 * User Model Tests
 */

const userModel = require('../../models/userModel');

// Mock the database connection
jest.mock('../../db', () => ({
  query: jest.fn()
}));

const db = require('../../db');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      // Mock database response
      const mockUser = { id: 1, email: 'test@example.com', role: 'client' };
      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await userModel.findByEmail('test@example.com');
      
      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = $1'),
        ['test@example.com']
      );
    });

    it('should return null if user not found', async () => {
      // Mock empty database response
      db.query.mockResolvedValue({ rows: [] });

      const result = await userModel.findByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Mock database response for user creation
      const newUser = { 
        id: 1, 
        email: 'new@example.com', 
        name: 'New User',
        role: 'client'
      };
      db.query.mockResolvedValue({ rows: [newUser] });

      const userData = {
        email: 'new@example.com',
        password: 'hashedPassword123',
        name: 'New User',
        role: 'client'
      };

      const result = await userModel.create(userData);
      
      expect(result).toEqual(newUser);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([
          'new@example.com',
          'hashedPassword123',
          'New User',
          'client'
        ])
      );
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      // Mock database response
      const mockUser = { id: 1, email: 'test@example.com', role: 'client' };
      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await userModel.findById(1);
      
      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        [1]
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // Mock database response for user update
      const updatedUser = { 
        id: 1, 
        email: 'updated@example.com', 
        name: 'Updated User',
        role: 'client'
      };
      db.query.mockResolvedValue({ rows: [updatedUser] });

      const userData = {
        email: 'updated@example.com',
        name: 'Updated User'
      };

      const result = await userModel.update(1, userData);
      
      expect(result).toEqual(updatedUser);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET'),
        expect.arrayContaining([
          'updated@example.com',
          'Updated User',
          1
        ])
      );
    });
  });
});