/**
 * Jest setup file for MR.CREAMS backend testing
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'sqlite::memory:';

// Increase timeout for tests
jest.setTimeout(10000);

// Global teardown
afterAll(async () => {
  // Clean up any global resources
});