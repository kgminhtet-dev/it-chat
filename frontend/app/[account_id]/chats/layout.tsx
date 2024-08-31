'use client';

import useAppStore from '@/components/hooks/use-app-store';

export default function ChatLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  const currentChat = useAppStore((state) => state.currentChat);

  return currentChat && children;
}
