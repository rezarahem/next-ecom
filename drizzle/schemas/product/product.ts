import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

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
