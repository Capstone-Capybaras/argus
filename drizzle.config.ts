import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  dbCredentials: {
    url: `.env.${process.env.DATABASE_URL}`,
  },
});
