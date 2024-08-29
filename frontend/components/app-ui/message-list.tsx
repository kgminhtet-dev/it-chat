'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import SentMessage from '@/components/app-ui/send-message';
import ReceiveMessage from '@/components/app-ui/receive-message';
import { IChat } from '@/lib/types/IChat';
import { useState } from 'react';
import { IMessage } from '@/lib/types/IMessage';
import { IProfile } from '@/lib/types/IProfile';

interface Props {
  account: IProfile;
  chat: IChat;
}

export default function MessageList({ account, chat }: Props) {
  const [messages, setMessages] = useState<IMessage[]>(chat.messages);

  return (
    <ScrollArea className={'w-full h-full p-2'}>
      {messages.length > 0 &&
        messages.map((message, index) =>
          (
            message.sender === account.username ? (
              <SentMessage
                key={message.id + index}
                sender={account}
                message={message}
              />
            ) : (
              <ReceiveMessage
                key={message.id + index}
                sender={chat.contact}
                message={message}
              />
            )),
        )}
      {/*<div ref={scrollRef} />*/}
    </ScrollArea>
  );
}
