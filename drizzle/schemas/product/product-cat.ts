import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { Product } from './product';
import { Category } from './category';
import { relations } from 'drizzle-orm';

export const ProductCat = pgTable(
  'product_cat',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => Product.id, { onDelete: 'cascade' }),
    catId: integer('cat_id')
      .notNull()
      .references(() => Category.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.catId] }) }),
);

export const ProductCatRel = relations(ProductCat, ({ one }) => ({
  product: one(Product, {
    fields: [ProductCat.productId],
    references: [Product.id],
  }),
  cat: one(Category, {
    fields: [ProductCat.catId                       ],
    references: [Category.id],
  }),
}));
