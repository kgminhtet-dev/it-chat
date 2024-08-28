'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { sendFriendRequest } from '@/lib/actions';
import { useState } from 'react';

export default function AddFriendsPage(
  { params }: { params: { account_id: string } },
) {
  const { toast } = useToast();
  const [username, setUsername] = useState('');

  return (
    <div className={'h-full w-full flex flex-col p-1 pl-2 pr-3'}>
      <div className={'flex gap-1'}>
        <Input value={'@'} disabled={true} className={'w-10'} />
        <Input
          type={'search'}
          value={username}
          className={'bg-white'}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={'You can add friends with their ITChat usernames.'}
        />
        <Button
          onClick={async () => {
            if (username.trim()) {
              const data = await sendFriendRequest(params.account_id, username);
              if (data.error) {
                toast({
                  variant: 'destructive',
                  title: data.error,
                });
                return;
              }
              setUsername('');
              toast({
                title: data.message,
              });
            }
          }}
        >
          Send Friend Request
        </Button>
      </div>
    </div>
  );
}
