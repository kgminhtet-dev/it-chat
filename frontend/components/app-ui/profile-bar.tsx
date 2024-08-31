import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IAccount } from '@/lib/types/IAccount';
import { shortName } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  account: IAccount;
}

export default function ProfileBar({ account }: Props) {
  return (
    <div className={'row-span-1 flex justify-between items-center p-2 border-2'}>
      <Link
        href={`/${account.id}/friends/add-friends`}
        className={
          'p-1 pr-3 pl-3 text-sm border text-primary-foreground bg-blue-500 rounded border' +
          ' border-gray-300'
        }
      >
        Add Friend
      </Link>
      <Link
        href={`/${account.id}/profile`}
        className={'rounded-full shadow-md'}
      >
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className={'bg-green-600 text-white font-bold'}>
            {shortName(account.fullname)}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}
