'use client';

import { CategoryType, ProductType } from '@/drizzle/drizzle';
import { ProductFormSchema } from '@/zod/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ProductFormClientProps = {
  currentPro: ProductType | undefined;
  allCats: CategoryType[];
};

type Form = z.infer<typeof ProductFormSchema>;

const ProductFormClient = ({ allCats, currentPro }: ProductFormClientProps) => {
  const [pending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const router = useRouter();

  const title = currentPro ? 'ویرایش محصول' : 'افزودن محصول';
  const description =
    currentPro ? 'مدیریت و ویرایش محصول' : 'یک محصول جدید بسازید';
  const action = currentPro ? 'بروزرسانی' : 'افزودن';

  const defaultValues = {
    id: currentPro?.id,
    name: currentPro?.name ?? '',
    addressName: currentPro?.addressName ?? '',
    desc: currentPro?.desc ?? '',
    price: currentPro?.price ?? null,
    discount: currentPro?.discount ?? null,
    inventory: currentPro?.inventory ?? null,
    buyLimit: currentPro?.buyLimit ?? null,
    thumb: currentPro?.thumb ?? '',
    isActive: currentPro?.isActive ?? false,
  } satisfies Form;

  const form = useForm<Form>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues,
  });

  return <div></div>;
};

export default ProductFormClient;
