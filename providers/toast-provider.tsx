'use client';
import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <div>
      <Toaster position='bottom-right' />
    </div>
  );
};
