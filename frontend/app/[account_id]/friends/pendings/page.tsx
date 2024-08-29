import SendFriendRequest from '@/components/app-ui/sent-friend-request';
import { getFriendRequestPending } from '@/lib/actions/server-actions';
import { IFriendRequest } from '@/lib/types/IFriendRequest';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function PendingPage({
                                            params,
                                          }: {
  params: { accountId: string };
}) {
  const pendings: IFriendRequest[] = await getFriendRequestPending(
    params.accountId,
  );

  return pendings.length > 0
    ? (
      <div className={'w-full h-full grid overflow-auto'}>
        <ScrollArea>
          <div className={'h-full flex flex-col gap-1'}>
            {
              pendings.map((friendRequest, index) => (
                <SendFriendRequest
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
          There&apos;s no pending friend requests yet.
        </p>
      </div>
    );
}
