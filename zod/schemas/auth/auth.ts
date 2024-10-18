import * as z from 'zod';

const persianAlphabet = 'اآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیءئإأؤًٌٍَُِّْٰۀٔڤڠ';
const persianCharRegex = new RegExp(`^[${persianAlphabet}\\s]+$`);

export const UserRegisterSchema = z.object({
  userName: z
    .string()
    .min(1, 'ثبت نام الزامی است')
    .min(3, 'نام حداقل باید ۳ حرف باشد')
    .regex(persianCharRegex, {
      message: 'تنها امکان ثبت نام به زبان فارسی ممکن است',
    }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, {
      message: 'شماره همراه باید ۱۱ رقم باشد و با ۰۹ شروع شود',
    }),
});

export const PhoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, {
      message: 'شماره همراه باید ۱۱ رقم باشد و با ۰۹ شروع شود',
    }),
  // .regex(/^09[0-9\u0660-\u0669\u06F0-\u06F9]{9}$/, {
  //   message: 'شماره همراه باید ۱۱ رقم باشد و با ۰۹ شروع شود',
  // }),
});

export const OtpSchema = z.object({
  otp: z.string().regex(/^\d{5}$/, {
    message: 'کد تایید باید ۵ رقم باشد',
  }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, {
      message: 'شماره همراه باید ۱۱ رقم باشد و با ۰۹ شروع شود',
    }),
});
