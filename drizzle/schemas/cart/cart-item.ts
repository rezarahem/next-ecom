import { Product, User } from '@/drizzle';
import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const CartItem = pgTable(
  'cart-item',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => Product.id, { onDelete: 'cascade' }),
    userId: integer('card_id')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    inventory: integer('inventory').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.userId] }) }),
);

export const CartItemRel = relations(CartItem, ({ one, many }) => ({
  user: one(User, {
    fields: [CartItem.userId],
    references: [User.id],
  }),
  product: one(Product, {
    fields: [CartItem.productId],
    references: [Product.id],
  }),
}));
