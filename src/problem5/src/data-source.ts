import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Resource } from './entities/Resource';

// Determine database path based on environment
const databasePath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : (process.env.DATABASE_PATH || './database.sqlite');

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  synchronize: true,
  logging: false,
  entities: [Resource],
  migrations: [],
  subscribers: [],
});
