
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const migrationPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});

const migrateDb = drizzle(migrationPool);

const main = async () => {
  try {
    await migrate(migrateDb, { migrationsFolder: './migrations' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed!', error);
    process.exit(1);
  } finally {
    await migrationPool.end();
  }
  process.exit(0);
};

main().catch(e => {
  console.error('Unexpected error during migration process:', e);
  process.exit(1);
});
