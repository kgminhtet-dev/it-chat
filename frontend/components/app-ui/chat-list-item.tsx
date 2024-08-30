"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMessages } from "@/lib/actions/server-actions";
import { IChat } from "@/lib/types/IChat";
import { cn, formatDateToTimeString, shortName } from "@/lib/utils";
import Link from "next/link";
import useAppStore from "../hooks/use-app-store";

interface Props {
  accountId: string;
  chat: IChat;
}

export default function ChatListItem({ accountId, chat }: Props) {
  const currentChat = useAppStore((state) => state.currentChat);
  const setMessages = useAppStore((state) => state.setMessages);
  const setCurrentChat = useAppStore((state) => state.setCurrentChat);

  return (
    <Link
      href={`/${accountId}/chats/${chat.id}`}
      onClick={async () => {
        setCurrentChat(chat);
        const messages = await getMessages(accountId, chat.id);
        setMessages(messages);
      }}
      className={cn(
        "flex h-14 items-center gap-4 p-2 rounded-xl hover:bg-muted transition-colors",
        currentChat?.id === chat.id && " bg-blue-100",
      )}
    >
      <Avatar className="h-10 w-10 text-blue-500">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(chat.contact.fullname)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 grid gap-1 pr-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{chat.contact.fullname}</div>
          <div className="text-xs text-muted-foreground">
            {chat.lastChatTime &&
              formatDateToTimeString(new Date(chat.lastChatTime))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground line-clamp-1">
          {chat.lastMessage}
        </div>
      </div>
    </Link>
  );
}
