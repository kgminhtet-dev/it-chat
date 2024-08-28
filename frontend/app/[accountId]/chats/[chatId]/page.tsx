'use client';

import ConversationBar from '@/components/app-ui/conversation-bar';
import MessageList from '@/components/app-ui/message-list';
import MessageInput from '@/components/app-ui/message-input';
import { getChat } from '@/lib/actions';
import useAppStore from '@/components/hooks/use-app-store';
import FetchProfile from '@/components/app-ui/fetch-profile';
import { useEffect, useState } from 'react';
import { IChat } from '@/lib/types/IChat';

export default function ConversationPage(
  { params }: { params: { accountId: string, chatId: string } },
) {
  const [chat, setChat] = useState<IChat | undefined>(undefined);
  const account = useAppStore((state) => state.profile);
  const setAccount = useAppStore((state) => state.setProfile);

  useEffect(() => {
    getChat(params.accountId, params.chatId)
      .then((chat) => setChat(chat))
      .catch((error) => console.error(error));
  }, []);

  if (!account) return <FetchProfile accountId={params.accountId} />;

  return chat && (
    <div className="h-full row-span-12 flex flex-col">
      <div className={'h-12'}>
        <ConversationBar chat={chat} />
      </div>
      <div className={'flex-1 overflow-auto'}>
        <MessageList chat={chat} />
      </div>
      <MessageInput chat={chat} />
    </div>
  );
}