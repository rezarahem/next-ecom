import LoginForm from '@/components/auth/login-form';
import { userSession } from '@/lib/session';
import { redirect } from 'next/navigation';
// type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type SearchParams = Promise<{
  callbackUrl: string;
}>;

const LoginPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const user = await userSession();
  if (user) redirect('/');
  const { callbackUrl } = await searchParams;

  return (
    <div className='flex h-dvh justify-center max-md:mt-20 md:items-center'>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
};

export default LoginPage;
