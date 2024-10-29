import 'server-only';
import { db } from '../db';
import { eq, sql } from 'drizzle-orm';
import { Category } from '@/drizzle/drizzle';

export type CategoryType = typeof Category.$inferSelect;

export const getCategoryByAddressName = async (
  addressName: string
): Promise<CategoryType | undefined> => {
  return await db.query.Category.findFirst({
    where: eq(Category.addressName, addressName),
  });
};

export const getCatsExcludeTree = async (
  treeId: number
): Promise<CategoryType[]> => {
  const data = await db.execute(
    sql`
    WITH RECURSIVE excluded_category_tree AS (
      SELECT
        id,
        name,
        address_name,
        parent_id
      FROM
        ${Category}
      WHERE
        id = ${treeId} -- the category to be excluded
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.address_name,
        c.parent_id
      FROM
        ${Category} c
        INNER JOIN excluded_category_tree ect ON ect.id = c.parent_id
      )
      SELECT
        id,
        name,
        address_name AS "addressName",
        parent_id AS "parentId"
      FROM
        ${Category}
      WHERE
        id NOT IN (SELECT id FROM excluded_category_tree);
      `
  );

  return data.rows as CategoryType[];
};
