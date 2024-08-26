'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import SentMessage from '@/components/app-ui/send-message';
import ReceiveMessage from '@/components/app-ui/receive-message';
import { IChat } from '@/lib/types/IChat';
import useAppStore from '@/components/hooks/use-app-store';
import { useEffect } from 'react';
import { getMessages } from '@/lib/actions';

interface Props {
  chat: IChat;
}

export default function MessageList({ chat }: Props) {
  const account = useAppStore((state) => state.profile);
  const setAccount = useAppStore((state) => state.setProfile);
  const messages = useAppStore((state) => state.messages);
  const setMessages = useAppStore((state) => state.setMessages);
  // const [scrollRef, inView, entry] = useInView({
  //   trackVisibility: true,
  //   delay: 500,
  // });
  //
  // useEffect(() => {
  //   if (!inView) {
  //     entry?.target?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [messages, entry, inView]);

  useEffect(() => {
    getMessages(account.id, chat.id).then((messages) => setMessages(messages)).catch((e) => console.error(e));
  }, []);

  return account && (
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
