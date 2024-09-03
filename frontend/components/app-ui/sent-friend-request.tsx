'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/components/ui/use-toast';
import { cancelFriendRequest } from '@/lib/actions/server-actions';
import { IFriendRequest } from '@/lib/types/IFriendRequest';
import { shortName } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';

interface Props {
  accountId: string;
  friendRequest: IFriendRequest;
}

export default function SendFriendRequest({ accountId, friendRequest }: Props): JSX.Element {
  const { toast } = useToast();

  return (
    <div
      className={'flex border rounded-2xl justify-between items-center p-2 hover:border-blue-500'}
    >
      <div className={'flex gap-2 justify-start items-center'}>
        <Avatar className="h-10 w-10 text-blue-500">
          <AvatarImage src="" />
          <AvatarFallback>
            {shortName(friendRequest.receiver.fullname)}
          </AvatarFallback>
        </Avatar>
        <p className={'font-medium'}>{friendRequest.receiver.fullname}</p>
      </div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            size={'icon'}
            variant={'outline'}
            className={'rounded-full'}
            onClick={async () => {
              const data = await cancelFriendRequest(
                accountId,
                friendRequest.id,
              );
              if (data.error)
                toast({
                  variant: 'destructive',
                  title: data.error,
                });
              else {
                toast({
                  variant: 'default',
                  title: data.message,
                });
              }
            }}
          >
            <Cross2Icon />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className={'w-max p-1 pr-2 pl-2'}>
          <p className={'text-sm'}>Cancel</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
