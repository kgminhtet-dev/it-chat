'use client';

import useAppStore from '@/components/hooks/use-app-store';
import { Input } from '@/components/ui/input';
import { IChat } from '@/lib/types/IChat';
import { emitMessage, startChat } from '@/lib/web-socket-actions';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { IProfile } from '@/lib/types/IProfile';

interface Props {
  chat: IChat;
}

export default function MessageInput({ chat }: Props) {
  const account = useAppStore((state) => state.profile) as IProfile;
  const [message, setMessage] = useState('');
  const messages = useAppStore((state) => state.messages);
  const socket = useAppStore((state) => state.socket) as Socket;

  return (
    <div className="bg-muted p-1 flex items-center gap-2 rounded-md bg-gray-300">
      <Input
        id="message"
        name={'message'}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && message) {
            if (messages.length === 0) {
              startChat(socket, {
                content: message,
                sender: account.username,
                participants: [account.username, chat.contact.username],
                chatId: chat.id,
              });
            } else {
              emitMessage(socket, {
                chatId: chat.id,
                sender: account.username,
                content: message,
              });
            }
            setMessage('');
          }
        }}
        placeholder="Type your message..."
        className="flex-1 border-blue-500 rounded-2xl px-4 py-2 bg-white"
        autoFocus
      />
    </div>
  );
}
