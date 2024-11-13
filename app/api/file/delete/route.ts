import { db } from '@/drizzle/db';
import { File, File as FileTable } from '@/drizzle';
import { s3Delete, s3Upload } from '@/lib/s3';
import { userAccess } from '@/lib/session';
import { ProductImgArrSchema } from '@/zod/schemas/product/product';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAccess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = (await req.json()) as { id: number; url: string };

  const deleted = await s3Delete(data.url);

  if (!deleted) {
    return NextResponse.json({ m: 'خطایی رخ داد' }, { status: 404 });
  }

  await db.delete(File).where(eq(File.id, data.id));

  return NextResponse.json(
    { m: 'فایل با موفقیت حذف شد', image: data },
    { status: 200 },
  );
};
