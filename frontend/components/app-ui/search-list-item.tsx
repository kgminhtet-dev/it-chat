"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Socket } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { IAccount } from "@/lib/types/IAccount";
import { IProfile } from "@/lib/types/IProfile";
import { shortName } from "@/lib/utils";
import { getChat } from "@/lib/web-socket-actions";
import { getMessages, searchChatFormHistory } from "@/lib/actions";

interface Props {
  foundUser: IAccount;
}

export default function SearchListItem({ foundUser }: Props) {
  const { toast } = useToast();
  const socket = useAppStore((state) => state.socket) as Socket;
  const profile = useAppStore((state) => state.profile) as IProfile;
  const setMessages = useAppStore((state) => state.setMessages);
  const chats = useAppStore((state) => state.chats);

  return (
    <Card
      onClick={async () => {
        if (foundUser.username === profile.username)
          return toast({
            variant: "default",
            title: "You can't send to yourself",
          });

        const chat = await searchChatFormHistory(chats, foundUser.username);
        if (!chat) {
          getChat(socket, {
            sender: profile.username,
            participants: [profile.username, foundUser.username],
          });
        } else {
          const messages = await getMessages(profile.id, chat.id);
          setMessages(messages, chat);
        }
      }}
      className="flex items-center rounded-none gap-4 p-2"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback>{shortName(foundUser.fullname)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <div className="font-medium">{foundUser.fullname}</div>
        <div className="text-sm text-muted-foreground">
          {foundUser.username}
        </div>
      </div>
    </Card>
  );
}
