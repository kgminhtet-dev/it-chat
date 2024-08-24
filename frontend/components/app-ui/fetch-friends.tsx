'use client';

import { useEffect } from 'react';
import useAppStore from '@/components/hooks/use-app-store';
import { IProfile } from '@/lib/types/IProfile';
import { getFriends } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function FetchFriends() {
  const setFriends = useAppStore((state) => state.setFriends);
  const profile = useAppStore((state) => state.profile) as IProfile;

  useEffect(() => {
    getFriends(profile.id).then((friends) => setFriends(friends));
  }, [profile.id]);

  return (
    <div className={'p-1'}>
      <Skeleton className={'h-10 w-full'} />
    </div>
  );
}