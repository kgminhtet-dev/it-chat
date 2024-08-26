import { redirect } from 'next/navigation';
import WebSocket from '@/components/app-ui/websocket';
import { getCookie } from '@/lib/actions';
import AppNav from '@/components/app-ui/app-nav';

export default async function ChatLayout(
  { children }: Readonly<{ children: React.ReactNode }>,
) {
  const account_id = await getCookie('account_id');
  const token = await getCookie('access_token');

  if (!token || !account_id) redirect('/signin');

  return (
    <main className={'h-screen grid grid-flow-col grid-cols-4'}>
      <WebSocket token={token.value} />
      <AppNav accountId={account_id.value} />
      <div className={'grid-rows-12 col-span-3'}>
        {children}
      </div>
    </main>
  );
}
