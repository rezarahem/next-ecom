import 'server-only';
import { db } from '../db';
import { Category as CategoryTable } from '../drizzle';
import { eq, sql } from 'drizzle-orm';

export type Category = typeof CategoryTable.$inferSelect | undefined;

export const getCategoryByAddressName = async (
  addressName: string
): Promise<Category | undefined> => {
  return await db.query.Category.findFirst({
    where: eq(CategoryTable.addressName, addressName),
  });
};

export const getCatsExcludeTree = async (treeId: number) => {
  const data = await db.execute(
    sql`
    WITH RECURSIVE excluded_category_tree AS (
      SELECT
        id,
        name,
        addressName,
        parentId
      FROM
        ${CategoryTable}
      WHERE
        id = ${treeId} -- the category to be excluded
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.addressName,
        c.parentId
      FROM
        ${CategoryTable} c
        INNER JOIN excluded_category_tree ect ON ect.id = c.parentId
      )
      SELECT
        id,
        name,
        addressName,
        parentId
      FROM
        ${CategoryTable}
      WHERE
        id NOT IN (SELECT id FROM excluded_category_tree);
      `
  );

  return data;
};

// const data = await db.execute(
//     sql`
//     WITH RECURSIVE excluded_category_tree AS (
//       SELECT
//         id,
//         category_name,
//         category_address_name,
//         parent_id
//       FROM
//         ${Category}
//       WHERE
//         id = ${treeId} -- the category to be excluded
//       UNION ALL
//       SELECT
//         c.id,
//         c.category_name,
//         c.category_address_name,
//         c.parent_id
//       FROM
//         ${Category} c
//         INNER JOIN excluded_category_tree ect ON ect.id = c.parent_id
//       )
//       SELECT
//         id,
//         category_name AS "categoryName",
//         category_address_name AS "categoryAddressName",
//         parent_id AS "parentId"
//       FROM
//         ${Category}
//       WHERE
//         id NOT IN (SELECT id FROM excluded_category_tree);
//       `
//   );
