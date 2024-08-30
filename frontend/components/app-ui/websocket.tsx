"use client";

import useAppStore from "@/components/hooks/use-app-store";
import { IAccount } from "@/lib/types/IAccount";
import { IMember } from "@/lib/types/IMember";
import { useEffect } from "react";
import { io } from "socket.io-client";

interface Props {
  token: string;
}

export default function Websocket({ token }: Props) {
  const setSocket = useAppStore((state) => state.setSocket);
  const addMessage = useAppStore((state) => state.addMessage);
  const setMessages = useAppStore((state) => state.setMessages);
  const addChat = useAppStore((state) => state.addChat);
  const setChats = useAppStore((state) => state.setChats);
  const chats = useAppStore((state) => state.chats);
  const currentChat = useAppStore((state) => state.currentChat);
  const account = useAppStore((state) => state.account) as IAccount;
  const url = `ws://localhost:8080`;

  useEffect(() => {
    const socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => {
      console.info("[Connected]");
    });

    socket.on("disconnect", () => {
      console.info("[Disconnected]");
    });

    socket.on("error", (error) => {
      console.error("Socket.io error:", error);
    });

    socket.on("message", (message) => {
      setChats(
        chats.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                lastMessage: message.content,
                lastChatTime: message.createdAt,
              }
            : chat,
        ),
      );
      if (currentChat && currentChat.id === message.chatId) addMessage(message);
    });

    socket.on("chat id", (chat) => {
      addChat(chat);
      setMessages([]);
    });

    socket.on("new chat", ({ chat, message }) => {
      const contact = chat.participants.find(
        (member: IMember) => member.id !== account.id,
      );
      if (account.id === message.sender) {
        setChats(
          chats.map((c) => (c.id === chat.id ? { ...chat, contact } : c)),
        );
        addMessage(message);
      } else {
        addChat({ ...chat, contact });
      }
    });

    setSocket(socket);

    return () => {
      setSocket(null);
      socket.disconnect();
    };
  }, [token, url]);

  return <div className="absolute w-0 h-0 top-0-0 left-0 hidden" />;
}
