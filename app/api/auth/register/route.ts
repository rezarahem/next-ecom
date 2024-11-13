import { db } from '@/drizzle/db';
import { User } from '@/drizzle';
import { utcUnix } from '@/lib/date';
import { generateOtp } from '@/lib/generate-otp';
import { sendOtp } from '@/lib/send-otp';
import { UserRegisterSchema } from '@/zod';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const verifiedFields = UserRegisterSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ m: 'ورودی نامعتبر' }, { status: 404 });
  }

  const otp = generateOtp();

  await db.insert(User).values({
    phone: verifiedFields.data.phoneNumber,
    name: verifiedFields.data.userName,
    otp,
    lastOtpAttempt: utcUnix(),
  });

  const res = await sendOtp(verifiedFields.data.phoneNumber, otp);

  if (!res) {
    return NextResponse.json(
      { m: 'خطا در ارسال کد تایید، دقایقی دیگر تلاش کنید' },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { m: 'کد تایید ارسال شد', otpAge: +process.env.OTP_AGE! },
    { status: 201 },
  );
};
