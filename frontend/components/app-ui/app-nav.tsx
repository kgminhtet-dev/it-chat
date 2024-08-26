'use client';

import SearchBar from '@/components/app-ui/search-bar';
import ChatList from '@/components/app-ui/chat-list';
import ProfileBar from '@/components/app-ui/profile-bar';
import useAppStore from '@/components/hooks/use-app-store';
import FetchProfile from '@/components/app-ui/fetch-profile';

interface Props {
  accountId: string;
}

export default function AppNav({ accountId }: Props) {
  const account = useAppStore((state) => state.profile);
  if (!account) return <FetchProfile accountId={accountId} />;

  return (
    <div
      className={
        'grid grid-flow-row grid-rows-12 col-span-1 border-r-2 overflow-auto'
      }
    >
      <SearchBar />
      <ChatList />
      <ProfileBar account={account} />
    </div>
  );
}