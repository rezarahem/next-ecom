import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const File = pgTable('file', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
});
