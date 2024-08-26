'use client';

import { useEffect } from 'react';
import { getAccount } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import useAppStore from '@/components/hooks/use-app-store';

interface Props {
  accountId: string;
}

export default function FetchProfile({ accountId }: Props): JSX.Element {
  const router = useRouter();
  const setProfile = useAppStore((state) => state.setProfile);
  const setChats = useAppStore((state) => state.setChats);

  useEffect(() => {
    getAccount(accountId)
      .then((data) => {
        setProfile(data.account);
        setChats(data.chats);
      })
      .catch((error) => console.error(error));
  }, [setProfile, accountId, router, setChats]);

  return <div className={'hidden'} />;
}
