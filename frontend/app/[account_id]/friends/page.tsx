import FriendListItem from '@/components/app-ui/friend-list-item';
import { getFriends } from '@/lib/actions';
import { IAccount } from '@/lib/types/IAccount';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function Friends({ params }: { params: { account_id: string } }) {
  const friends = await getFriends(params.account_id);
  return friends.length > 0
    ? (
      <div className={'w-full h-full grid overflow-auto'}>
        <ScrollArea>
          <div className={'h-full flex flex-col gap-1'}>
            {
              friends.map(
                (friend: IAccount, index: number) =>
                  <FriendListItem
                    key={index}
                    accountId={params.account_id}
                    friend={friend}
                  />,
              )
            }
          </div>
        </ScrollArea>
      </div>
    ) : (
      <div className={'h-full flex justify-center items-center'}>
        <p className="border border-gray-600 bg-background text-gray-600 rounded-full pr-7 pl-7 text-sm">
          There&apos;s no friends yet.
        </p>
      </div>
    );
}