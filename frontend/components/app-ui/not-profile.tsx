'use client';

import { useEffect } from 'react';
import { getProfile } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import useAppStore from '@/components/hooks/use-app-store';

export default function NotProfile() {
  const router = useRouter();
  const setProfile = useAppStore((state) => state.setProfile);
  const setChats = useAppStore((state) => state.setChats);

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (!data.error) {
          setProfile(data.profile);
          setChats(data.chats);
        } else {
          router.push('/signin');
        }
      })
      .catch((error) => console.error(error));
  }, [setProfile, setChats, router]);

  return (
    <main className={'w-screen h-screen flex justify-center items-center'}>
      <Skeleton />
    </main>
  );
}
