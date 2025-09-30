import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;
neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "NEON_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: databaseUrl,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});
export const db = drizzle({ client: pool, schema });

export async function warmupDatabase() {
  try {
    console.log('Warming up database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection ready!');
    return true;
  } catch (error) {
    console.error('Database warmup failed:', error);
    return false;
  }
}