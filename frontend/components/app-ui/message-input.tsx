"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { Input } from "@/components/ui/input";
import { IChat } from "@/lib/types/IChat";
import { IProfile } from "@/lib/types/IProfile";
import { sendMessage, startChat } from "@/lib/web-socket-actions";
import { useState } from "react";
import { Socket } from "socket.io-client";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const profile = useAppStore((state) => state.profile) as IProfile;
  const currentChat = useAppStore((state) => state.currentChat) as IChat;
  const messages = useAppStore((state) => state.messages);
  const socket = useAppStore((state) => state.socket) as Socket;

  return (
    <div className="bg-muted p-1 flex items-center gap-2 rounded-md bg-gray-300">
      <Input
        id="message"
        name={"message"}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && message) {
            if (messages.length === 0) {
              startChat(socket, {
                content: message,
                sender: profile.username,
                participants: [profile.username, currentChat.contact.username],
                chatId: currentChat.id,
              });
            } else {
              sendMessage(socket, {
                chatId: currentChat.id,
                sender: profile.username,
                content: message,
              });
            }
            setMessage("");
          }
        }}
        placeholder="Type your message..."
        className="flex-1 border-blue-500 rounded-2xl px-4 py-2 bg-white"
        autoFocus
      />
      {/* <Button variant="ghost" size="icon" className="rounded-full">
        <PaperclipIcon className="w-5 h-5" />
        <span className="sr-only">Attach file</span>
      </Button> */}
    </div>
  );
}
