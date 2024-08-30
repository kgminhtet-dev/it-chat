import { IMessage } from '@/lib/types/IMessage';
import { StateCreator } from 'zustand';

export interface MessagesSlice {
  messages: IMessage[];

  setMessages(messages: IMessage[]): void;

  addMessage(message: IMessage): void;
}

const createMessageSlice: StateCreator<MessagesSlice> = (set) => ({
  messages: [],

  setMessages: (messages: IMessage[]) =>
    set({ messages }),
  addMessage: (message: IMessage) => {
    set((state) => {
      return {
        messages:
          state.messages.length > 0
            ? [...state.messages, message]
            : [message],
      };
    });
  },
});

export default createMessageSlice;
