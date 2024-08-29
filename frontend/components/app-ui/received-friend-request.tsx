'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { confirmFriendRequest, rejectFriendRequest } from '@/lib/actions/server-actions';
import { IFriendRequest } from '@/lib/types/IFriendRequest';
import { shortName } from '@/lib/utils';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

interface Props {
  accountId: string;
  friendRequest: IFriendRequest;
}

export default function ReceivedFriendRequest({ accountId, friendRequest }: Props): JSX.Element {
  const { toast } = useToast();

  return (
    <div
      className={'flex bg-gray-200 rounded justify-between items-center p-2'}
    >
      <div className={'flex gap-1 items-center'}>
        <Avatar className="h-10 w-10 text-blue-500">
          <AvatarImage src="" />
          <AvatarFallback>
            {shortName(friendRequest.sender.fullname)}
          </AvatarFallback>
        </Avatar>
        <p>{friendRequest.sender.fullname}</p>
      </div>
      <div className={'flex gap-1'}>
        <Button
          size={'icon'}
          variant={'outline'}
          className={'rounded-full p-2'}
          onClick={async () => {
            const data = await rejectFriendRequest(
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
          <Cross2Icon className={'w-full h-full text-red-600'} />
        </Button>
        <Button
          size={'icon'}
          variant={'outline'}
          className={'rounded-full p-2'}
          onClick={async () => {
            const data = await confirmFriendRequest(
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
          <CheckIcon className={'w-full h-full text-green-600'} />
        </Button>
      </div>
    </div>
  );
}
