'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ScrollArea } from '@/components/ui/scroll-area';
import SentMessage from '@/components/app-ui/send-message';
import ReceiveMessage from '@/components/app-ui/receive-message';
import { IMessage } from '@/lib/types/IMessage';
import { IProfile } from '@/lib/types/IProfile';
import { IChat } from '@/lib/types/IChat';
import useAppStore from '@/components/hooks/use-app-store';

interface Props {
  messages: IMessage[];
  account: IProfile;
  chat: IChat;
}

export default function MessageList({ messages, account, chat }: Props) {
  const setMessages = useAppStore((state) => state.setMessages);
  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 500,
  });

  useEffect(() => {
    if (!inView) {
      entry?.target?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, entry, inView]);

  setMessages(messages);
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
      <div ref={scrollRef} />
    </ScrollArea>
  );
}
