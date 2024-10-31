import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const Category = pgTable('category', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  addressName: varchar('address_name', { length: 50 }).unique().notNull(),
  parentId: integer('parent_id'),
});

export const CatRel = relations(Category, ({ one, many }) => ({
  parentCat: one(Category, {
    fields: [Category.parentId],
    references: [Category.id],
    relationName: 'cat_rel',
  }),
  subCat: many(Category, {
    relationName: 'cat_rel',
  }),
}));
