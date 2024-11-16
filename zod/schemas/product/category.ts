import * as z from 'zod';

export const CategoryFormSchema = z
  .object({
    id: z.number().optional(),
    name: z
      .string({ required_error: 'الزامی' })
      .min(2, 'نام دسته‌بندی باید حداقل ۲ حرف باشد')
      .refine((v) => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(v), {
        message: `حروف غیر مجاز (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
      })
      .transform((v) => v.trim()),
    slug: z.string().trim(),
    parentId: z.number().nullable(),
  })
  .transform((form) => {
    const { name, slug } = form;

    if (slug) {
      const slugSlug = slug.split(' ').join('-');
      return {
        ...form,
        slug: slugSlug,
      };
    } else {
      const nameSlug = name.split(' ').join('-');

      return {
        ...form,
        slug: nameSlug,
      };
    }
  });
