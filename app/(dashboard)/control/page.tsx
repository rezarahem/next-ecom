import { userAccess } from '@/lib/session';
import { redirect } from 'next/navigation';

const roles: string[] = ['admin'];
const redirectUrl = '/login?callbackUrl=/control';

const ControlPage = async () => {
  const user = await userAccess(roles);
  if (!user) redirect(redirectUrl);

  return <div>control</div>;
};

export default ControlPage;
