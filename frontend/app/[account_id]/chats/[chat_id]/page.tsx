"use client";

import ConversationBar from "@/components/app-ui/conversation-bar";
import FetchChat from "@/components/app-ui/fetch-chat";
import MessageInput from "@/components/app-ui/message-input";
import MessageList from "@/components/app-ui/message-list";
import useAppStore from "@/components/hooks/use-app-store";

export default function ConversationPage({
  params,
}: {
  params: { account_id: string; chat_id: string };
}) {
  const chat = useAppStore((state) => state.currentChat);
  if (!chat)
    return <FetchChat accountId={params.account_id} chatId={params.chat_id} />;

  return (
    <div className="h-full row-span-12 flex flex-col">
      <div className={"h-12"}>
        <ConversationBar />
      </div>
      <div className={"flex-1 overflow-auto"}>
        <MessageList />
      </div>
      <MessageInput />
    </div>
  );
}
