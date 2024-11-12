import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { Product } from './product';
import { File } from '../file/file';
import { relations } from 'drizzle-orm';

export const ProductFile = pgTable(
  'product-file',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => Product.id, { onDelete: 'cascade' }),
    fileId: integer('file_id')
      .notNull()
      .references(() => File.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.fileId] }) }),
);

export const ProductFileRel = relations(ProductFile, ({ one }) => ({
  product: one(Product, {
    fields: [ProductFile.productId],
    references: [Product.id],
  }),
  file: one(File, {
    fields: [ProductFile.fileId],
    references: [File.id],
  }),
}));
