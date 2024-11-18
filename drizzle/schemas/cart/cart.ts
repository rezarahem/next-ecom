import { CartItem, User } from '@/drizzle';
import { relations } from 'drizzle-orm';
import { integer, pgTable, serial } from 'drizzle-orm/pg-core';

export const Cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => User.id, {
      onDelete: 'cascade',
    })
    .unique(),
});

export const CartRel = relations(Cart, ({ one, many }) => ({
  cartItem: many(CartItem),
}));
