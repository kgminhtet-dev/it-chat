import { getAccount } from '@/lib/actions';
import UnfriendButton from '@/components/app-ui/unFriend-button';

export default async function FriendPage(
  { params }: { params: { accountId: string; friendId: string } },
) {
  const { error, friend } = await getAccount(params.friendId);
  if (error) return <div>Error Found</div>;

  return (
    <main className="w-full h-full flex justify-center">
      <div className="w-1/2 h-1/2 p-2 border shadow-sm rounded flex flex-col gap-2 items-center">
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
          <span className="text-5xl">👤</span>
        </div>
        <p className={'text-2xl font-bond'}>{friend.fullname}</p>
        <p className={'text-muted-foreground'}>{friend.username}</p>
        <UnfriendButton accountId={params.accountId} friendId={params.friendId} />
      </div>
    </main>
  );
}