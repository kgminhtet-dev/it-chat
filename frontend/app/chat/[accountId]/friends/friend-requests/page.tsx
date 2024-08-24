'use client';

import ReceivedFriendRequest from '@/components/app-ui/received-friend-request';
import useAppStore from '@/components/hooks/use-app-store';
import { toast } from '@/components/ui/use-toast';
import { getFriendRequests } from '@/lib/actions';
import { IFriendRequest } from '@/lib/types/IFriendRequest';
import { IProfile } from '@/lib/types/IProfile';
import { useEffect, useState } from 'react';

export default function FriendRequests() {
  const profile = useAppStore((state) => state.profile) as IProfile;
  const [friendRequests, setFriendRequests] = useState<IFriendRequest[]>([]);

  useEffect(() => {
    getFriendRequests(profile.id).then((data) => {
      if (data.error) {
        toast({
          variant: 'destructive',
          title: data.message,
        });
        return;
      }
      setFriendRequests(data);
    })
      .catch((error) => console.error(error));
  }, [profile.id]);

  return (
    <div className={'grid-rows-11 col-span-3 flex flex-col gap-1 pl-2 pr-2'}>
      {
        friendRequests.length > 0
        && (friendRequests.map((friendRequest, index) =>
          <ReceivedFriendRequest key={index} friendRequest={friendRequest} setFriendRequests={setFriendRequests} />))
      }
    </div>
  );
}
