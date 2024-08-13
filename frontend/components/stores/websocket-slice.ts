import { Socket } from "socket.io-client";
import { StateCreator } from "zustand";

export interface WebSocketSlice {
  socket: Socket | null;

  setSocket: (socket: Socket | null) => void;
}

const createWebSocketSlice: StateCreator<WebSocketSlice> = (set) => ({
  socket: null,

  setSocket: (socket: Socket | null) => set({ socket: socket }),
});

export default createWebSocketSlice;
