'use client';

import { useEffect, useState } from 'react';
import { getFriendRequestPending } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';
import useAppStore from '@/components/hooks/use-app-store';
import { IProfile } from '@/lib/types/IProfile';
import { IFriendRequest } from '@/lib/types/IFriendRequest';
import SendFriendRequest from '@/components/app-ui/sent-friend-request';

export default function PendingPage() {
  const { toast } = useToast();
  const [pendings, setPendings] = useState<IFriendRequest[]>([]);
  const profile = useAppStore((state) => state.profile) as IProfile;

  useEffect(() => {
    getFriendRequestPending(profile.id)
      .then((data) => {
        if (data.error) {
          toast({
            variant: 'destructive',
            title: data.message,
          });
          return;
        }
        setPendings(data);
      })
      .catch((error) => console.error(error));
  }, [profile.id, toast]);

  return (
    <div className={'grid-rows-11 col-span-3 flex flex-col gap-1 pl-2 pr-2'}>
      {
        pendings.length > 0
        && (pendings.map((friendRequest, index) =>
          <SendFriendRequest key={index} friendRequest={friendRequest} setPendings={setPendings} />))
      }
    </div>
  );
}