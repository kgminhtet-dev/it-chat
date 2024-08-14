import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { shortName } from '@/lib/utils';
import { IProfile } from '@/lib/types/IProfile';
import Link from 'next/link';

interface Props {
  profile: IProfile;
}

export default function ProfileBar({ profile }: Props) {
  return (
    <Link
      href={'/chat/profile'}
      className={'row-span-1 p-1 pr-2 pl-2'}
    >
      <div
        className="flex justify-end pr-2 pl-2 h-full items-center rounded-md gap-4 bg-primary text-primary-foreground cursor-pointer transition-colors">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">{profile.fullname}</p>
        </div>
        <Avatar className="h-8 w-8 text-foreground">
          <AvatarImage src="" />
          <AvatarFallback>{shortName(profile.fullname)}</AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
}
