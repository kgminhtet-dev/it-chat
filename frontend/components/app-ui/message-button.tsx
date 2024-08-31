'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import useAppStore from '@/components/hooks/use-app-store';
import alreadyChats, { getChat } from '@/lib/actions/server-actions';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { IAccount } from '@/lib/types/IAccount';
import { emitChatId } from '@/lib/actions/web-socket-actions';
import { useToast } from '@/components/ui/use-toast';

export default function MessageButton({ friend }: { friend: IAccount }) {
  const { toast } = useToast();
  const router = useRouter();
  const setMessages = useAppStore((state) => state.setMessages);
  const setCurrentChat = useAppStore((state) => state.setCurrentChat);
  const chats = useAppStore((state) => state.chats);
  const account = useAppStore((state) => state.account) as IAccount;
  const socket = useAppStore((state) => state.socket) as Socket;

  return (
    <Button
      variant={'outline'}
      size={'icon'}
      className={'text-blue-600 hover:text-blue-500'}
      onClick={async () => {
        const chat = await alreadyChats(chats, friend.username);
        if (chat) {
          const data = await getChat(account.id, chat.id);
          if (data.chat) {
            setCurrentChat(data.chat);
            setMessages(data.messages);
          } else {
            setCurrentChat(chat);
            setMessages([]);
          }
        } else {
          emitChatId(socket, {
            senderId: account.id,
            receiverId: friend.id,
          });
        }
        router.push(`/${account.id}/chats`);
      }}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}
