"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import useAppStore from "./use-app-store";

export default function useWebSocket(token: string) {
  const setSocket = useAppStore((state) => state.setSocket);
  const [isConnected, setIsConnected] = useState(false);
  const url = `ws://localhost:8080`;

  useEffect(() => {
    const socket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.info("[Connected]");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.info("[Disconnected]");
    });

    socket.on("error", (error) => {
      console.error("Socket.io error:", error);
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
