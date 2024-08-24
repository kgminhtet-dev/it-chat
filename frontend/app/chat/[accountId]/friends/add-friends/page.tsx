'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sendFriendRequest } from '@/lib/actions';
import useAppStore from '@/components/hooks/use-app-store';
import { useToast } from '@/components/ui/use-toast';
import { IProfile } from '@/lib/types/IProfile';

export default function AddFriends() {
  const { toast } = useToast();
  const profile = useAppStore((state) => state.profile) as IProfile;
  const friends = useAppStore((state) => state.friends);
  const [username, setUsername] = useState('');

  return (
    <div className={'grid-rows-11 col-span-3 flex flex-col p-1 pl-2 pr-3'}>
      <div className={'flex gap-1'}>
        <Input value={'@'} disabled={true} className={'w-10'} />
        <Input
          type={'search'}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={'You can add friends with their ITChat usernames.'}
        />
        <Button
          onClick={async () => {
            if (username.trim()) {
              if (friends && friends.length < 10) {
                const isFriend = friends
                  .find((friend) => friend.username.slice(1) === username);
                if (isFriend) {
                  toast({
                    variant: 'destructive',
                    title: 'You\'re already friend.',
                  });
                  return;
                }
              }
              const data = await sendFriendRequest(profile.id, username);
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