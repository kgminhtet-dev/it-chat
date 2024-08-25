"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { getMessages, searchChatFormHistory } from "@/lib/actions";
import { IAccount } from "@/lib/types/IAccount";
import { IChat } from "@/lib/types/IChat";
import { IProfile } from "@/lib/types/IProfile";
import { shortName } from "@/lib/utils";
import { getChat } from "@/lib/web-socket-actions";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";

interface Props {
  chatId?: string;
  foundUser: IAccount;
  clearSearchTerm: any;
}

export default function SearchListItem({
  chatId,
  foundUser,
  clearSearchTerm,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const socket = useAppStore((state) => state.socket) as Socket;
  const profile = useAppStore((state) => state.profile) as IProfile;
  const setMessages = useAppStore((state) => state.setMessages);
  const chats = useAppStore((state) => state.chats);

  return (
    <div
      onClick={async () => {
        if (foundUser.username === profile.username)
          return toast({
            variant: "default",
            title: "You can't sent message to yourself.",
          });
        if (!chatId) {
          getChat(socket, {
            senderId: profile.id,
            participants: [profile.username, foundUser.username],
          });
        } else {
          const chat = (await searchChatFormHistory(chats, chatId)) as IChat;
          const messages = await getMessages(profile.id, chatId);
          setMessages(messages, chat);
        }
        clearSearchTerm("");
        router.push("/chat");
      }}
      className="flex items-center rounded-md gap-4"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(foundUser.fullname)}</AvatarFallback>
      </Avatar>
      <div className="font-medium">{foundUser.fullname}</div>
    </div>
  );
}
