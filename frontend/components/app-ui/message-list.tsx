"use client";

import { useInView } from "react-intersection-observer";
import ReceiveMessage from "@/components/app-ui/receive-message";
import SentMessage from "@/components/app-ui/send-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IAccount } from "@/lib/types/IAccount";
import useAppStore from "../hooks/use-app-store";
import { IChat } from "@/lib/types/IChat";
import { useEffect, useLayoutEffect, useRef } from "react";

export default function MessageList() {
  const messages = useAppStore((state) => state.messages);
  const chat = useAppStore((state) => state.currentChat) as IChat;
  const account = useAppStore((state) => state.account) as IAccount;

  const [scrollRef, inView, entry] = useInView({
    trackVisibility: true,
    delay: 500,
  });

  useEffect(() => {
    if (!inView) {
      entry?.target?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, entry, inView]);

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
          )
        )}
      <div ref={scrollRef} />
    </ScrollArea>
  );
}
