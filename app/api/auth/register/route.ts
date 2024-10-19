import { db } from '@/drizzle/db';
import { User } from '@/drizzle/drizzle';
import { generateOtp } from '@/lib/generate-otp';
import { sendOtp } from '@/lib/send-otp';
import { UserRegisterSchema } from '@/zod/zod';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const verifiedFields = UserRegisterSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 404 });
  }

  const otp = generateOtp();

  await db.insert(User).values({
    phoneNumber: verifiedFields.data.phoneNumber,
    name: verifiedFields.data.userName,
    otp,
  });

  const res = await sendOtp(verifiedFields.data.phoneNumber, otp);

  if (!res) {
    return NextResponse.json(
      { message: 'خطا در ارسال کد تایید، دقایقی دیگر تلاش کنید' },
      { status: 503 }
    );
  }

  return NextResponse.json({ message: 'کد تایید ارسال شد' }, { status: 201 });
};
