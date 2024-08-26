'use client';

import ChatListItem from '@/components/app-ui/chat-list-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { IChat } from '@/lib/types/IChat';
import { IProfile } from '@/lib/types/IProfile';
import useAppStore from '@/components/hooks/use-app-store';

export default function ChatList() {
  const chats = useAppStore((state) => state.chats);
  const account = useAppStore((state) => state.profile) as IProfile;

  return (
    <div className={'row-span-10 border-b pl-2'}>
      {chats.length > 0 && (
        <ScrollArea className={'h-full pr-2'}>
          {
            chats.map((chat: IChat, index: number) => <div key={index}>
              <ChatListItem chat={chat} accountId={account.id} />
              <Separator className={'my-1'} />
            </div>)
          }
        </ScrollArea>
      )}
    </div>
  );
}
