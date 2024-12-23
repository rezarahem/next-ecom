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
    slug: string;
    parentId: number | null;
  };
};

const CategoryChip = ({ cat }: CategoryChipProps) => {
  const [pending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const router = useRouter();

  const onDelete = () => {
    setOpenAlertModal(false);
    startTransition(async () => {
      try {
        const { data, status } = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/product/delete-category`,
          {
            id: cat.id,
          },
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
    <div className='flex items-center gap-2 rounded-lg border p-2'>
      <div>{cat.name}</div>
      <div className='flex gap-2'>
        <Link href={`/control/product-categories/${cat.id}`}>
          <Button disabled={pending} size='icon' variant='secondary'>
            <Pencil />
          </Button>
        </Link>
        <Button
          onClick={() => setOpenAlertModal(true)}
          disabled={pending}
          size='icon'
          variant='secondary'
        >
          <Trash2 />
        </Button>
        <AlertModal
          isOpen={openAlertModal}
          onClose={() => setOpenAlertModal(false)}
          onConfirm={onDelete}
          loading={pending}
        />
      </div>
    </div>
  );
};

export default CategoryChip;
