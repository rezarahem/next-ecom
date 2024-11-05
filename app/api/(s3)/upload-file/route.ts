import { s3Upload } from '@/lib/s3';
import { userAceess } from '@/lib/session';
import { ProductImgArrSchema } from '@/zod/schemas/product/product';
import { NextRequest, NextResponse } from 'next/server';

const roles: string[] = ['admin'];

export const POST = async (req: NextRequest) => {
  const user = await userAceess(roles);

  if (!user) {
    return NextResponse.json({ m: 'دسترسی غیر مجاز' }, { status: 403 });
  }

  const data = (await req.json()) as FormData;

  const filesArr: File[] = [];

  data.values().forEach((file) => {
    if (file instanceof File) {
      filesArr.push(file);
    }
  });

  const validatedFields = ProductImgArrSchema.safeParse(filesArr);

  if (!validatedFields.success) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 400 });
  }

  const urls: string[] = [];
  
  for (const file of filesArr) {
    try {
      const url = await s3Upload(file);
      if (url) urls.push(url);
    } catch (error) {}
  }
};
