'use client';

import useWebsocket from '@/components/hooks/use-websocket';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  token: string;
}

export default function WebSocket({ token }: Props) {
  const { isConnected } = useWebsocket(token);

  if (!isConnected) return (
    <div className={'w-screen h-screen flex justify-center items-center'}>
      <Skeleton />
    </div>
  );

  return <div className="absolute hidden" />;
}