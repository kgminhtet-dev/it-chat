'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IChat } from '@/lib/types/IChat';
import { shortName } from '@/lib/utils';
import useAppStore from '../hooks/use-app-store';

export default function ConversationBar() {
  const chat = useAppStore((state) => state.currentChat) as IChat;

  return (
    <div className={'h-full flex items-center justify-start gap-1 p-1 border-b-2'}>
      <Avatar className="w-10 h-10 shrink-0 border-2 border-background">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(chat.contact.fullname)}</AvatarFallback>
      </Avatar>
      <div className="text-lg font-semibold">{chat.contact.fullname}</div>
    </div>
  );
}
