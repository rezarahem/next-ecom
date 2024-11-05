'use client';

import AlertModal from '@/components/ui/alert-modal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CategoryType, ProductType } from '@/drizzle/drizzle';
import { handleError } from '@/lib/handle-error';
import { ProductFormSchema } from '@/zod/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Divide, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { space } from 'postcss/lib/list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type ProductFormClientProps = {
  current: ProductType | undefined;
  allCats: CategoryType[];
};

type Form = z.infer<typeof ProductFormSchema>;

type FormFields =
  | 'id'
  | 'name'
  | 'addressName'
  | 'desc'
  | 'price'
  | 'discount'
  | 'inventory'
  | 'buyLimit'
  | 'isActive';

const ProductFormClient = ({ allCats, current }: ProductFormClientProps) => {
  const [pending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);

  const router = useRouter();

  const title = current ? 'ویرایش محصول' : 'افزودن محصول';
  const description = current
    ? 'مدیریت و ویرایش محصول'
    : 'یک محصول جدید بسازید';
  const action = current ? 'بروزرسانی' : 'افزودن';

  const defaultValues = {
    id: current?.id,
    name: current?.name ?? '',
    addressName: current?.addressName ?? '',
    desc: current?.desc ?? '',
    price: current?.price?.toString() ?? '',
    discount: current?.discount?.toString() ?? '',
    inventory: current?.inventory?.toString() ?? '',
    buyLimit: current?.buyLimit?.toString() ?? '',
    isActive: current?.isActive ?? false,
    // thumb: current?.thumb ?? '',
  } satisfies Form;

  const form = useForm<Form>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues,
    shouldFocusError: true,
  });

  const onSubmit = (formData: Form) => {
    startTransition(async () => {
      try {
        const validatedField = ProductFormSchema.safeParse(formData);

        if (!validatedField.success) {
          toast.error('ورودی نامعتبر');
          return;
        }

        console.log(validatedField.data);
      } catch (error) {
        handleError(error as any);
      }
    });
  };

  const onDelete = () => {};

  return (
    <>
      <AlertModal
        isOpne={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        onConfirm={onDelete}
        loading={pending}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-2 md:grid-cols-[1fr_auto]'
        >
          <div className=''>
            <div className='grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام محصول</FormLabel>
                    <FormControl>
                      <Input disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='addressName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسلاگ</FormLabel>
                    <FormControl>
                      <Input disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت</FormLabel>
                    <FormControl>
                      <Input disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='discount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تخفیف</FormLabel>
                    <FormControl>
                      <Input disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='inventory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>موجودی</FormLabel>
                    <FormControl>
                      <Input disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='buyLimit'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>محدودیت سبد خرید</FormLabel>
                    <FormControl>
                      <Input disabled={pending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name='desc'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>توضیحات</FormLabel>
                    <FormControl>
                      <Textarea
                        className='resize-none'
                        disabled={pending}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
          </div>
          <div className='sticky top-[76px] md:h-[calc(100lvh-96px)] md:w-72 md:border-r md:px-3 lg:w-96'>
            <div className='fixed bottom-0 z-50 flex w-full justify-between gap-2 p-2 max-md:translate-x-3 max-md:translate-y-px max-md:items-center max-md:border-t max-md:bg-primary-foreground md:static md:flex-col md:rounded-md md:border'>
              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between max-md:flex-row-reverse max-md:gap-2'>
                      <div className='flex items-center gap-1'>
                        <FormLabel className='max-md:hidden'>
                          وضعیت انتشار
                        </FormLabel>
                        <FormDescription className='rounded-sm rounded-s border p-[2px]'>
                          {form.getValues('isActive') ? (
                            <span>انتشار</span>
                          ) : (
                            <span>پیش‌نویس</span>
                          )}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <span dir='ltr'>
                          <Switch
                            className='translate-y-1'
                            checked={field.value}
                            onCheckedChange={(value) => {
                              field.onChange(value);
                              form.trigger();
                            }}
                          />
                        </span>
                      </FormControl>
                    </div>
                    <div className='max-md:hidden'>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className='flex items-center'>
                {current && (
                  <Button
                    disabled={pending}
                    variant='destructive'
                    size='icon'
                    onClick={() => setOpenAlertModal(true)}
                  >
                    <Trash className='size-4' />
                  </Button>
                )}

                <Button disabled={pending} className='md:mr-auto' type='submit'>
                  {action}
                </Button>
              </div>
            </div>
            <Separator className='my-3 hidden md:block' />
            <p className='mb-1 font-semibold'>دسته‌بندی</p>
            <ScrollArea
              dir='rtl'
              className='overflow-hidden rounded-md border p-2 md:h-[calc(100%-170px)]'
            >
              <div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum non temporibus necessitatibus numquam similique. Neque
                  inventore veritatis iure non molestias unde animi sequi
                  laborum odio tempora nisi iste, esse magnam!
                </div>
              </div>
            </ScrollArea>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductFormClient;
