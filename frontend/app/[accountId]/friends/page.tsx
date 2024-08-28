import FriendListItem from '@/components/app-ui/friend-list-item';
import { getFriends } from '@/lib/actions';
import { IAccount } from '@/lib/types/IAccount';

export default async function Friends({ params }: { params: { accountId: string } }) {
  const friends = await getFriends(params.accountId);

  return (
    <div className={'grid-rows-12 col-span-3 flex flex-col justify-start pr-3 pl-3 gap-1'}>
      {
        friends.map((friend: IAccount, index: number) => <FriendListItem key={index} friend={friend} />)
      }
    </div>
  );
}