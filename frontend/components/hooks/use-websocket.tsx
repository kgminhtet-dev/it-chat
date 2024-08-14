import useAppStore from '@/components/hooks/use-app-store';
import { IAccount } from '@/lib/types/IAccount';
import { IProfile } from '@/lib/types/IProfile';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function useWebsocket(token: string) {
  const [isConnected, setIsConnected] = useState(false);
  const profile = useAppStore((state) => state.profile) as IProfile;
  const setSocket = useAppStore((state) => state.setSocket);
  const addMessage = useAppStore((state) => state.addMessage);
  const setMessages = useAppStore((state) => state.setMessages);
  const addChat = useAppStore((state) => state.addChat);
  const url = `ws://localhost:8080?id=${profile.id}`;

  useEffect(() => {
    const socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.info('[Connected]');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.info('[Disconnected]');
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      console.error('Socket.io error:', error);
    });

    socket.on('message', (message) => {
      addMessage(message);
    });

    socket.on('chat id', (chat) => {
      addChat(chat);
      setMessages([], chat);
    });

    socket.on('new chat', (data) => {
      if (profile.username === data.message.sender) {
        addMessage(data.message);
      } else {
        const contact = data.chat.participants.filter(
          (account: IAccount) => account.username !== profile.username,
        )[0];
        addChat({
          ...data.chat,
          contact,
        });
      }
    });

    setSocket(socket);

    return () => {
      setSocket(null);
      socket.disconnect();
    };
  }, [token, url, profile.username, setSocket, addMessage, addChat, setMessages]);

  return { isConnected };
}
