"use client";

import MessageInput from "@/components/app-ui/message-input";
import Conversation from "@/components/app-ui/conversation";
import BlankConversation from "@/components/app-ui/blank-conversation";
import useAppStore from "@/components/hooks/use-app-store";

export default function ChatView() {
  const currentChat = useAppStore((state) => state.currentChat);

  return (
    <div className={"grid grid-flow-row grid-rows-12 col-span-3 overflow-auto"}>
      {!currentChat ? (
        <BlankConversation />
      ) : (
        <>
          <div className={"row-span-11"}>
            <Conversation />
          </div>
          <div className={"row-span-1 pt-1 flex flex-col justify-center"}>
            <MessageInput />
          </div>
        </>
      )}
    </div>
  );
}
