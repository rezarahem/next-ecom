'use client';

import { MoonStar, Sun } from 'lucide-react';
import { RiContrastFill } from 'react-icons/ri';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const ThemeController = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme) setTheme(theme);
  }, [theme, setTheme]);

  return (
    <div className='flex'>
      <div className='flex w-fit items-center gap-1 rounded-full border'>
        <Button
          onClick={e => {
            e.preventDefault();
            setTheme('dark');
          }}
          variant='ghost'
          size='icon'
          className={cn('rounded-full')}>
          <MoonStar className={cn('size-6 rounded-full')} />
        </Button>
        <Button
          onClick={e => {
            e.preventDefault();
            setTheme('system');
          }}
          variant='ghost'
          size='icon'
          className={cn('rounded-full')}>
          <RiContrastFill className={cn('size-6 rounded-full')} />
        </Button>
        <Button
          onClick={e => {
            e.preventDefault();
            setTheme('light');
          }}
          variant='ghost'
          size='icon'
          className={cn('rounded-full')}>
          <Sun
            className={cn('size-6 rounded-full', {
              // 'bg-black': theme === 'light',
            })}
          />
        </Button>
      </div>
    </div>
  );
};

export default ThemeController;
