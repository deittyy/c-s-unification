import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { Pool as NodePool } from 'pg';
import ws from "ws";
import * as schema from "@shared/schema";

const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "NEON_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isNeon = databaseUrl.includes('neon.tech') || process.env.NEON_DATABASE_URL;

let pool: Pool | NodePool;
let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzleNode>;

if (isNeon) {
  neonConfig.webSocketConstructor = ws;
  neonConfig.fetchConnectionCache = true;
  pool = new Pool({ 
    connectionString: databaseUrl,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 25
  });
  db = drizzleNeon({ client: pool, schema });
} else {
  pool = new NodePool({ 
    connectionString: databaseUrl,
    max: 25,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });
  db = drizzleNode({ client: pool, schema });
}

export { pool, db };

export async function warmupDatabase() {
  try {
    console.log('Warming up database connection...');
    await db.execute('SELECT 1');
    console.log('Database connection ready!');
    return true;
  } catch (error) {
    console.error('Database warmup failed:', error);
    return false;
  }
}
