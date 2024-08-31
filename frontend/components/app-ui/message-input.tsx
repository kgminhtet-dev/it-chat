'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { emitMessage, emitNewChat } from '@/lib/actions/web-socket-actions';
import { IAccount } from '@/lib/types/IAccount';
import { IChat } from '@/lib/types/IChat';
import { Socket } from 'socket.io-client';
import useAppStore from '../hooks/use-app-store';

export default function MessageInput() {
  const socket = useAppStore((state) => state.socket) as Socket;
  const account = useAppStore((state) => state.account) as IAccount;
  const chat = useAppStore((state) => state.currentChat) as IChat;
  const messages = useAppStore((state) => state.messages);
  const [message, setMessage] = useState('');

  return (
    <div className="bg-muted p-1 flex items-center bg-gray-300">
      <Input
        id="message"
        name={'message'}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          const content = message.trim();
          if (e.key === 'Enter' && content) {
            if (messages.length === 0) {
              emitNewChat(socket, {
                sender: account.id,
                content,
                chatId: chat.id,
                participants: chat.participants.map((participant) => participant.id),
              });
            } else {
              emitMessage(socket, {
                chatId: chat.id,
                sender: account.id,
                content,
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
