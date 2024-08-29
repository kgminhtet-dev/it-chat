'use client';

import { Button } from '@/components/ui/button';
import { UserMinus } from 'lucide-react';
import { unFriend } from '@/lib/actions/server-actions';

interface Props {
  accountId: string;
  friendId: string;
}

export default function UnfriendButton({ accountId, friendId }: Props) {
  return (
    <Button
      variant={'outline'}
      className={'text-red-500 hover:text-red-600'}
      onClick={async () => await unFriend(accountId, friendId)}
    >
      <UserMinus className={'mr-2 h-4 w-4'} />
      Unfriend
    </Button>
  );
}