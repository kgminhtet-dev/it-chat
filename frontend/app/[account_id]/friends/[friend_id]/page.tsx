import { getFriend } from '@/lib/actions/server-actions';
import UnfriendButton from '@/components/app-ui/unfriend-button';
import MessageButton from '@/components/app-ui/message-button';

export default async function FriendPage(
  { params }: { params: { account_id: string; friend_id: string } },
) {
  const { error, friend } = await getFriend(params.account_id, params.friend_id);
  if (error) return <div className={'w-full h-full flex justify-center items-center text-2x font-bold'}>Error
    Found</div>;

  return (
    <main className="w-full h-full flex justify-center pt-10">
      <div className="w-1/2 h-1/2 p-3 border bg-white shadow-sm rounded flex flex-col gap-2 items-center">
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
          <span className="text-5xl">👤</span>
        </div>
        <p className={'text-2xl font-bold'}>{friend.fullname}</p>
        <p className={'text-muted-foreground'}>{friend.username}</p>
        <div className="flex gap-1 items-center justify-center">
          <UnfriendButton accountId={params.account_id} friendId={params.friend_id} />
          <MessageButton friend={friend} />
        </div>
      </div>
    </main>
  );
}