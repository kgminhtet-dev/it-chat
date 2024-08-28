import ReceivedFriendRequest from '@/components/app-ui/received-friend-request';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getFriendRequests } from '@/lib/actions';
import { IFriendRequest } from '@/lib/types/IFriendRequest';

export default async function FriendRequests(
  { params }: { params: { accountId: string } },
) {
  const friendRequests: IFriendRequest[] = await getFriendRequests(
    params.accountId,
  );

  return friendRequests.length > 0
    ? (
      <div className={'w-full h-full grid overflow-auto'}>
        <ScrollArea>
          <div className={'h-full flex flex-col gap-1'}>
            {
              friendRequests.map((friendRequest, index) => (
                <ReceivedFriendRequest
                  key={index}
                  friendRequest={friendRequest}
                  accountId={params.accountId}
                />
              ))
            }
          </div>
        </ScrollArea>
      </div>
    ) : (
      <div className={'h-full flex justify-center items-center'}>
        <p className="border border-gray-600 bg-background text-gray-600 rounded-full pr-7 pl-7 text-sm">
          There&apos;s no friend requests yet.
        </p>
      </div>
    );
}
