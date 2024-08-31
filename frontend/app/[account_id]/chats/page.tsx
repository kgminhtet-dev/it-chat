'use client';

import ConversationBar from '@/components/app-ui/conversation-bar';
import useAppStore from '@/components/hooks/use-app-store';
import MessageInput from '@/components/app-ui/message-input';
import MessageList from '@/components/app-ui/message-list';

export default function ConversationPage() {
  const currentChat = useAppStore((state) => state.currentChat);
  const messages = useAppStore((state) => state.messages);
  if (!currentChat) return null;
  if (!messages) return null;

  return (
    <div className="h-full grid grid-flow-row grid-rows-12 col-span-1 overflow-auto">
      <div className={'row-span-1'}>
        <ConversationBar />
      </div>
      <div className={'row-span-10 overflow-auto'}>
        <MessageList />
      </div>
      <div className={'row-span-1'}>
        <MessageInput />
      </div>
    </div>
  );
}
