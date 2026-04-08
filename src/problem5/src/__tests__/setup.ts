import 'reflect-metadata';
import { AppDataSource } from '../data-source';

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
  // Initialize the database connection for tests
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

// Global test teardown
afterAll(async () => {
  // Close the database connection after all tests
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Clean up data after each test
afterEach(async () => {
  // Clear all tables after each test
  if (AppDataSource.isInitialized) {
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.clear();
    }
  }
});
