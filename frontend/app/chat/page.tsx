'use client';

import ChatView from '@/components/app-ui/chat-view';
import useWebsocket from '@/components/hooks/use-websocket';
import { Skeleton } from '@/components/ui/skeleton';
import useAppStore from '@/components/hooks/use-app-store';

export default function Chat() {
  const token = useAppStore((state) => state.token) as string;
  const { isConnected } = useWebsocket(token);
  if (!isConnected) {
    return (
      <main className={'w-full h-full flex justify-center items-center'}>
        <Skeleton />
      </main>
    );
  }

  return (
    <ChatView />
  );
}
