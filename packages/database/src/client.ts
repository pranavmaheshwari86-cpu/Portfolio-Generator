import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDatabase(connectionString?: string) {
  if (dbInstance) return dbInstance;

  const connUrl = connectionString || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/portfolio_ai';
  client = postgres(connUrl, { max: 10 });
  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

export type AppDatabase = ReturnType<typeof getDatabase>;
