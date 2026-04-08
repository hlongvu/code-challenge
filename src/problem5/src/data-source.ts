import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Resource } from './entities/Resource';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Resource],
  migrations: [],
  subscribers: [],
});
