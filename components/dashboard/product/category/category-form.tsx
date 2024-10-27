'use client';
import { Category } from '@/drizzle/db-query/category';
import { CategoryFormSchema } from '@/zod/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type CategoryFormClientProps = {
  currentCat: Category | undefined;
  //   allCats: Category[] | undefined
};

type Form = z.infer<typeof CategoryFormSchema>;

const CategoryFormClient = ({ currentCat }: CategoryFormClientProps) => {
  const [isPending, startTransition] = useTransition();
  const [openCombobox, setOpenCombobox] = useState(false);

  const title = currentCat ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی';
  const description =
    currentCat ? 'مدیریت و ویرایش دسته‌بندی' : 'یک دسته‌بندی جدید ایجاد کنید.';
  const toastMessage = currentCat ? 'دسته‌بندی بروز شد' : 'دسته‌بندی ایجاد شد';
  const action = currentCat ? 'ذخیره تغییرات' : 'ایجاد';

  const form = useForm<Form>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      id: currentCat?.id,
      name: currentCat?.name ?? '',
      addressName: currentCat?.addressName.split('-').join(' ') ?? '',
      parentId: currentCat?.parentId ?? undefined,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          //   onSubmit={form.handleSubmit(!isUpdating ? onSubmit : onUpdate)}
          className='space-y-8'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام دسته‌بندی</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
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
                      disabled={isPending}
                      placeholder='آدرس دسته‌بندی'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name='parentId'
              render={({ field }) => (
                <FormItem className='flex flex-col justify-start'>
                  <FormLabel className='mb-[6px] mt-1'>
                    دسته‌بندی مادر
                  </FormLabel>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn('justify-between', {
                            'font-normal text-muted-foreground': !field.value,
                          })}>
                          {field.value ?
                            allCategoriesExceptParentTreeOrAllCategories.find(
                              category => category.id === field.value
                            )?.categoryName
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
                            {allCategoriesExceptParentTreeOrAllCategories.map(
                              category => (
                                <CommandItem
                                  value={category.categoryName}
                                  key={category.id}
                                  onSelect={() => {
                                    if (
                                      !form.getValues('parentCategorytId') ||
                                      form.getValues('parentCategorytId') !==
                                        category.id
                                    ) {
                                      form.setValue(
                                        'parentCategorytId',
                                        category.id
                                      );
                                    } else {
                                      form.setValue('parentCategorytId', null);
                                    }
                                  }}>
                                  {category.categoryName}
                                  <CheckIcon
                                    className={cn(
                                      'mr-auto h-4 w-4',
                                      category.id === field.value ?
                                        'opacity-100'
                                      : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              )
                            )}
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
            /> */}
          </div>
          <Button disabled={isPending} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryFormClient;
