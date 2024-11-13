// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// const client = postgres(process.env.DATABASE_URL as string);
// export const db = drizzle(client, { schema });

import * as schema from '.';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
