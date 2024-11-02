'use client';
// import { CategoryType } from '@/drizzle/db-query/category';
import { CategoryFormSchema } from '@/zod/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleError } from '@/lib/handle-error';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/ui/alert-modal';
import { CategoryType } from '@/drizzle/drizzle';

type CategoryFormClientProps = {
  currentCat: CategoryType | undefined;
  allCats: CategoryType[];
};

type Form = z.infer<typeof CategoryFormSchema>;

const CategoryFormClient = ({
  currentCat,
  allCats,
}: CategoryFormClientProps) => {
  const [pending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const router = useRouter();

  const title = currentCat ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی';
  const description =
    currentCat ? 'مدیریت و ویرایش دسته‌بندی' : 'یک دسته‌بندی جدید بسازید';
  const action = currentCat ? 'بروزرسانی' : 'افزودن';

  const defaultValues = {
    id: currentCat?.id,
    name: currentCat?.name ?? '',
    addressName: currentCat?.addressName.split('-').join(' ') ?? '',
    parentId: currentCat?.parentId ?? null,
  } satisfies Form;

  const form = useForm<Form>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues,
  });

  const onSubmit = (formData: Form) => {
    startTransition(async () => {
      try {
        const validatedField = CategoryFormSchema.safeParse(formData);

        if (!validatedField.success) {
          toast.error('ورودی نامعتبر');
          return;
        }

        if (currentCat?.id) {
          const { data, status } = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/product/update-category`,
            validatedField.data
          );

          switch (status) {
            case 200:
              toast.success(data.m);
              break;
          }
        } else {
          const { data, status } = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/product/create-category`,
            validatedField.data
          );

          switch (status) {
            case 201:
              toast.success(data.m);
              router.push(
                `/control/products/categories/${form.getValues('addressName')}`
              );
              break;
          }
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      try {
        const id = form.getValues('id');

        const { data, status } = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/product/delete-category`,
          {
            id,
          }
        );

        switch (status) {
          case 200:
            router.push(`/control/products/categories/`);
            toast.success('دسته‌بندی با موفقیت حذف شد');
            break;
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  };

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
        {currentCat && (
          <Button
            onClick={() => setOpenAlertModal(true)}
            variant='destructive'
            size='icon'>
            <Trash className='size-4' />
          </Button>
        )}
      </div>
      <Separator className='my-7' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام دسته‌بندی</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      placeholder='نام دسته‌بندی'
                      {...field}
                    />
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
                  <FormLabel>آدرس دسته‌بندی</FormLabel>
                  <FormControl>
                    <Input
                      disabled={pending}
                      placeholder='آدرس دسته‌بندی'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='parentId'
              render={({ field }) => (
                <FormItem className='flex flex-col justify-start'>
                  <FormLabel className='mb-[6px] mt-1'>
                    دسته‌بندی مادر
                  </FormLabel>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger disabled={pending} asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn('justify-between', {
                            'font-normal text-muted-foreground': !field.value,
                          })}>
                          {field.value ?
                            allCats.find(c => c.id === field.value)?.name
                          : 'انتخاب کنید'}
                          <CaretSortIcon className='-ml-2 size-4 shrink-0 opacity-90' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='start' className='w-[300px] p-0'>
                      <Command>
                        <CommandInput placeholder='جستوجو' className='h-9' />
                        <CommandEmpty>نتیجه یافت نشد</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {allCats.map(c => (
                              <CommandItem
                                value={c.name}
                                key={c.id}
                                onSelect={() => {
                                  if (
                                    !form.getValues('parentId') ||
                                    form.getValues('parentId') !== c.id
                                  ) {
                                    form.setValue('parentId', c.id);
                                    setTimeout(() => {
                                      setOpenCombobox(prev => !prev);
                                    }, 25);
                                  } else {
                                    form.setValue('parentId', null);
                                  }
                                }}>
                                {c.name}
                                <CheckIcon
                                  className={cn(
                                    'mr-auto h-4 w-4',
                                    c.id === field.value ?
                                      'opacity-100'
                                    : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    از اینجا دسته‌بندی مادر را انتخاب کنید. هر دسته‌بندی تنها
                    می‌تواند یک مادر داشته باشد.
                  </FormDescription>
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

export default CategoryFormClient;
