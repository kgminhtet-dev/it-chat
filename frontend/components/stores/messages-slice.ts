import { IMessage } from "@/lib/types/IMessage";
import { StateCreator } from "zustand";
import { IChat } from "@/lib/types/IChat";

export interface MessagesSlice {
  messages: IMessage[];
  currentChat: IChat | undefined;

  setMessages(messages: IMessage[], chat: IChat): void;

  addMessage(message: IMessage): void;
}

const createMessageSlice: StateCreator<MessagesSlice> = (set) => ({
  messages: [],
  currentChat: undefined,

  setMessages: (messages: IMessage[], chat: IChat) =>
    set({ messages, currentChat: chat }),
  addMessage: (message: IMessage) =>
    set((state) => ({
      messages:
        state.messages.length > 0 ? [...state.messages, message] : [message],
      currentChat: state.currentChat
        ? {
            ...state.currentChat,
            lastMessage: message.content,
            lastChatTime: message.createdAt,
          }
        : undefined,
    })),
});

export default createMessageSlice;
