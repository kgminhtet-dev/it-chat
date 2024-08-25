"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { IProfile } from "@/lib/types/IProfile";
import Link from "next/link";

export default function FriendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = useAppStore((state) => state.profile) as IProfile;

  return (
    <main className={"grid grid-rows-12 col-span-3 overflow-auto"}>
      <div className={"row-span-1 p-1"}>
        <div
          className={
            "h-max bg-gray-100 rounded p-1 pr-2 pl-2 border flex justify-start gap-1"
          }
        >
          <Link
            href={`/chat/${profile.id}/friends`}
            className={"text-sm pr-2 pl-2 rounded hover:bg-gray-300"}
          >
            Friends
          </Link>
          <Link
            href={`/chat/${profile.id}/friends/pendings`}
            className={"text-sm pr-2 pl-2 rounded hover:bg-gray-300"}
          >
            Pending
          </Link>
          <Link
            href={`/chat/${profile.id}/friends/friend-requests`}
            className={"text-sm pr-2 pl-2 rounded hover:bg-gray-300"}
          >
            Friend Requests
          </Link>
          <Link
            href={`/chat/${profile.id}/friends/add-friends`}
            className={"text-sm pr-2 pl-2 rounded hover:bg-gray-300"}
          >
            Add Friends
          </Link>
        </div>
      </div>
      <div className={"row-span-11 overflow-auto"}>{children}</div>
    </main>
  );
}
