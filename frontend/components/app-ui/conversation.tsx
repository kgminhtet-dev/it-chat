import MessageList from "@/components/app-ui/message-list";
import ConversationBar from "@/components/app-ui/conversation-bar";

export default function Conversation() {
  return (
    <div className={"h-full flex flex-col"}>
      <div className={"h-12"}>
        <ConversationBar />
      </div>
      <div className={"flex-1 overflow-auto"}>
        <MessageList />
      </div>
    </div>
  );
}
