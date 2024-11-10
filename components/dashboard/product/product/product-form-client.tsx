'use client';
import Image from 'next/image';
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
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CategoryType, ProductType } from '@/drizzle/drizzle';
import { handleError } from '@/lib/handle-error';
import { ProductFormSchema } from '@/zod/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Divide,
  FlagTriangleRight,
  ImagePlus,
  Loader2,
  Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition, ChangeEvent, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ProductImgArrSchema } from '@/zod/schemas/product/product';
import axios from 'axios';
import { CatTreeTypes } from '@/drizzle/db-query/category';
import { Checkbox } from '@/components/ui/checkbox';
import { removeRequestMeta } from 'next/dist/server/request-meta';
import { addDash } from '@/lib/persian-string';

type ProductFormClientProps = {
  current: ProductType | undefined;
  allCats: CatTreeTypes[];
};

type Form = z.infer<typeof ProductFormSchema>;

type CatFieldTreeProps = {
  pending: boolean;
  cat: CatTreeTypes;
  field: {
    value: number[];
    onChange: (value: number[]) => void;
  };
};

const ProductFormClient = ({ allCats, current }: ProductFormClientProps) => {
  const [pending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [deleteImage, setDeleteImage] = useState<{
    id: number;
    url: string;
  } | null>(null);
  const [thumb, setThumb] = useState(current?.thumb ?? '');
  const router = useRouter();
  const title = current ? 'ویرایش محصول' : 'افزودن محصول';
  const description = current
    ? 'مدیریت و ویرایش محصول'
    : 'یک محصول جدید بسازید';
  const action = current ? 'بروزرسانی' : 'افزودن';

  const onDrop = useCallback((acceptedFiles: File[]) => {
    upload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    multiple: true,
  });

  const defaultValues = {
    id: current?.id,
    name: current?.name ?? '',
    desc: current?.desc ?? '',
    price: current?.price?.toString() ?? '',
    discount: current?.discount?.toString() ?? '',
    inventory: current?.inventory?.toString() ?? '',
    buyLimit: current?.buyLimit?.toString() ?? '',
    isActive: current?.isActive ?? false,
    thumb: current?.thumb ?? '',
    images: [],
    cats: [],
  } satisfies Form;

  const form = useForm<Form>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues,
  });

  const onFileInputChang = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.files) return;

    upload(Array.from(e.target.files));
  };

  const upload = (d: any) => {
    startTransition(async () => {
      try {
        form.clearErrors('images');

        const validatedFields = ProductImgArrSchema.safeParse(d);

        if (!validatedFields.success) {
          const errorArray = validatedFields.error.errors;
          form.setError('images', {
            message: errorArray[errorArray.length - 1].message,
          });
          return;
        }

        const formData = new FormData();

        validatedFields.data.forEach((file) => {
          formData.append('images', file);
        });

        const { data, status } = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/file/upload`,
          formData,
        );

        switch (status) {
          case 200:
            form.setValue('images', [
              ...form.getValues('images'),
              ...data.images,
            ]);
            toast.success(data.m);
            break;
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  };

  const onSubmit = (formData: Form) => {
    startTransition(async () => {
      try {
        const validatedField = ProductFormSchema.safeParse(formData);

        if (!validatedField.success) {
          toast.error('ورودی نامعتبر');
          return;
        }

        if (current?.id) {
        } else {
          const { data, status } = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/product/create-product`,
            validatedField.data,
          );

          switch (status) {
            case 201:
              toast.success(data.m);
              // router.push(
              //   `/control/products/${data.d.id}/${addDash(data.d.name)}`,
              // );
              break;
          }
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  };

  const onDelete = () => {
    setOpenAlertModal(false);
    startTransition(async () => {
      try {
        if (deleteImage?.id) {
          const { data, status } = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/file/delete`,
            deleteImage,
          );

          switch (status) {
            case 200:
              form.setValue(
                'images',
                form
                  .getValues('images')
                  .filter((img) => img.id !== data.image.id),
              );
              toast.success(data.m);
              break;

            default:
              break;
          }
        } else {
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid gap-4 md:grid-cols-[1fr_auto]'
        >
          <div>
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
            <div>
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تصاویر</FormLabel>
                    <FormControl>
                      <div className='space-y-5'>
                        <div
                          {...getRootProps({
                            onClick: (e) => {
                              e.preventDefault();
                            },
                          })}
                        >
                          <label
                            className={cn(
                              'flex items-center justify-center rounded border-2 border-dashed py-20',
                              {
                                'cursor-pointer hover:opacity-60': !pending,
                                'cursor-not-allowed opacity-50': pending,
                                'border-blue-500': isDragActive,
                              },
                            )}
                          >
                            <input
                              {...getInputProps()}
                              type='file'
                              multiple
                              onChange={onFileInputChang}
                              disabled={pending}
                              hidden
                            />
                            <ImagePlus
                              className={cn('size-4', {
                                'text-blue-500': isDragActive && !pending,
                              })}
                            />
                          </label>
                        </div>

                        <FormMessage />

                        {field.value.length > 0 && (
                          <div className='grid grid-cols-2 gap-4 lg:grid-cols-6'>
                            {field.value.map(({ id, url }) => (
                              <div
                                key={id}
                                className='relative aspect-square overflow-hidden rounded-md'
                              >
                                <div className='absolute left-2 top-2 z-10'>
                                  <Button
                                    variant='destructive'
                                    size='icon'
                                    type='button'
                                    disabled={pending}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setOpenAlertModal(true);
                                      setDeleteImage({
                                        id,
                                        url,
                                      });
                                    }}
                                  >
                                    <Trash className='size-4' />
                                  </Button>
                                </div>
                                <div className='absolute left-12 top-2 z-10'>
                                  <Button
                                    size='icon'
                                    type='button'
                                    disabled={pending}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      if (form.getValues('thumb') === url) {
                                        setThumb('');
                                        form.setValue('thumb', '');
                                      } else {
                                        setThumb(url);
                                        form.setValue('thumb', url);
                                      }
                                    }}
                                    className={cn(
                                      'bg-gray-400 text-slate-700 hover:bg-gray-300',
                                      {
                                        'bg-green-500 text-white hover:bg-green-400 hover:text-white':
                                          thumb === url,
                                      },
                                    )}
                                  >
                                    <FlagTriangleRight className='siz-4' />
                                  </Button>
                                </div>
                                <Image
                                  alt='Image'
                                  src={url}
                                  fill
                                  priority={true}
                                  sizes='100vw'
                                  className='object-cover'
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
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
                            disabled={pending}
                            className='translate-y-1'
                            checked={field.value}
                            onCheckedChange={field.onChange}
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
                    type='button'
                    onClick={() => setOpenAlertModal(true)}
                  >
                    <Trash className='size-4' />
                  </Button>
                )}

                <Button disabled={pending} className='md:mr-auto' type='submit'>
                  {action}
                  {pending && (
                    <span className='-translate-x-px -translate-y-px'>
                      <Loader2 className='animate-spin' />
                    </span>
                  )}
                </Button>
              </div>
            </div>
            <Separator className='my-3 hidden md:block' />
            <p className='mb-1 font-semibold'>دسته‌بندی</p>
            <ScrollArea
              dir='rtl'
              className='overflow-hidden rounded-md border p-2 md:h-[calc(100%-170px)]'
            >
              <div className='space-y-2 p-1'>
                {allCats.map((cat, i) => (
                  <FormField
                    key={cat.id}
                    control={form.control}
                    name='cats'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CatFieldTree
                            cat={cat}
                            field={field}
                            pending={pending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductFormClient;

const CatFieldTree = ({ cat, field, pending }: CatFieldTreeProps) => {
  const checked = field.value.includes(cat.id);

  return (
    <div>
      <div className='flex gap-2'>
        <Checkbox
          disabled={pending}
          checked={checked}
          onCheckedChange={(checked) => {
            field.onChange(
              checked
                ? [...field.value, cat.id]
                : field.value.filter((value) => value !== cat.id),
            );
          }}
        />
        <span className='-translate-y-1'>{cat.name}</span>
      </div>

      {cat.children && cat.children.length > 0 && (
        <div className='mt-2 space-y-2 pr-3'>
          {cat.children.map((child) => (
            <CatFieldTree
              key={child.id}
              cat={child}
              field={field}
              pending={pending}
            />
          ))}
        </div>
      )}
    </div>
  );
};
