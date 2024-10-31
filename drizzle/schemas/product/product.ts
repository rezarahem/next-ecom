import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const Product = pgTable('product', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  addressName: varchar('address_name', { length: 50 }).notNull(),
  desc: text('desc'),
  price: integer('price').notNull(),
  discount: integer('discount'),
  inventory: integer('inventory').notNull(),
  buyLimit: integer('buy_limit').notNull(),
  image: text('image'),
});
