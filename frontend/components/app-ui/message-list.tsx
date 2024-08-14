'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ScrollArea } from '@/components/ui/scroll-area';
import SentMessage from '@/components/app-ui/send-message';
import ReceiveMessage from '@/components/app-ui/receive-message';
import useAppStore from '@/components/hooks/use-app-store';
import { IMessage } from '@/lib/types/IMessage';
import { IProfile } from '@/lib/types/IProfile';
import { IChat } from '@/lib/types/IChat';

export default function MessageList() {
  const profile = useAppStore((state) => state.profile) as IProfile;
  const currentChat = useAppStore((state) => state.currentChat) as IChat;
  const messages: IMessage[] = useAppStore((state) => state.messages);

  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 500,
  });

  useEffect(() => {
    if (!inView) {
      entry?.target?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, entry, inView]);

  return (
    <ScrollArea className={'w-full h-full p-2'}>
      {messages.length > 0 &&
        messages.map((message, index) =>
          message && (
            message.sender === profile.username ? (
              <SentMessage
                key={message.id + index}
                sender={profile}
                message={message}
              />
            ) : (
              <ReceiveMessage
                key={message.id + index}
                sender={currentChat?.contact}
                message={message}
              />
            )),
        )}
      <div ref={scrollRef} />
    </ScrollArea>
  );
}
