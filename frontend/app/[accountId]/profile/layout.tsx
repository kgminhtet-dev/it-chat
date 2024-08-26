'use client';

import { Toaster } from '@/components/ui/toaster';

export default function FriendLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
