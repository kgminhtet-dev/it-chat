'use client';

import useAppStore from '@/components/hooks/use-app-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { IAccount } from '@/lib/types/IAccount';
import { shortName } from '@/lib/utils';
import { emitChatId } from '@/lib/actions/web-socket-actions';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { IMember } from '@/lib/types/IMember';
import { IChat } from '@/lib/types/IChat';
import alreadyChats, { getChat } from '@/lib/actions/server-actions';

interface Props {
  chat?: IChat;
  account: IAccount;
  foundUser: IMember;
  clearSearchTerm: any;
}

export default function SearchListItem({
                                         chat,
                                         account,
                                         foundUser,
                                         clearSearchTerm,
                                       }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const chats = useAppStore((state) => state.chats);
  const setCurrentChat = useAppStore((state) => state.setCurrentChat);
  const socket = useAppStore((state) => state.socket) as Socket;
  const setMessages = useAppStore((state) => state.setMessages);

  return (
    <div
      onClick={async () => {

        if (foundUser.id === account.id)
          return toast({
            variant: 'default',
            title: 'You can\'t sent message to yourself.',
          });

        if (!chat) {
          const alreadyChat = await alreadyChats(chats, foundUser.username);

          if (alreadyChat) {
            const data = await getChat(account.id, alreadyChat.id);
            if (data.error)
              return toast({
                variant: 'destructive',
                title: data.error,
              });
            setCurrentChat(data.chat);
            setMessages(data.messages);
          } else {
            emitChatId(socket, {
              senderId: account.id,
              receiverId: foundUser.id,
            });
          }

          clearSearchTerm('');
          router.push(`/${account.id}/chats`);
          return;
        }

        const data = await getChat(account.id, chat.id);
        if (data.error)
          return toast({
            variant: 'destructive',
            title: data.error,
          });
        setCurrentChat(data.chat);
        setMessages(data.messages);
        clearSearchTerm('');
        router.push(`/${account.id}/chats`);
      }}
      className="flex items-center rounded-md gap-4"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(foundUser.fullname)}</AvatarFallback>
      </Avatar>
      <div className="font-medium">{foundUser.fullname}</div>
    </div>
  );
}
