'use client';

import useAppStore from '@/components/hooks/use-app-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IChat } from '@/lib/types/IChat';
import { IProfile } from '@/lib/types/IProfile';
import { getMessages } from '@/lib/actions';
import { cn, formatDateToTimeString, shortName } from '@/lib/utils';

interface Props {
  chat: IChat,
  currentChat?: boolean,
}

export default function ChatListItem({ chat, currentChat = false }: Props) {
  const setMessages = useAppStore((state) => state.setMessages);
  const previousChat = useAppStore((state) => state.currentChat);
  const updateChat = useAppStore((state) => state.updateChat);
  const profile = useAppStore((state) => state.profile) as IProfile;

  return (
    <div
      onClick={async () => {
        if (previousChat?.id === chat.id) return;
        if (previousChat) updateChat(previousChat);
        const messages = await getMessages(profile.id, chat.id);
        setMessages(messages, chat);
      }}
      className={cn(currentChat ? 'bg-blue-100' : '', 'flex items-center gap-4 p-1 pl-2 rounded-xl hover:bg-muted' +
        ' transition-colors')}
    >
      <Avatar className="h-10 w-10 text-blue-500">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(chat.contact.fullname)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 grid gap-1 pr-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{chat.contact.fullname}</div>
          <div className="text-xs text-muted-foreground">
            {formatDateToTimeString(new Date(chat.lastChatTime))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground line-clamp-1">
          {chat.lastMessage}
        </div>
      </div>
    </div>
  );
}
