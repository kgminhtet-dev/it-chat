import { redirect } from 'next/navigation';
import WebSocket from '@/components/app-ui/websocket';
import ChatList from '@/components/app-ui/chat-list';
import ProfileBar from '@/components/app-ui/profile-bar';
import SearchBar from '@/components/app-ui/search-bar';
import { getCookie } from '@/lib/actions';

export default async function ChatLayout(
  { children }: Readonly<{ children: React.ReactNode }>,
) {
  const account_id = await getCookie('account_id');
  const token = await getCookie('access_token');
  if (!token || !account_id) redirect('/signin');

  return (
    <main className={'h-screen grid grid-flow-col grid-cols-4'}>
      <WebSocket token={token.value} />
      <div
        className={
          'grid grid-flow-row grid-rows-12 col-span-1 border-r-2 overflow-auto'
        }
      >
        <SearchBar />
        <ChatList accountId={account_id.value} />
        <ProfileBar accountId={account_id.value} />
      </div>
      <div className={'grid-rows-12 col-span-3'}>
        {children}
      </div>
      {/*<Toaster />*/}
    </main>
  );
}
