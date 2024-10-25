'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddNewCat = () => {
  const router = useRouter();
  return (
    <>
      <Button
        onClick={e => {
          router.push('?add=new');
        }}
        className='absolute bottom-5 left-5 rounded-full'
        size='icon'
        variant='secondary'>
        <Plus className='size-8' />
      </Button>
    </>
  );
};

export default AddNewCat;
