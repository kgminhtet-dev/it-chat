'use client';

import useAppStore from '../hooks/use-app-store';
import useWebSocket from '../hooks/use-websocket';
import { useRouter } from 'next/navigation';

export default function WebSocket() {
  const router = useRouter();
  const token = useAppStore((state) => state.token) as string;
  const { isConnected } = useWebSocket(token);

  if (!isConnected) return;

  return <div className="absolute w-0 h-0 t-0 l-0" />;
}
