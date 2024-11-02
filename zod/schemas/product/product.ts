import { removeComma, toEnglishNumberStr } from '@/lib/persian-string';
import * as z from 'zod';

export const ProductFormSchema = z
  .object({
    id: z.number().optional(),
    name: z
      .string()
      .min(1, 'ثبت عنوان محصول الزامی است')
      .min(3, 'نام کالا حداقل باید ۳ حرف باشد')
      .refine(value => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(value), {
        message: `حروف غیر مجاز (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
      }),
    addressName: z
      .string()
      .min(1, 'ثبت آدرس محصول الزامی است')
      .min(3, 'آدرس محصول حداقل باید ۳ حرف باشد')
      .toLowerCase()
      .refine(
        value =>
          !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹]/gmu.test(value),
        {
          message: 'حروف و اعداد فارسی غیر مجاز است',
        }
      )
      .transform(value => value.split(' ').join('-')),
    desc: z.string(),
    price: z
      .string()
      .min(6, 'حداقل قیمت مجاز ۱۰,۰۰۰ تومان می‌باشد')
      .nullable()
      .refine(
        value =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'حروف غیر مجاز است',
        }
      )
      .refine(value => !value || value[0] !== '۰', 'مقدار غیر مجاز')
      .transform(value =>
        value ? +toEnglishNumberStr(removeComma(value)) : null
      ),
    discount: z
      .string()
      .nullable()
      .refine(
        value =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'مقدار غیر مجاز',
        }
      )
      .refine(value => !value || value[0] !== '۰', 'مقدار غیر مجاز')
      .transform(value =>
        value ? +toEnglishNumberStr(removeComma(value)) : null
      ),
    inventory: z
      .string()
      .nullable()
      .refine(
        value =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'حروف غیر مجاز',
        }
      )
      .refine(
        value => !value || value.length < 2 || value[0] !== '۰',
        'مقدار غیر مجاز'
      )
      .transform(value =>
        value ? +toEnglishNumberStr(removeComma(value)) : null
      ),
    buyLimit: z
      .string()
      .nullable()
      .refine(
        value =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'حروف غیر مجاز',
        }
      )
      .refine(value => !value || value[0] !== '۰', 'مقدار غیر مجاز')
      .transform(value =>
        value ? +toEnglishNumberStr(removeComma(value)) : null
      ),
    thumb: z.string(),
    isActive: z.boolean(),
  })
  .superRefine(
    (
      { isActive, inventory, buyLimit, price, thumb, discount },
      { addIssue, path }
    ) => {
      if (isActive) {
        const requiredFields = { inventory, buyLimit, price, thumb };

        const requiredKeys = Object.keys(
          requiredFields
        ) as (keyof typeof requiredFields)[];

        requiredKeys.forEach(key => {
          if (!requiredFields[key]) {
            addIssue({
              code: 'custom',
              message: 'فیلد الزامی برای انتشار',
              path: [key],
            });
          }
        });

        if (requiredKeys.some(key => !requiredFields[key])) {
          addIssue({
            code: 'custom',
            message: 'برای انتشار فیلد‌های الزامی را پر کنید',
            path: ['isActive'],
            fatal: true,
          });
          return z.NEVER;
        }
      }

      if (price && discount) {
        if (+discount > +price) {
          addIssue({
            code: 'custom',
            message: 'قیمت ویژه نباید بزرگتر از قیمت اصلی باشد.',
            path: ['discount'],
            fatal: true,
          });

          return z.NEVER;
        }

        if (+discount === +price) {
          addIssue({
            code: 'custom',
            message: 'قیمت ویژه نباید برابر قیمت اصلی باشد.',
            path: ['discount'],
            fatal: true,
          });

          return z.NEVER;
        }
      }
    }
  );
