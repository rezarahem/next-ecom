import 'server-only';
import { db } from '../db';
import { eq, sql } from 'drizzle-orm';
import { Category } from '@/drizzle/drizzle';

export type CategoryType = typeof Category.$inferSelect;

export const getAllCats = async (): Promise<CategoryType[]> => {
  return await db.query.Category.findMany();
};

export const getCategoryByName = async (
  name: string,
): Promise<CategoryType | undefined> => {
  return await db.query.Category.findFirst({
    where: eq(Category.name, name),
  });
};

export const getCatsExcludeTree = async (
  treeId: number,
): Promise<CategoryType[]> => {
  const data = await db.execute(
    sql`
    WITH RECURSIVE excluded_category_tree AS (
      SELECT
        id,
        name,
        parent_id
      FROM
        ${Category}
      WHERE
        id = ${treeId} -- the category to be excluded
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM
        ${Category} c
        INNER JOIN excluded_category_tree ect ON ect.id = c.parent_id
      )
      SELECT
        id,
        name,
        parent_id AS "parentId"
      FROM
        ${Category}
      WHERE
        id NOT IN (SELECT id FROM excluded_category_tree);
      `,
  );

  return data.rows as CategoryType[];
};
