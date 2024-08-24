import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IProfile } from "@/lib/types/IProfile";
import { shortName } from "@/lib/utils";
import Link from "next/link";

interface Props {
  profile: IProfile;
}

export default function ProfileBar({ profile }: Props) {
  return (
    <div className={"row-span-1 flex justify-between items-center pl-2 pr-2"}>
      <Link
        href={`/chat/${profile.id}/friends/add-friends`}
        className={
          "p-1 pr-3 pl-3 text-sm text-primary-foreground bg-blue-500 rounded border" +
          " border-gray-300"
        }
      >
        Add Friend
      </Link>
      <Link href={"/chat/profile"} className={"rounded-full shadow-md"}>
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className={"bg-green-600 text-white font-bold"}>
            {shortName(profile.fullname)}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}
