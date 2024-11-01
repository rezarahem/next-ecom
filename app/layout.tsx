import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/providers/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/providers/toast-provider';

const vazir = localFont({
  src: '../fonts/vazirmatn-vf.ttf',
  variable: '--font-vazir',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'next-ecom',
  description: 'next-ecom',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir='rtl' lang='fa' suppressHydrationWarning>
      <body className={vazir.className}>
        <NextTopLoader showSpinner={false} />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
