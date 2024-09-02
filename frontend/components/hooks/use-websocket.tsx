'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAppStore from './use-app-store';
import { useToast } from '@/components/ui/use-toast';

export default function useWebSocket(token: string) {
  const { toast } = useToast();
  const setSocket = useAppStore((state) => state.setSocket);
  const [isConnected, setIsConnected] = useState(false);
  const url = `wss://it-chat.onrender.com`;

  useEffect(() => {
    const socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.info('[Connected]');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.info('[Disconnected]');
    });

    socket.on('error', (error) => {
      console.error('Socket.io error:', error);
      toast({
        variant: 'destructive',
        title: error.message,
      });
    });

    setSocket(socket);

    return () => {
      setIsConnected(false);
      setSocket(null);
      socket.disconnect();
    };
  }, [token, url, setSocket]);

  return { isConnected };
}
