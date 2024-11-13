import 'server-only';
import { eq, sql } from 'drizzle-orm';
import { Category } from '@/drizzle/drizzle';
import { db } from '@/drizzle/db';

export type CategoryType = typeof Category.$inferSelect;

export type CatTreeTypes = {
  id: number;
  name: string;
  children: CatTreeTypes[];
};

const buildTree = (categories: CategoryType[]): CatTreeTypes[] => {
  const categoryMap = new Map<number, CatTreeTypes>();

  categories.forEach((category) => {
    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      children: [],
    });
  });

  const tree: CatTreeTypes[] = [];

  categories.forEach((category) => {
    const treeNode = categoryMap.get(category.id)!;
    if (category.parentId === null) {
      tree.push(treeNode);
    } else {
      const parentNode = categoryMap.get(category.parentId);
      if (parentNode) {
        parentNode.children.push(treeNode);
      }
    }
  });

  return tree;
};

export const getAllCats = async (): Promise<CategoryType[]> => {
  return await db.query.Category.findMany();
};

export const getAllCatsTree = async (): Promise<CatTreeTypes[]> => {
  const flat = await db.query.Category.findMany();
  return buildTree(flat);
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
