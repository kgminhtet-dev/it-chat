"use client";

import CoverPhoto from "@/components/app-ui/cover-photo";
import useAppStore from "@/components/hooks/use-app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { alreadyChats, getAccount, getMessages, unFriend } from "@/lib/actions";
import { IAccount } from "@/lib/types/IAccount";
import { IProfile } from "@/lib/types/IProfile";
import { getChat } from "@/lib/web-socket-actions";
import { MessageCircle, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function UserProfilePage({
  params,
}: {
  params: { accountId: string };
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [friend, setFriend] = useState<IAccount | null>(null);
  const profile = useAppStore((state) => state.profile) as IProfile;
  const chats = useAppStore((state) => state.chats);
  const setMessages = useAppStore((state) => state.setMessages);
  const socket = useAppStore((state) => state.socket) as Socket;

  useEffect(() => {
    getAccount(params.accountId).then((account) => setFriend(account));
  }, [params.accountId]);

  return (
    friend && (
      <main className={"grid-rows-12 col-span-3 flex flex-col"}>
        <CoverPhoto />
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-5xl">👤</span>
                </div>
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    {friend.fullname}
                  </CardTitle>
                  <p className="text-muted-foreground">{friend.username}</p>
                </div>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                  <Button
                    variant={"outline"}
                    className={"text-red-500 hover:text-red-600"}
                    onClick={async () => {
                      const data = await unFriend(profile.id, friend.id);
                      toast({
                        title: data.message,
                      });
                      router.push(`/chat/${profile.id}/friends`);
                    }}
                  >
                    <UserMinus className={"mr-2 h-4 w-4"} />
                    Unfriend
                  </Button>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={async () => {
                      const chat = await alreadyChats(chats, friend?.username);
                      if (chat) {
                        const messages = await getMessages(profile.id, chat.id);
                        setMessages(messages, chat);
                      } else {
                        getChat(socket, {
                          sender: profile.username,
                          participants: [profile.username, friend?.username],
                        });
                      }
                      router.push("/chat");
                    }}
                  >
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  );
}
