"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IAccount } from "@/lib/types/IAccount";
import { shortName } from "@/lib/utils";
import Link from "next/link";

interface Props {
  friend: IAccount;
}

export default function FriendListItem({ friend }: Props) {
  const setFriendProfile = useAppStore((state) => state.setFriendProfile);

  return (
    <Link
      href={`/chat/profile/${friend.id}`}
      className={
        "flex justify-between items-center rounded-md bg-blue-50 p-2 cursor-pointer"
      }
    >
      <div className={"flex gap-2 justify-start items-center"}>
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback className={"bg-red-500 text-white "}>
            {shortName(friend.fullname)}
          </AvatarFallback>
        </Avatar>
        <p className="font-medium">{friend.fullname}</p>
      </div>
    </Link>
  );
}
