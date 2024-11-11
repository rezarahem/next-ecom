import { db } from '@/drizzle/db';
import { Category } from '@/drizzle/drizzle';
import { userAceess } from '@/lib/session';
import { CategoryFormSchema, ProductFormSchema } from '@/zod/zod';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAceess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = await req.json();

  const verifiedFields = ProductFormSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  console.log(verifiedFields.data);

  return NextResponse.json({ m: 'دسته‌بندی ایجاد شد' }, { status: 201 });
};