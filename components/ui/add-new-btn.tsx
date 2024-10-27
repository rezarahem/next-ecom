import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const AddNewBtn = ({ href }: { href: string }) => {
  return (
    <Link href={href}>
      <Button
        className='absolute bottom-5 left-5 rounded-full'
        size='icon'
        variant='secondary'>
        <Plus className='size-8' />
      </Button>
    </Link>
  );
};

export default AddNewBtn;
