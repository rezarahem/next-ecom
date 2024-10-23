import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const Category = pgTable('category', {
  id: serial().primaryKey(),
  name: varchar({ length: 50 }).unique().notNull(),
  addressName: varchar({ length: 50 }).unique().notNull(),
  parentId: integer(),
});

export const CatRel = relations(Category, ({ one, many }) => ({
  parentCat: one(Category, {
    fields: [Category.parentId],
    references: [Category.id],
    relationName: 'catRel',
  }),
  subCat: many(Category, {
    relationName: 'catRel'
  })
}));
