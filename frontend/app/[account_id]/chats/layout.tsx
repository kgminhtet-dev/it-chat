'use client';

import useAppStore from '@/components/hooks/use-app-store';

export default function ChatLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  const currentChat = useAppStore((state) => state.currentChat);
  const chats = useAppStore((state) => state.chats);

  console.log('chats ', chats);

  return currentChat && children;
}
