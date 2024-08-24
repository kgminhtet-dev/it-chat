"use client";

import ChatListItem from "@/components/app-ui/chat-list-item";
import useAppStore from "@/components/hooks/use-app-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ChatList() {
  const chats = useAppStore((state) => state.chats);
  const currentChat = useAppStore((state) => state.currentChat);

  return (
    <div className={"row-span-10 border-b pl-2"}>
      {chats.length > 0 && (
        <ScrollArea className={"h-full pr-2"}>
          {currentChat && (
            <ChatListItem chat={currentChat} currentChat={true} />
          )}
          <Separator className={"my-1"} />
          {chats.map(
            (chat, index) =>
              currentChat?.id !== chat.id &&
              chat.lastMessage && (
                <div key={index}>
                  <ChatListItem chat={chat} />
                  <Separator className="my-1" />
                </div>
              ),
          )}
        </ScrollArea>
      )}
    </div>
  );
}
