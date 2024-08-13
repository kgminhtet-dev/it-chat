import { IChat } from "@/lib/types/IChat";
import { StateCreator } from "zustand";

export interface ChatsSlice {
  chats: IChat[];

  setChats: (chats: IChat[]) => void;
  addChat: (chat: IChat) => void;
  updateChat: (chat: IChat) => void;
}

const createChatSilce: StateCreator<ChatsSlice> = (set) => ({
  chats: [],

  setChats: (chats: IChat[]) => set({ chats }),
  updateChat: (updatedChat: IChat) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === updatedChat.id ? updatedChat : chat,
      ),
    })),
  addChat: (chat: IChat) =>
    set((state) => ({
      chats: state.chats ? [chat, ...state.chats] : [chat],
    })),
});

export default createChatSilce;
