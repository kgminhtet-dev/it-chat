'use client';

import useAppStore from '@/components/hooks/use-app-store';
import { Socket } from 'socket.io-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { IAccount } from '@/lib/types/IAccount';
import { IProfile } from '@/lib/types/IProfile';
import { shortName } from '@/lib/utils';
import { getChat } from '@/lib/web-socket-actions';
import { getMessages, searchChatFormHistory } from '@/lib/actions';
import { IChat } from '@/lib/types/IChat';

interface Props {
  chatId?: string;
  foundUser: IAccount;
  clearSearchTerm: any;
}

export default function SearchListItem({ chatId, foundUser, clearSearchTerm }: Props) {
  console.log('founded user ', foundUser);
  const { toast } = useToast();
  const socket = useAppStore((state) => state.socket) as Socket;
  const profile = useAppStore((state) => state.profile) as IProfile;
  const setMessages = useAppStore((state) => state.setMessages);
  const chats = useAppStore((state) => state.chats);

  return (
    <Card
      onClick={async () => {
        if (foundUser.username === profile.username)
          return toast({
            variant: 'default',
            title: 'You can\'t sent message to yourself.',
          });

        console.log('username', profile.username, foundUser.username);
        if (!chatId) {
          getChat(socket, {
            sender: profile.username,
            participants: [profile.username, foundUser.username],
          });
        } else {
          const chat = await searchChatFormHistory(chats, chatId) as IChat;
          const messages = await getMessages(profile.id, chatId);
          setMessages(messages, chat);
        }
        clearSearchTerm('');
      }}
      className="flex items-center rounded-md gap-4 p-2"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(foundUser.fullname)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <div className="font-medium">{foundUser.fullname}</div>
        <div className="text-sm text-muted-foreground">
          {foundUser.username}
        </div>
      </div>
    </Card>
  );
}
