import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';
import { ProductFile } from './product-file';
import { ProductCat } from './product-cat';

export const Product = pgTable('product', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  desc: text('desc'),
  price: integer('price'),
  discount: integer('discount'),
  inventory: integer('inventory'),
  buyLimit: integer('buy_limit'),
  thumb: text('thumb'),
  isActive: boolean('is_active').default(false),
});

export const ProductRel = relations(Product, ({ one, many }) => ({
  productFile: many(ProductFile),
  cat: many(ProductCat),
}));
