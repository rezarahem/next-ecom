'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';

const HomePage = () => {
  const logout = async () => {
    // await Logout();
    await axios.get(`${process.env.NEXT_PUBLIC_API}/auth/update-session`);
  };

  return <Button onClick={logout}>logout</Button>;
};

export default HomePage;
