'use client';

import useAppStore from '@/components/hooks/use-app-store';
import { useEffect } from 'react';
import { getMessages } from '@/lib/actions/server-actions';
import { IAccount } from '@/lib/types/IAccount';

interface Props {
  chat_id: string;
}

export default function FetchMessage({ chat_id }: Props) {
  const account = useAppStore((state) => state.account) as IAccount;
  const setMessages = useAppStore((state) => state.setMessages);

  useEffect(() => {
    getMessages(account.id, chat_id)
      .then((messages) => {
        console.log('messages ', messages);
        return setMessages(messages);
      })
      .catch((error) => console.error(error));
  }, []);
}