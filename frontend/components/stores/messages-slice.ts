import { IChat } from "@/lib/types/IChat";
import { IMessage } from "@/lib/types/IMessage";
import { StateCreator } from "zustand";

export interface MessagesSlice {
  messages: IMessage[];
  currentChat: IChat | undefined;

  setMessages(messages: IMessage[], chat: IChat | undefined): void;

  addMessage(message: IMessage): void;
}

const createMessageSlice: StateCreator<MessagesSlice> = (set) => ({
  messages: [],
  currentChat: undefined,

  setMessages: (messages: IMessage[], chat: IChat) =>
    set({ messages, currentChat: chat }),
  addMessage: (message: IMessage) => {
    set((state) => {
      if (state.currentChat?.id === message.chatId)
        return {
          messages:
            state.messages.length > 0
              ? [...state.messages, message]
              : [message],
          currentChat: {
            ...state.currentChat,
            lastMessage: message.content,
            lastChatTime: message.createdAt,
          },
        };
      return state;
    });
  },
});

export default createMessageSlice;
