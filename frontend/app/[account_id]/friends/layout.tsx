'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

export default function FriendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const accountId = pathname.split('/')[1];

  return (
    <main className={'h-screen w-full grid grid-rows-12'}>
      <div className={'row-span-1 flex justify-center items-center'}>
        <div
          className={
            'h-max bg-gray-100 rounded p-1 border flex justify-start gap-1'
          }
        >
          <Link
            href={`/${accountId}/friends`}
            className={'text-sm pr-2 pl-2 rounded hover:bg-gray-300'}
          >
            Friends
          </Link>
          <Link
            href={`/${accountId}/friends/pendings`}
            className={'text-sm pr-2 pl-2 rounded hover:bg-gray-300'}
          >
            Pending
          </Link>
          <Link
            href={`/${accountId}/friends/friend-requests`}
            className={'text-sm pr-2 pl-2 rounded hover:bg-gray-300'}
          >
            Friend Requests
          </Link>
          <Link
            href={`/${accountId}/friends/add-friends`}
            className={'text-sm pr-2 pl-2 rounded hover:bg-gray-300'}
          >
            Add Friends
          </Link>
        </div>
      </div>
      <div className={'row-span-11 bg-gray-50 p-1'}>
        {children}
        <Toaster />
      </div>
    </main>
  );
}
