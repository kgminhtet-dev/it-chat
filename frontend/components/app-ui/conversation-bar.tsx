import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { shortName } from "@/lib/utils";
import useAppStore from "@/components/hooks/use-app-store";
import { IChat } from "@/lib/types/IChat";

export default function ConversationBar() {
  const currentChat = useAppStore((state) => state.currentChat) as IChat;

  return (
    <div
      className={
        "w-full h-full border-b-2 flex items-center justify-start gap-1 pl-1 rounded-none"
      }
    >
      <Avatar className="w-10 h-10 shrink-0 border-2 border-background">
        <AvatarImage src="" />
        <AvatarFallback>
          {shortName(currentChat.contact.fullname)}
        </AvatarFallback>
      </Avatar>
      <div className="text-lg font-semibold">
        {currentChat.contact.fullname}
      </div>
    </div>
  );
}
