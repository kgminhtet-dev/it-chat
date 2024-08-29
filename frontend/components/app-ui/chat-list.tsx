"use client";

import ChatListItem from "@/components/app-ui/chat-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IAccount } from "@/lib/types/IAccount";
import useAppStore from "../hooks/use-app-store";

export default function ChatList() {
  const account = useAppStore((state) => state.account) as IAccount;
  const chats = useAppStore((state) => state.chats);

  return (
    <div className={"row-span-10 border-b p-1"}>
      {chats.length > 0 && (
        <ScrollArea className={"h-full"}>
          {chats.map((chat, index) => (
            <div key={index}>
              <ChatListItem chat={chat} accountId={account.id} />
              <Separator className={"my-1"} />
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}
