'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import useAppStore from '@/components/hooks/use-app-store';
import { alreadyChats, getMessages } from '@/lib/actions';
import { IProfile } from '@/lib/types/IProfile';
import { useRouter } from 'next/navigation';
import { getChat } from '@/lib/web-socket-actions';
import { Socket } from 'socket.io-client';

export default function MessageButton({ to }: { to: string }) {
  const router = useRouter();
  const setMessages = useAppStore((state) => state.setMessages);
  const chats = useAppStore((state) => state.chats);
  const profile = useAppStore((state) => state.profile) as IProfile;
  const socket = useAppStore((state) => state.socket) as Socket;

  return (
    <Button
      variant={'default'}
      size={'icon'}
      onClick={async () => {
        const chat = await alreadyChats(chats, to);
        if (chat) {
          const messages = await getMessages(profile.id, chat.id);
          setMessages(messages, chat);
        } else {
          getChat(socket, {
            sender: profile.username,
            participants: [profile.username, to],
          });
        }
        router.push('/chat');
      }}
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
}