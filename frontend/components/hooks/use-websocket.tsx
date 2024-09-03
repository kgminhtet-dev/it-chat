'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAppStore from './use-app-store';
import { useToast } from '@/components/ui/use-toast';
import { onRefresh } from 'next/dist/client/components/react-dev-overlay/pages/client';

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
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      if (error.message === 'Invalid socket') {
        onRefresh();
      } else
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
  }, [token, url, setSocket, toast]);

  return { isConnected };
}
