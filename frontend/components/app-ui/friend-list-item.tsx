import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IAccount } from '@/lib/types/IAccount';
import { shortName } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  accountId: string;
  friend: IAccount;
}

export default function FriendListItem({ accountId, friend }: Props) {
  return (
    <Link
      href={`/${accountId}/friends/${friend.id}`}
      className={
        'flex justify-between border items-center rounded-2xl bg-white p-2 cursor-pointer hover:border-blue-500'
      }
    >
      <div className={'flex gap-2 justify-start items-center'}>
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className={'bg-red-500 text-white '}>
            {shortName(friend.fullname)}
          </AvatarFallback>
        </Avatar>
        <p className="font-medium">{friend.fullname}</p>
      </div>
    </Link>
  );
}
