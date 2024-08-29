import { IChat } from "@/lib/types/IChat";
import { StateCreator } from "zustand";

export interface CurrentChatSlice {
  currentChat: IChat | undefined;

  setCurrentChat: (currentChat: IChat | undefined) => void;
}

const createCurrentChatSlice: StateCreator<CurrentChatSlice> = (set) => ({
  currentChat: undefined,

  setCurrentChat: (currentChat: IChat | undefined) => set({ currentChat }),
});

export default createCurrentChatSlice;
