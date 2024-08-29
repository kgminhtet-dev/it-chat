"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FriendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname().split("/");
  const accountId = pathname[1];
  const currentLink = pathname[pathname.length - 1];

  return (
    <main className={"h-screen w-full grid grid-rows-12"}>
      <div className={"row-span-1 flex justify-center items-center"}>
        <div
          className={
            "h-max bg-gray-100 rounded p-1 border flex justify-start gap-1"
          }
        >
          <Link
            href={`/${accountId}/friends`}
            className={cn(
              "text-sm pr-2 pl-2 rounded hover:bg-gray-200",
              currentLink === "friends" && " border-b border-blue-600",
            )}
          >
            Friends
          </Link>
          <Link
            href={`/${accountId}/friends/pendings`}
            className={cn(
              "text-sm pr-2 pl-2 rounded hover:bg-gray-200",
              currentLink === "pendings" && " border-b border-blue-600",
            )}
          >
            Pending
          </Link>
          <Link
            href={`/${accountId}/friends/friend-requests`}
            className={cn(
              "text-sm pr-2 pl-2 rounded hover:bg-gray-200",
              currentLink === "friend-requests" && " border-b border-blue-600",
            )}
          >
            Friend Requests
          </Link>
          <Link
            href={`/${accountId}/friends/add-friends`}
            className={cn(
              "text-sm pr-2 pl-2 rounded hover:bg-gray-200",
              currentLink === "add-friends" && " border-b border-blue-600",
            )}
          >
            Add Friends
          </Link>
        </div>
      </div>
      <div className={"row-span-11 bg-gray-50 p-1"}>{children}</div>
    </main>
  );
}
