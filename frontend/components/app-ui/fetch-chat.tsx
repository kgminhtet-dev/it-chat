"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Skeleton } from "@/components/ui/skeleton";
import { getChat } from "@/lib/actions/server-actions";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";

interface Props {
  accountId: string;
  chatId: string;
}

export default function FetchChat({ accountId, chatId }: Props): JSX.Element {
  const { toast } = useToast();
  const setChat = useAppStore((state) => state.setCurrentChat);
  const setMessage = useAppStore((state) => state.setMessages);

  useEffect(() => {
    getChat(accountId, chatId)
      .then((data) => {
        if (data.error)
          return toast({
            variant: "destructive",
            title: data.error,
          });

        setChat(data.chat);
        setMessage(data.messages);
      })
      .catch((error) => console.error(error));
  }, [setChat, setMessage, accountId, chatId]);

  return (
    <div className={"w-screen h-screen"}>
      <Skeleton />
    </div>
  );
}
