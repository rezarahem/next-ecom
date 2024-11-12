'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Modal from './model';

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal
      title='آیا مطمئن هستید؟'
      description='این عمل غیرقابل بازگشت است.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex w-full items-center justify-end gap-x-2 space-x-2 pt-6'>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          ادامه
        </Button>

        <Button disabled={loading} variant='outline' onClick={onClose}>
          انصراف
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
