import LoginForm from '@/components/auth/login-form';
import { GetCookie } from '@/lib/get-cookie';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const session = await GetCookie();

  if (!session) {
    return (
      <div className='flex h-dvh justify-center max-md:mt-20 md:items-center'>
        <LoginForm />
      </div>
    );
  }

  if (session.userId) redirect('/');
};

export default LoginPage;
