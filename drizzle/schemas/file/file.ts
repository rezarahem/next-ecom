import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { ProductFile } from '../product/product-file';
import { relations } from 'drizzle-orm';

export const File = pgTable('file', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
});


export const FileRel = relations(File, ({ one, many }) => ({
  productFile: many(ProductFile),
}));