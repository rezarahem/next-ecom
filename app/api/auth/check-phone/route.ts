import { db } from '@/drizzle/db';
import { User } from '@/drizzle/drizzle';
import { utcDate, utcUnix } from '@/lib/date';
import { generateOtp } from '@/lib/generate-otp';
import { sendOtp } from '@/lib/send-otp';
import { PhoneNumberSchema } from '@/zod/zod';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const DIF = +process.env.OTP_AGE!;

const differenceInSecondsToNow = (lastOtpAttempt: string | null) => {
  if (!lastOtpAttempt) return DIF;

  const dif = Math.round((+utcUnix() - +lastOtpAttempt) / 1000);

  if (dif < DIF) {
    return DIF - dif;
  } else {
    return null;
  }
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  const verifiedFields = PhoneNumberSchema.safeParse(data);

  if (!verifiedFields.success) {
    return NextResponse.json({ message: 'ورودی نامعتبر' }, { status: 404 });
  }

  const user = await db.query.User.findFirst({
    columns: {
      lastOtpAttempt: true,
    },
    where: eq(User.phoneNumber, verifiedFields.data.phoneNumber),
  });

  if (!user) {
    return NextResponse.json(
      {
        message: 'برای ورود ثبت نام کنید',
      },
      { status: 202 }
    );
  }

  const dif = differenceInSecondsToNow(user.lastOtpAttempt);

  if (dif) {
    return NextResponse.json({
      message: 'کد تایید قبلی شما هنوز معتبر است',
      otpAge: dif,
    });
  }

  const otp = generateOtp();

  await db
    .update(User)
    .set({
      otp,
      lastOtpAttempt: utcUnix(),
    })
    .where(eq(User.phoneNumber, verifiedFields.data.phoneNumber));

  const res = await sendOtp(verifiedFields.data.phoneNumber, otp);

  if (!res) {
    return NextResponse.json(
      { message: 'خطا در ارسال کد تایید، دقایقی دیگر تلاش کنید' },
      { status: 503 }
    );
  }

  return NextResponse.json({ message: 'کد تایید ارسال شد', otpAge: DIF });
};
