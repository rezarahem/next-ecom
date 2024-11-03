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
  const description =
    current ? 'مدیریت و ویرایش محصول' : 'یک محصول جدید بسازید';
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

  // const formState = useFormState({
  //   control: form.control,
  // });

  useEffect(() => {
    const firstInputErr = Object.keys(
      form.formState.errors
    )[0] as keyof typeof form.formState.errors;

    if (firstInputErr && form.formState.errors[firstInputErr]?.ref) {
    }
  }, [form.formState.errors, form]);

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
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {current && (
          <Button
            disabled={pending}
            variant='destructive'
            size='icon'
            onClick={() => setOpenAlertModal(true)}>
            <Trash className='size-4' />
          </Button>
        )}
      </div>
      <Separator className='my-8' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
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
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between gap-2'>
                    <FormLabel>وضعیت</FormLabel>
                    <FormControl>
                      <span dir='ltr'>
                        <Switch
                          className='translate-y-1'
                          checked={field.value}
                          onCheckedChange={value => {
                            field.onChange(value);
                            form.trigger();
                          }}
                        />
                      </span>
                    </FormControl>
                  </div>
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
          <Button disabled={pending} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductFormClient;
