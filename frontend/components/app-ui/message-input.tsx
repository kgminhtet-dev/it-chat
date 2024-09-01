'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { emitMessage, emitNewChat } from '@/lib/actions/web-socket-actions';
import { IAccount } from '@/lib/types/IAccount';
import { IChat } from '@/lib/types/IChat';
import { Socket } from 'socket.io-client';
import useAppStore from '../hooks/use-app-store';
import { ITime } from '@/lib/types/ITime';
import DisappearMessageTimePicker from '@/components/app-ui/disapper-message-time-picker';
import { SendIcon } from 'lucide-react';

export const InitialTime: ITime = {
  hour: 0,
  minute: 0,
  second: 0,
};

export default function MessageInput() {
  const socket = useAppStore((state) => state.socket) as Socket;
  const account = useAppStore((state) => state.account) as IAccount;
  const chat = useAppStore((state) => state.currentChat) as IChat;
  const messages = useAppStore((state) => state.messages);
  const [message, setMessage] = useState('');
  const [time, setTime] = useState<ITime>(InitialTime);

  const handleSendMessage = (content: string) => {
    if (messages.length === 0) {
      emitNewChat(socket, {
        sender: account.id,
        content,
        life: time,
        chatId: chat.id,
        participants: chat.participants.map((participant) => participant.id),
      });
    } else {
      emitMessage(socket, {
        content,
        life: time,
        chatId: chat.id,
      });
    }
  };

  return (
    <div className="h-full bg-muted p-1 flex items-center bg-gray-300">
      <div className={'absolute flex gap-2 items-center right-4'}>
        <DisappearMessageTimePicker
          time={time}
          setTime={setTime}
        />
        <SendIcon
          onClick={() => {
            const content = message.trim();
            if (content) {
              handleSendMessage(content);
              setMessage('');
              setTime(InitialTime);
            }
          }}
          className={'w-5 h-5 cursor-pointer text-blue-500'}
        />
      </div>
      <Input
        id="message"
        name={'message'}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          const content = message.trim();
          if (e.key === 'Enter' && content) {
            handleSendMessage(content);
            setMessage('');
            setTime(InitialTime);
          }
        }}
        placeholder="Type your message..."
        className="flex-1 border-blue-500 rounded-2xl px-4 py-2 bg-white"
        autoFocus
      />
    </div>
  );
}
