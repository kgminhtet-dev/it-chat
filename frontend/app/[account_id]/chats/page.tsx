'use client';

import ConversationBar from '@/components/app-ui/conversation-bar';
import MessageInput from '@/components/app-ui/message-input';
import MessageList from '@/components/app-ui/message-list';
import { useRouter } from 'next/navigation';
import useAppStore from '@/components/hooks/use-app-store';
import { IAccount } from '@/lib/types/IAccount';

export default function ConversationPage() {
  const router = useRouter();
  const account = useAppStore((state) => state.account) as IAccount;
  const currentChat = useAppStore((state) => state.currentChat);
  const messages = useAppStore((state) => state.messages);

  if (!currentChat || !messages) {
    router.push(`/${account?.id}`);
    return null;
  }

  return (
    <div className="h-full grid grid-flow-row grid-rows-12 col-span-1 overflow-auto">
      <div className={'row-span-1'}>
        <ConversationBar />
      </div>
      <div className={'row-span-10 overflow-auto'}>
        <MessageList />
      </div>
      <div className={'row-span-1'}>
        {
          currentChat.isActive
            ? <MessageInput />
            : <div className={'h-full flex justify-start items-center text-sm text-muted-foreground border'}>
              This person is not available on ITChat.
            </div>
        }
      </div>
    </div>
  );
}
