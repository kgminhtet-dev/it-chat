import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { shortName } from '@/lib/utils';
import Link from 'next/link';
import { IProfile } from '@/lib/types/IProfile';

interface Props {
  account: IProfile;
}

export default function ProfileBar({ account }: Props) {
  return (
    <div className={'row-span-1 flex justify-between items-center pl-2 pr-2'}>
      <Link
        href={`/${account.id}/friends/add-friends`}
        className={
          'p-1 pr-3 pl-3 text-sm text-primary-foreground bg-blue-500 rounded border' +
          ' border-gray-300'
        }
      >
        Add Friend
      </Link>
      <Link href={`/${account.id}/profile`} className={'rounded-full shadow-md'}>
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
