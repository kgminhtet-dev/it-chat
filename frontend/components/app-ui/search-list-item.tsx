"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { IAccount } from "@/lib/types/IAccount";
import { shortName } from "@/lib/utils";
import { emitChatId } from "@/lib/actions/web-socket-actions";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import { IMember } from "@/lib/types/IMember";

interface Props {
  chatId?: string;
  account: IAccount;
  foundUser: IMember;
  clearSearchTerm: any;
}

export default function SearchListItem({
  chatId,
  account,
  foundUser,
  clearSearchTerm,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const socket = useAppStore((state) => state.socket) as Socket;

  return (
    <div
      onClick={async () => {
        if (foundUser.id === account.id)
          return toast({
            variant: "default",
            title: "You can't sent message to yourself.",
          });
        if (chatId) {
          clearSearchTerm("");
          router.push(`/${account.id}/chats/${chatId}`);
        } else {
          emitChatId(socket, {
            senderId: account.id,
            receiverId: foundUser.id,
          });
        }
        clearSearchTerm("");
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
