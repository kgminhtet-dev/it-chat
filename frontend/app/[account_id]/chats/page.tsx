'use client';

import ConversationBar from '@/components/app-ui/conversation-bar';
import MessageInput from '@/components/app-ui/message-input';
import MessageList from '@/components/app-ui/message-list';
import useAppStore from '@/components/hooks/use-app-store';

export default function ConversationPage() {
  const currentChat = useAppStore((state) => state.currentChat);
  const messages = useAppStore((state) => state.messages);
  if (!currentChat) return null;
  if (!messages) return null;

  return (
    <div className="h-full row-span-12 flex flex-col">
      <div className={'h-12 border-b-2'}>
        <ConversationBar />
      </div>
      <div className={'flex-1 overflow-auto'}>
        <MessageList />
      </div>
      <MessageInput />
    </div>
  );
}
