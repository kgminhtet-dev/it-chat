"use client";

import ReceiveMessage from "@/components/app-ui/receive-message";
import SentMessage from "@/components/app-ui/send-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IAccount } from "@/lib/types/IAccount";
import useAppStore from "../hooks/use-app-store";
import { IChat } from "@/lib/types/IChat";

export default function MessageList() {
  const messages = useAppStore((state) => state.messages);
  const chat = useAppStore((state) => state.currentChat) as IChat;
  const account = useAppStore((state) => state.account) as IAccount;

  return (
    <ScrollArea className={"w-full h-full p-2"}>
      {messages.length > 0 &&
        messages.map((message, index) =>
          message.sender === account.id ? (
            <SentMessage
              key={message.id + index}
              sender={account}
              message={message}
            />
          ) : (
            <ReceiveMessage
              key={message.id + index}
              sender={chat.contact}
              message={message}
            />
          ),
        )}
      {/*<div ref={scrollRef} />*/}
    </ScrollArea>
  );
}
