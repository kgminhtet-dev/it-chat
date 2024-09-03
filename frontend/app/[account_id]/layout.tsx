'use client';

import AppNav from '@/components/app-ui/app-nav';
import FetchProfile from '@/components/app-ui/fetch-profile';
import FetchToken from '@/components/app-ui/fetch-token';
import Websocket from '@/components/app-ui/websocket';
import useAppStore from '@/components/hooks/use-app-store';
import { Toaster } from '@/components/ui/toaster';
import { usePathname, useRouter } from 'next/navigation';

export default function AccountLayout({
                                        children,
                                      }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const account_id = pathname.split('/')[1];
  const account = useAppStore((state) => state.account);
  const token = useAppStore((state) => state.token);

  if (!account_id) return router.push('/signin');
  if (!token) return <FetchToken />;
  if (!account) return <FetchProfile accountId={account_id} />;

  return (
    <main className={'w-screen h-screen grid grid-flow-col grid-cols-4'}>
      <Websocket />
      <AppNav account={account} />
      <div className={'h-screen col-span-3 overflow-auto'}>
        {children}
        <Toaster />
      </div>
    </main>
  );
}
