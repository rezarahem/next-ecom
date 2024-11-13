import { db } from '@/drizzle/db';
import { Category } from '@/drizzle';
import { userAccess } from '@/lib/session';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAccess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const { id } = (await req.json()) as { id: number };

  await db.delete(Category).where(eq(Category.id, id));

  return NextResponse.json({ m: 'دسته‌بندی حذف شد' }, { status: 200 });
};
