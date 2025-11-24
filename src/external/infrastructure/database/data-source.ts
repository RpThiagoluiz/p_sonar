/* eslint-disable no-undef */
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from './entities/category.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'products',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [ProductEntity, CategoryEntity],
  migrations: ['src/external/infrastructure/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
