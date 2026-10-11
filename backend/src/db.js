import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}

// HTTP-based driver: no connection pool to keep warm, ideal for serverless.
export const sql = neon(process.env.DATABASE_URL);
