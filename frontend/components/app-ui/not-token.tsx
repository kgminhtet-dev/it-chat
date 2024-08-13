'use client';

import { Skeleton } from '@/components/ui/skeleton';
import useAppStore from '@/components/hooks/use-app-store';
import { useEffect } from 'react';
import { getCookie } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function NotToken() {
  const router = useRouter();
  const setToken = useAppStore((state) => state.setToken);

  useEffect(() => {
    getCookie('access_token')
      .then((token) => setToken(token?.value))
      .catch((error) => router.push('/signin'));
  }, []);

  return (
    <main className={'w-screen h-screen flex justify-center items-center'}>
      <Skeleton />
    </main>
  );
}