'use client';

import { Button } from '@/components/ui/button';
import { handleError } from '@/lib/handle-error';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/ui/alert-modal';

type CategoryChipProps = {
  cat: {
    id: number;
    name: string;
    addressName: string;
    parentId: number | null;
  };
};

const CategoryChip = ({ cat }: CategoryChipProps) => {
  const [pending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const router = useRouter();

  const onDelete = () => {
    startTransition(async () => {
      try {
        const { data, status } = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/product/delete-category`,
          {
            id: cat.id,
          }
        );

        switch (status) {
          case 200:
            router.refresh();
            toast.success(data.m);
            break;
        }
      } catch (error) {
        handleError(error as any);
      }
    });
  };

  return (
    <div className='rounded-lg flex gap-2 items-center border p-2'>
      <div>{cat.name}</div>
      <div className='flex gap-2'>
        <Button disabled={pending} size='icon' variant='secondary'>
          <Link href={`/control/products/categories/${cat.addressName}`}>
            <Pencil />
          </Link>
        </Button>
        <Button
          onClick={() => setOpenAlertModal(true)}
          disabled={pending}
          size='icon'
          variant='secondary'>
          <Trash2 />
        </Button>
        <AlertModal
          isOpne={openAlertModal}
          onClose={() => setOpenAlertModal(false)}
          onConfirm={onDelete}
          loading={pending}
        />
      </div>
    </div>
  );
};

export default CategoryChip;
