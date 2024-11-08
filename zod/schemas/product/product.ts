import { removeComma, toEnglishNumberStr } from '@/lib/persian-string';
import { isCancel } from 'axios';
import * as z from 'zod';

export const ProductFormSchema = z
  .object({
    id: z.number().optional(),
    name: z
      .string()
      .min(1, 'ثبت عنوان محصول الزامی است')
      .min(3, 'نام کالا حداقل باید ۳ حرف باشد')
      .refine((value) => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(value), {
        message: `حروف غیر مجاز (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
      })
      .transform((v) => v.trim()),
    price: z
      .string()
      .nullable()
      .refine(
        (value) =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'حروف غیر مجاز است',
        },
      )
      .refine((value) => !value || value[0] !== '۰', 'مقدار غیر مجاز')
      .refine(
        (value) => !value || +toEnglishNumberStr(removeComma(value)) > 10000,
        'حداقل قیمت مجاز ۱۰,۰۰۰ تومان می‌باشد',
      )
      .transform((value) =>
        value ? toEnglishNumberStr(removeComma(value)) : '',
      ),
    discount: z
      .string()
      .nullable()
      .refine(
        (value) =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'مقدار غیر مجاز',
        },
      )
      .refine((value) => !value || value[0] !== '۰', 'مقدار غیر مجاز')
      .transform((value) =>
        value ? toEnglishNumberStr(removeComma(value)) : '',
      ),
    inventory: z
      .string()
      .nullable()
      .refine(
        (value) =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'حروف غیر مجاز',
        },
      )
      .refine(
        (value) => !value || value.length < 2 || value[0] !== '۰',
        'مقدار غیر مجاز',
      )
      .transform((value) =>
        value ? toEnglishNumberStr(removeComma(value)) : '',
      ),
    buyLimit: z
      .string()
      .nullable()
      .refine(
        (value) =>
          !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'حروف غیر مجاز',
        },
      )
      .refine((value) => !value || value[0] !== '۰', 'مقدار غیر مجاز')
      .transform((value) =>
        value ? toEnglishNumberStr(removeComma(value)) : '',
      ),
    isActive: z.boolean(),
    desc: z.string(),
    thumb: z.string(),
    images: z
      .object({
        id: z.number(),
        url: z.string(),
      })
      .array(),
    // .min(1, 'آپلود حداقل یک تصویر الزامی است'),
  })
  .superRefine(
    (
      { isActive, inventory, buyLimit, price, discount, thumb },
      { addIssue, path },
    ) => {
      if (isActive) {
        const requiredFields = { inventory, buyLimit, price };

        const requiredKeys = Object.keys(
          requiredFields,
        ) as (keyof typeof requiredFields)[];

        requiredKeys.forEach((key) => {
          if (!requiredFields[key]) {
            switch (key) {
              // case 'thumb':
              //   addIssue({
              //     code: 'custom',
              //     message: 'فیلد الزامی برای انتشار',
              //     path: ['images'],
              //   });
              //   break;
              default:
                addIssue({
                  code: 'custom',
                  message: 'فیلد الزامی برای انتشار',
                  path: [key],
                  // fatal: true,
                });
                break;
            }
          }
        });

        // if (requiredKeys.some((key) => !requiredFields[key])) {
        //   addIssue({
        //     code: 'custom',
        //     message: 'برای انتشار فیلد‌های الزامی را پر کنید',
        //     path: ['isActive'],
        //     fatal: true,
        //   });
        //   return z.NEVER;
        // }
      }

      if (isActive && !price) {
        addIssue({
          code: 'custom',
          message: 'فیلد الزامی برای انتشار',
          path: ['price'],
          fatal: true,
        });

        return z.NEVER;
      }

      if (discount && !price) {
        addIssue({
          code: 'custom',
          message: 'لطفا قیمت را ثبت کنید',
          path: ['discount'],
          fatal: true,
        });

        return z.NEVER;
      }

      if (price && discount) {
        if (+discount > +price) {
          addIssue({
            code: 'custom',
            message: 'قیمت ویژه نباید بزرگتر از قیمت اصلی باشد',
            path: ['discount'],
            fatal: true,
          });

          return z.NEVER;
        }

        if (+discount === +price) {
          addIssue({
            code: 'custom',
            message: 'قیمت ویژه نباید برابر قیمت اصلی باشد',
            path: ['discount'],
            fatal: true,
          });

          return z.NEVER;
        }
      }
    },
  );

export const ProductImgSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 1 * 1024 * 1024, {
    message: 'حجم فایل نباید بیش از ۱ مگابایت باشد',
  })
  .refine(
    (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
    {
      message: 'نوع فایل باید PNG یا JPG باشد',
    },
  );

export const ProductImgArrSchema = z.array(ProductImgSchema);
