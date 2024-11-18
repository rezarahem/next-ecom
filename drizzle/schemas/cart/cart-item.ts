import { Cart, Product } from '@/drizzle';
import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const CartItem = pgTable(
  'cart-item',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => Product.id, { onDelete: 'cascade' }),
    cartId: integer('card_id')
      .notNull()
      .references(() => Cart.id, { onDelete: 'cascade' }),
    inventory: integer('inventory').notNull(),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.cartId] }) }),
);

export const CartItemRel = relations(CartItem, ({ one, many }) => ({
  cart: one(Cart, {
    fields: [CartItem.cartId],
    references: [Cart.id],
  }),
  product: one(Product, {
    fields: [CartItem.productId],
    references: [Product.id],
  }),
}));
