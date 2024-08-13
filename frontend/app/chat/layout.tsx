'use client';

import NotProfile from '@/components/app-ui/not-profile';
import { Toaster } from '@/components/ui/toaster';
import { IProfile } from '@/lib/types/IProfile';
import useAppStore from '@/components/hooks/use-app-store';
import SearchBar from '@/components/app-ui/search-bar';
import ChatList from '@/components/app-ui/chat-list';
import ProfileBar from '@/components/app-ui/profile-bar';
import NotToken from '@/components/app-ui/not-token';

export default function ChatLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = useAppStore((state) => state.profile) as IProfile;
  const chats = useAppStore((state) => state.chats);
  const token = useAppStore((state) => state.token);

  if (!profile) {
    return <NotProfile />;
  }

  if (!token) {
    return <NotToken />;
  }

  return (
    <main className={'w-screen h-screen grid grid-flow-col grid-cols-4'}>
      <div
        className={
          'grid grid-flow-row grid-rows-12 col-span-1 border-r-2 overflow-auto'
        }
      >
        <SearchBar />
        <ChatList chats={chats} />
        <ProfileBar profile={profile} />
      </div>
      {children}
      <Toaster />
    </main>
  );
}
