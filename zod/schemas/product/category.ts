import * as z from 'zod';

export const CategoryFormSchema = z.object({
  id: z.number().nullable(),
  name: z
    .string({ required_error: 'الزامی' })
    .min(2, 'نام دسته‌بندی باید حداقل ۲ حرف باشد')
    .refine(v => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(v), {
      message: `حروف غیر مجاز   (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
    }),
  addressName: z
    .string({ required_error: 'الزامی' })
    .toLowerCase()
    .min(2, 'آدرس دسته‌بندی باید حداقل ۲ حرف باشد')
    .refine(v => v !== 'new', {
      message: 'کلمه NEW غیر مجاز است.',
    })
    .refine(v => !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹]/gmu.test(v), {
      message: 'حروف فارسی غیر مجاز است',
    })
    .transform(v => v.split(' ').join('-')),
  parentId: z.number().optional(),
});
