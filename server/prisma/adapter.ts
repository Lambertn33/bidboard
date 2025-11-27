// prisma/adapter.ts
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

export function createMariaDbAdapter() {
  return new PrismaMariaDb({
    host: process.env.DB_HOST ?? 'db',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USERNAME ?? 'taskbid',
    password: process.env.DB_PASSWORD ?? 'taskbid',
    database: process.env.DB_NAME ?? 'taskbid',
    connectionLimit: 10,
  });
}
