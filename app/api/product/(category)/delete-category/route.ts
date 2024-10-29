import { db } from '@/drizzle/db';
import { Category } from '@/drizzle/drizzle';
import { checkAdminAccess } from '@/lib/session';
import { CategoryFormSchema } from '@/zod/zod';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const adminAccess = await checkAdminAccess();

  if (!adminAccess) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const { id } = (await req.json()) as { id: number };

  await db.delete(Category).where(eq(Category.id, id));

  return NextResponse.json({ m: 'دسته‌بندی حذف شد' }, { status: 200 });
};
