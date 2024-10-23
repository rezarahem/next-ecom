import LoginForm from '@/components/auth/login-form';
import { getSeesion } from '@/lib/session';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const user = await getSeesion();

  if (!user) {
    return (
      <div className='flex h-dvh justify-center max-md:mt-20 md:items-center'>
        <LoginForm />
      </div>
    );
  }

  if (user.id) redirect('/');
};

export default LoginPage;
