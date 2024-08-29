'use client';

import { useEffect } from 'react';
import { getAccount } from '@/lib/actions/server-actions';
import { Skeleton } from '@/components/ui/skeleton';
import useAppStore from '@/components/hooks/use-app-store';

interface Props {
  accountId: string;
}

export default function FetchAccountData({ accountId }: Props): JSX.Element {
  const setAccount = useAppStore((state) => state.setAccount);
  const setChats = useAppStore((state) => state.setChats);

  useEffect(() => {
    getAccount(accountId)
      .then((data) => {
        setAccount(data.account);
        setChats(data.chats);
      })
      .catch((error) => console.error(error));
  }, [setAccount, accountId, setChats]);

  return <div className={'w-screen h-screen'}>
    <Skeleton />
  </div>;
}
