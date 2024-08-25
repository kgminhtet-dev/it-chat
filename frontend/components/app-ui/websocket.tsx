'use client';

import useAppStore from '@/components/hooks/use-app-store';
import { IProfile } from '@/lib/types/IProfile';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { IAccount } from '@/lib/types/IAccount';

interface Props {
  token: string;
}

export default function Websocket({ token }: Props) {
  const profile = useAppStore((state) => state.profile) as IProfile;
  const setSocket = useAppStore((state) => state.setSocket);
  const addMessage = useAppStore((state) => state.addMessage);
  const setMessages = useAppStore((state) => state.setMessages);
  const addChat = useAppStore((state) => state.addChat);
  const setChats = useAppStore((state) => state.setChats);
  const chats = useAppStore((state) => state.chats);
  const currentChat = useAppStore((state) => state.currentChat);
  const url = `ws://localhost:8080?id=${profile.id}`;

  useEffect(() => {
    const socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.info('[Connected]');
    });

    socket.on('disconnect', () => {
      console.info('[Disconnected]');
    });

    socket.on('error', (error) => {
      console.error('Socket.io error:', error);
    });

    socket.on('message', (message) => {
      setChats(
        chats.map((chat) =>
          chat.id === message.chatId
            ? {
              id: chat.id,
              contact: chat.contact,
              participants: chat.participants,
              name: chat.name,
              lastMessage: message.content,
              lastChatTime: message.createdAt,
            }
            : chat,
        ),
      );
      addMessage(message);
    });

    socket.on('chat id', (chat) => {
      addChat(chat);
      setMessages([], chat);
    });

    socket.on('new chat', (data) => {
      const { message, chat } = data;
      const contact = chat.participants.find((member: IAccount) => member.username !== profile.username);
      if (profile.username === data.message.sender) {
        setChats(
          chats.map((c) =>
            c.id === chat.id
              ? { ...chat, contact }
              : c,
          ),
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

  return <div className="absolute hidden" />;
}
